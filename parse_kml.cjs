const fs = require('fs');

const kmlPath = 'percorsi/mappa 1 progetto roma.kml';
const kmlText = fs.readFileSync(kmlPath, 'utf8');

// Parse each <Folder> block to extract the folder name and any LineString coordinates inside it
const folderRegex = /<Folder>([\s\S]*?)<\/Folder>/g;
const nameRegex = /<name>([\s\S]*?)<\/name>/;
const coordRegex = /<coordinates>\s*([\s\S]*?)\s*<\/coordinates>/g;

const themeRoutes = {
    amore: [],
    case: [],
    corpi: [],
    cose: [],
};

let folderMatch;
while ((folderMatch = folderRegex.exec(kmlText)) !== null) {
    const folderContent = folderMatch[1];
    const nameMatch = folderContent.match(nameRegex);
    if (!nameMatch) continue;

    const folderName = nameMatch[1].trim().toLowerCase();
    console.log(`Found folder: "${folderName}"`);

    // Determine which theme this folder belongs to
    let themeKey = null;
    if (folderName.startsWith('amore')) themeKey = 'amore';
    else if (folderName.startsWith('case')) themeKey = 'case';
    else if (folderName.startsWith('corpi')) themeKey = 'corpi';
    else if (folderName.startsWith('cose')) themeKey = 'cose';

    if (!themeKey) {
        console.log(`  -> Skipping (not a route folder)`);
        continue;
    }

    // Extract all LineString coordinates within this folder
    let coordMatch;
    const localCoordRegex = /<coordinates>\s*([\s\S]*?)\s*<\/coordinates>/g;
    while ((coordMatch = localCoordRegex.exec(folderContent)) !== null) {
        const coordString = coordMatch[1].trim();
        const points = coordString.split(/\s+/).map(p => {
            const [lng, lat] = p.split(',').map(Number);
            return [lat, lng]; // Leaflet uses [lat, lng]
        }).filter(p => !isNaN(p[0]) && !isNaN(p[1]));

        if (points.length > 2) {
            themeRoutes[themeKey].push(points);
            console.log(`  -> Added ${points.length} points to "${themeKey}"`);
        }
    }
}

console.log('\n--- Summary ---');
for (const [key, segments] of Object.entries(themeRoutes)) {
    const totalPoints = segments.reduce((sum, seg) => sum + seg.length, 0);
    console.log(`${key}: ${segments.length} segment(s), ${totalPoints} total points`);
}

fs.writeFileSync('src/routes.json', JSON.stringify(themeRoutes));
console.log('\nSuccessfully wrote src/routes.json with per-theme routes.');
