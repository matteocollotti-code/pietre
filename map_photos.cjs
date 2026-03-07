const fs = require('fs');

function normalizeNameForMatch(name) {
    return name.toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/['"’\n\r()_.-]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

const dataStr = fs.readFileSync('data.json', 'utf8');
const data = JSON.parse(dataStr);

const photosDir = 'public/photos';
const files = fs.readdirSync(photosDir);

const mappings = [];

files.forEach(file => {
    const fNorm = normalizeNameForMatch(file.replace('.jpg', ''));
    const fParts = fNorm.split(' ').filter(p => p.length > 2); // ignore small words like "per", "di", "con", "la"

    data.forEach(d => {
        const dNorm = normalizeNameForMatch(d.name);

        let isMatch = false;

        // Basic
        if (fNorm.includes(dNorm)) isMatch = true;

        // All significant parts exist in data name
        if (fParts.length > 0 && fParts.every(p => dNorm.includes(p))) isMatch = true;

        // Specific fixes:
        if (fNorm.includes('kuth') && dNorm.includes('kuth')) isMatch = true;
        if (fNorm.includes('lovvy') && dNorm.includes('lovvy')) isMatch = true;
        if (fNorm.includes('aurelia finzi') && dNorm.includes('finzi') && dNorm.includes('aurelia')) isMatch = true;
        if (fNorm.includes('emma finzi') && dNorm.includes('finzi') && dNorm.includes('emma')) isMatch = true;
        if (fNorm.includes('ines') && fNorm.includes('revere') && dNorm.includes('revere') && (dNorm.includes('ines') || dNorm.includes('olga'))) isMatch = true;
        if (fNorm.includes('lea behar') && dNorm.includes('behar') && dNorm.includes('lea')) isMatch = true;
        if (fNorm.includes('sara dana') && dNorm.includes('dana') && dNorm.includes('sara')) isMatch = true;
        if (fNorm.includes('emilia levi') && dNorm.includes('levi') && dNorm.includes('emilia')) isMatch = true;
        if (fNorm.includes('elena levi') && dNorm.includes('levi') && dNorm.includes('elena')) isMatch = true;
        if (fNorm.includes('annita') && fNorm.includes('latis') && dNorm.includes('latis') && (dNorm.includes('annita') || dNorm.includes('liliana'))) isMatch = true;
        if (fNorm.includes('graziella') && dNorm.includes('moorais') && dNorm.includes('graziella')) isMatch = true;
        if (fNorm.includes('mafalda') && dNorm.includes('morais') && dNorm.includes('mafalda')) isMatch = true;
        if (fNorm.includes('violetta') && dNorm.includes('silvera') && (dNorm.includes('violetta') || dNorm.includes('bahia'))) isMatch = true;
        if (fNorm.includes('bahia') && dNorm.includes('silvera') && (dNorm.includes('bahia') || dNorm.includes('violetta'))) isMatch = true;

        if (fNorm.includes("kuh") && dNorm.includes("kuth")) isMatch = true;
        if (fNorm.includes("weissenstein") && dNorm.includes("weissenstein")) isMatch = true;
        if (fNorm.includes("glucksmann") && dNorm.includes("gluecksmann")) isMatch = true;
        if (fNorm.includes("sorias") && dNorm.includes("sorias")) isMatch = true;
        if (fNorm.includes("steiner") && dNorm.includes("steiner") && dNorm.includes("guglielmo")) isMatch = true;
        if (fNorm.includes("aglieri") && dNorm.includes("aglieri")) isMatch = true;
        if (fNorm.includes("popper") && dNorm.includes("popper")) return true;
        if (fNorm.includes("ferretti") && dNorm.includes("ferretti")) isMatch = true;
        if (fNorm.includes("giuffrida") && dNorm.includes("giuffrida")) isMatch = true;
        if (fNorm.includes("colombo") && dNorm.includes("colombo")) isMatch = true;
        if (fNorm.includes("banfi") && dNorm.includes("banfi")) isMatch = true;
        if (fNorm.includes("azria") && dNorm.includes("azria")) isMatch = true;
        if (fNorm.includes("lepetit") && dNorm.includes("lepetit")) isMatch = true;

        if (isMatch) {
            const existing = mappings.find(m => m.name === d.name);
            if (!existing) {
                mappings.push({ name: d.name, file: `/photos/${file}` });
            }
        }
    });
});

fs.writeFileSync('src/photos.json', JSON.stringify(mappings, null, 2));

console.log(`Mapped ${mappings.length} photos to stones`);
