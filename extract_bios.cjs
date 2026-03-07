const fs = require('fs');
const path = require('path');
const mammoth = require('mammoth');

const dir = 'C:\\Users\\matte\\OneDrive\\Desktop\\pietre\\Bio per mappa-20260307T101253Z-3-001\\Bio per mappa';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.docx'));

const dataStr = fs.readFileSync('data.json', 'utf8');
const dataJSON = JSON.parse(dataStr);

function normalizeNameForMatch(name) {
    return name.toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/['"’]/g, '').trim();
}

async function extract() {
    const biosMap = [];

    for (const f of files) {
        const fullPath = path.join(dir, f);
        try {
            const result = await mammoth.extractRawText({ path: fullPath });
            const text = result.value;

            // Try to clean the filename to get the name
            let cleanName = f.replace('.docx', '')
                .replace(/bio\s+per\s+/i, '')
                .replace(/bio\s+di\s+/i, '')
                .replace(/bio\s+/i, '')
                .trim();

            // if it contains " per ", grab only what's after " per "
            // e.g. "Aldina  Begnis per Angelo Aglieri" -> "Angelo Aglieri"
            if (cleanName.includes(' per ')) {
                cleanName = cleanName.split(' per ')[1].trim();
            }
            if (cleanName.includes(' e ')) {
                // e.g. "Graziella e Ida Mafalda Morais" -> keep as is to match later
            }

            biosMap.push({
                file: f,
                nameHint: cleanName,
                text: text.trim()
            });

        } catch (e) {
            console.error("Error reading file", f, e);
        }
    }

    fs.writeFileSync('src/bios.json', JSON.stringify(biosMap, null, 2));
    console.log("Saved", biosMap.length, "bios to src/bios.json");
}

extract();
