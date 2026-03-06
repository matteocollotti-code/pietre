const fs = require('fs');
const textsStr = fs.readFileSync('src/texts.json', 'utf8');
let texts = JSON.parse(textsStr);

// 1. Fix "Casa" -> "Case"
texts.forEach(t => {
    if (t.theme === "Casa") {
        t.theme = "Case";
    }
});

// 2. Add aliases to match typos in data.json
// "Kuth" for META MARIE KUH
// "Moorais" for IDA MAFALDA MORAIS / GRAZIELLA MORAIS
// "Lovvy" for OLGA LOEWY
// "Gluecksmann" for EUGENIO GLUCKSMANN
// "Luzzatto", "Boehm" for MARGHERITA BOHM
// "Emila" for EMILIA LEVI
// "Tedeschi in Morais Mafalda" for IDA MAFALDA MORAIS

function addAlias(nameMatch, themeMatch, extraAliases) {
    texts.forEach(t => {
        if ((t.name.includes(nameMatch) || (t.aliases && t.aliases.some(a => a.includes(nameMatch)))) && (!themeMatch || t.theme === themeMatch)) {
            if (!t.aliases) t.aliases = [];
            t.aliases.push(...extraAliases);
        }
    });
}

addAlias("KUH", null, ["Kuth"]);
addAlias("MORAIS", null, ["Moorais", "Tedeschi in Morais", "Morais Mafalda"]);
addAlias("LOEWY", null, ["Lovvy"]);
addAlias("GLUCKSMANN", null, ["Gluecksmann"]);
addAlias("BOHM", null, ["Boehm", "Luzzatto"]);
addAlias("EMILIA LEVI", null, ["Emila Levi", "Levi Emila"]);

// Check if there are still any missing themes
const dataStr = fs.readFileSync('data.json', 'utf8');
const data = JSON.parse(dataStr);

function normalizeNameForMatch(name) {
    return name.toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/['"’]/g, '').trim();
}

const missingThemes = {
    cose: [],
    corpi: [],
    case: [],
    amore: []
};

data.forEach(d => {
    if (!d.raw) return;
    const raw = d.raw;
    const dNameNormalized = normalizeNameForMatch(d.name);

    const checkTheme = (themeKey, jsonThemeName) => {
        let isActive = false;
        for (const key in raw) {
            if (key.trim().toLowerCase() === themeKey && raw[key] === 1) {
                isActive = true;
                break;
            }
        }

        if (isActive) {
            const matchedTextObj = texts.find(t => {
                if (t.theme.toLowerCase() !== jsonThemeName.toLowerCase()) return false;

                const namesToCheck = [t.name, ...(t.aliases || [])].map(normalizeNameForMatch);
                return namesToCheck.some(nameToMatch => {
                    const textNameParts = nameToMatch.split(' ').filter(Boolean);
                    return textNameParts.every(part => dNameNormalized.includes(part));
                });
            });

            if (!matchedTextObj) {
                missingThemes[themeKey].push(d.name);
            }
        }
    };

    checkTheme('cose', 'Cose');
    checkTheme('corpi', 'Corpi');
    checkTheme('case', 'Case');
    checkTheme('amore', 'Amore');
});

fs.writeFileSync('src/texts.json', JSON.stringify(texts, null, 2));
console.log("Updated texts.json");

fs.writeFileSync('missing_texts.json', JSON.stringify(missingThemes, null, 2));
console.log("Missing texts re-calculated in missing_texts.json");
