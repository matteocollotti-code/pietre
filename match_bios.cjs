const fs = require('fs');

const dataStr = fs.readFileSync('data.json', 'utf8');
const data = JSON.parse(dataStr);

const biosStr = fs.readFileSync('src/bios.json', 'utf8');
const bios = JSON.parse(biosStr);

function normalizeNameForMatch(name) {
    return name.toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/['"’\n\r()]/g, ' ').trim();
}

bios.forEach(bio => {
    bio.matches = [];
    const bioNameNorm = normalizeNameForMatch(bio.nameHint);

    data.forEach(d => {
        const dNorm = normalizeNameForMatch(d.name);

        let isMatch = false;

        // 1. Direct contains
        const dNormParts = dNorm.split(' ').filter(Boolean);

        if (dNormParts.every(p => bioNameNorm.includes(p))) {
            isMatch = true;
        }

        // Complex specific cases
        if (dNorm.includes('kuth') && bioNameNorm.includes('kuh')) isMatch = true;
        if (dNorm.includes('lovvy') && bioNameNorm.includes('loewy')) isMatch = true;
        if (dNorm.includes('moorais') && bioNameNorm.includes('morais')) isMatch = true;
        if (dNorm.includes('gluecksmann') && bioNameNorm.includes('glucksmann')) isMatch = true;

        if (dNorm.includes('revere') && (bioNameNorm.includes('olga') || bioNameNorm.includes('ines'))) isMatch = true;
        if (dNorm.includes('finzi') && (bioNameNorm.includes('aurelia') || bioNameNorm.includes('emma'))) isMatch = true;
        if (dNorm.includes('levi') && (bioNameNorm.includes('emilia') || bioNameNorm.includes('elena'))) isMatch = true;
        if (dNorm.includes('latis') && (bioNameNorm.includes('annita') || bioNameNorm.includes('liliana'))) isMatch = true;
        if ((dNorm.includes('behar') && bioNameNorm.includes('lea')) || (dNorm.includes('dana') && bioNameNorm.includes('sara'))) isMatch = true;
        if (dNorm.includes('silvera') && (bioNameNorm.includes('violetta') || bioNameNorm.includes('bahia'))) isMatch = true;

        // Unmatched 3 cases:
        if (dNorm.includes('sorias') && dNorm.includes('clara') && bioNameNorm.includes('clara sorias')) isMatch = true;
        if (dNorm.includes('weissenstein') && bioNameNorm.includes('grete weissenstein')) isMatch = true;

        if (isMatch) {
            if (!bio.matches.includes(d.name)) {
                bio.matches.push(d.name);
            }
        }
    });
});

fs.writeFileSync('src/bios.json', JSON.stringify(bios, null, 2));

const orphans = bios.filter(b => b.matches.length === 0);
if (orphans.length > 0) {
    console.log("Bios with 0 matches:", orphans.map(o => o.file));
} else {
    console.log("All 32 bios matched! Total matches:", bios.reduce((sum, b) => sum + b.matches.length, 0));
}

// Map the matches back from Data point of view:
const stonesWithBios = {};
bios.forEach(b => {
    b.matches.forEach(m => {
        if (!stonesWithBios[m]) stonesWithBios[m] = [];
        stonesWithBios[m].push(b.file);
    });
});
console.log("Stones that have a bio:", Object.keys(stonesWithBios).length);
