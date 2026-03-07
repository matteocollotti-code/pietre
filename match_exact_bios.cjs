const fs = require('fs');

const requiredNames = [
    "angelo aglieri",
    "adele basevi",
    "aurelia finzi", "emma finzi",
    "corinna corinaldi segre",
    "enrica foà",
    "olga revere", "ines revere",
    "olga levi ascoli",
    "antonia frigerio conte",
    "otto popper",
    "maria metha kuh",
    "lea behar", "sara dana",
    "Carlo ferretti",
    "olga loewy segre",
    "emilia levi", "elena levi",
    "Annita latis", "liliana latis",
    "carlotta thomas",
    "clara sorias",
    "emanuele giuffrida",
    "mino steiner",
    "eugenio glucksmann",
    "angelo colombo",
    "frieda lehmann",
    "graziella morais", "ida mafalda morais",
    "grete weissenstein",
    "Roberto LEpetit",
    "iginia fiorentino",
    "jenide russo",
    "gianluigi banfi",
    "lea landau",
    "luigi azria",
    "maria fontanin fillinich",
    "violetta silvera", "bahia silvera"
];

// Helper to normalize strings for comparison
function normalizeNameForMatch(name) {
    return name.toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/['"’\n\r()]/g, ' ')
        // replace double spaces with single
        .replace(/\s+/g, ' ')
        .trim();
}

const targetStones = requiredNames.map(n => normalizeNameForMatch(n));
console.log("Extracted Target Stones:", targetStones.length, "total elements");

const biosStr = fs.readFileSync('src/bios.json', 'utf8');
const bios = JSON.parse(biosStr);

const dataStr = fs.readFileSync('data.json', 'utf8');
const data = JSON.parse(dataStr);

// Reset matches
bios.forEach(b => b.matches = []);

targetStones.forEach(targetNorm => {
    const targetParts = targetNorm.split(' ').filter(Boolean);

    // Find matching stone in data.json
    let matchedData = data.find(d => {
        const dNorm = normalizeNameForMatch(d.name);

        // Exact name match
        if (dNorm === targetNorm) return true;
        // Direct contains all parts
        if (targetParts.every(p => dNorm.includes(p))) return true;
        // Hardcoded typo fixes between user list and data.json
        if (targetNorm.includes('metha kuh') && dNorm.includes('marye kuth')) return true;
        if (targetNorm.includes('loewy segre') && dNorm.includes('lovvy')) return true;
        if (targetNorm.includes('clara sorias') && dNorm.includes('sorias') && dNorm.includes('clara')) return true;
        if (targetNorm.includes('glucksmann') && dNorm.includes('gluecksmann')) return true;
        if (targetNorm.includes('graziella morais') && dNorm.includes('moorais') && dNorm.includes('graziella')) return true;
        if (targetNorm.includes('ida mafalda morais') && dNorm.includes('morais') && (dNorm.includes('mafalda') || dNorm.includes('ida'))) return true;
        if (targetNorm.includes('grete weissenstein') && dNorm.includes('weissenstein')) return true;
        if (targetNorm.includes('mino steiner') && dNorm.includes('steiner') && dNorm.includes('guglielmo')) return true;

        // Let's just catch emilia levi
        if (targetNorm.includes('emilia levi') && dNorm.includes('levi') && dNorm.includes('emilia')) return true;

        return false;
    });

    if (matchedData) {
        // Find which bio matches this target stone
        let matchedBio = bios.find(b => {
            const bNorm = normalizeNameForMatch(b.nameHint);

            // if target is inside bio name hint
            if (bNorm.includes(targetNorm)) return true;

            // Check individual key names to link the correct bio document
            if (targetNorm.includes("aurelia finzi") && bNorm.includes("aurelia") && bNorm.includes("finzi")) return true;
            if (targetNorm.includes("emma finzi") && bNorm.includes("emma") && bNorm.includes("finzi")) return true;
            if (targetNorm.includes("olga revere") && bNorm.includes("olga") && bNorm.includes("revere")) return true;
            if (targetNorm.includes("ines revere") && bNorm.includes("ines") && bNorm.includes("revere")) return true;
            if (targetNorm.includes("lea behar") && bNorm.includes("lea") && bNorm.includes("behar")) return true;
            if (targetNorm.includes("sara dana") && bNorm.includes("sara") && bNorm.includes("dana")) return true;
            if (targetNorm.includes("emilia levi") && bNorm.includes("emilia") && bNorm.includes("levi")) return true;
            if (targetNorm.includes("elena levi") && bNorm.includes("elena") && bNorm.includes("levi")) return true;
            if (targetNorm.includes("annita latis") && bNorm.includes("annita") && bNorm.includes("latis")) return true;
            if (targetNorm.includes("liliana latis") && bNorm.includes("liliana") && bNorm.includes("latis")) return true;
            if (targetNorm.includes("graziella morais") && bNorm.includes("graziella") && bNorm.includes("morais")) return true;
            if (targetNorm.includes("ida mafalda morais") && bNorm.includes("mafalda") && bNorm.includes("morais")) return true;
            if (targetNorm.includes("violetta silvera") && bNorm.includes("violetta") && bNorm.includes("silvera")) return true;
            if (targetNorm.includes("bahia silvera") && bNorm.includes("bahia") && bNorm.includes("silvera")) return true;

            if (targetNorm.includes("kuh") && bNorm.includes("kuh")) return true;
            if (targetNorm.includes("weissenstein") && bNorm.includes("weissenstein")) return true;
            if (targetNorm.includes("glucksmann") && bNorm.includes("glucksmann")) return true;
            if (targetNorm.includes("sorias") && bNorm.includes("sorias")) return true;
            if (targetNorm.includes("steiner") && bNorm.includes("steiner")) return true;
            if (targetNorm.includes("aglieri") && bNorm.includes("aglieri")) return true;
            if (targetNorm.includes("popper") && bNorm.includes("popper")) return true;
            if (targetNorm.includes("ferretti") && bNorm.includes("ferretti")) return true;
            if (targetNorm.includes("giuffrida") && bNorm.includes("giuffrida")) return true;
            if (targetNorm.includes("colombo") && bNorm.includes("colombo")) return true;
            if (targetNorm.includes("banfi") && bNorm.includes("banfi")) return true;
            if (targetNorm.includes("azria") && bNorm.includes("azria")) return true;
            if (targetNorm.includes("lepetit") && bNorm.includes("lepetit")) return true;

            return false;
        });

        if (matchedBio) {
            if (!matchedBio.matches.includes(matchedData.name)) {
                matchedBio.matches.push(matchedData.name);
            }
        } else {
            console.log("WARNING: Could not find BIO file for target:", targetNorm);
        }
    } else {
        console.log("WARNING: Could not find STONE in data.json for target:", targetNorm);
    }
});

fs.writeFileSync('src/bios.json', JSON.stringify(bios, null, 2));

const totalMatches = bios.reduce((sum, b) => sum + b.matches.length, 0);
console.log(`Matched exactly ${totalMatches} stones to ${bios.length} biographies`);
