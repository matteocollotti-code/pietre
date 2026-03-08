const mammoth = require('mammoth');
const path = require('path');

const dir = "C:/Users/matte/OneDrive/Desktop/pietre/percorsi/Testi per itinerari tematici-20260308T092829Z-3-001/Testi per itinerari tematici";
const files = ['AMORE.docx', 'CASE.docx', 'CORPI.docx', 'COSE.docx'];

async function run() {
    for (const file of files) {
        const fullPath = path.join(dir, file);
        try {
            const result = await mammoth.extractRawText({ path: fullPath });
            console.log(`\n=== ${file} ===\n${result.value.trim()}\n`);
        } catch (e) {
            console.error(`Error reading ${file}:`, e);
        }
    }
}
run();
