const fs = require('fs');

const kmlPath = 'percorsi/mappa 1 progetto roma.kml';
const kmlText = fs.readFileSync(kmlPath, 'utf8');

const coordinateBlocks = [];
const regex = /<coordinates>\s*([\s\S]*?)\s*<\/coordinates>/g;

let match;
while ((match = regex.exec(kmlText)) !== null) {
    const coordString = match[1].trim();
    const points = coordString.split(/\s+/).map(p => {
        const [lng, lat] = p.split(',').map(Number);
        return [lat, lng];
    }).filter(p => !isNaN(p[0]) && !isNaN(p[1]));

    // Only add if it is a genuine path segment (more than 1 point)
    // And to avoid huge jumps between unconnected segments, 
    // Leaflet allows an ARRAY of ARRAYS to render as multi-polyline:
    // e.g. [[ [lat, lng], [lat, lng] ], [ [lat, lng] ]]
    if (points.length > 2) {
        coordinateBlocks.push(points);
    }
}

console.log(`Found ${coordinateBlocks.length} line segments in the KML.`);

// For Leaflet to render a multi-segment line without connecting the endpoints across the city,
// we just pass the array of coordinate arrays. Polyline supports it natively.
const routesData = {
    "amore": coordinateBlocks,
    "case": coordinateBlocks,
    "cose": coordinateBlocks,
    "corpi": coordinateBlocks
};

fs.writeFileSync('src/routes.json', JSON.stringify(routesData));

console.log("Successfully rebuilt src/routes.json with MultiPolyline structure.");
