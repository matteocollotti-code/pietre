const fs = require('fs');

const dataStr = fs.readFileSync('data.json', 'utf8');
const data = JSON.parse(dataStr);

const textsStr = fs.readFileSync('src/texts.json', 'utf8');
const texts = JSON.parse(textsStr);

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
        // Check if theme is active for this stone format often varies like "cose " or "cose"
        // So let's check by property name including spaces
        let isActive = false;
        for (const key in raw) {
            if (key.trim().toLowerCase() === themeKey && raw[key] === 1) {
                isActive = true;
                break;
            }
        }

        if (isActive) {
            // Find if texts.json has this theme and name
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

fs.writeFileSync('missing_texts.json', JSON.stringify(missingThemes, null, 2));
console.log("Written to missing_texts.json");
