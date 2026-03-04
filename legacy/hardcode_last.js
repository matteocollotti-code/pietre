const fs = require('fs');
const path = require('path');

async function main() {
    const dataFile = path.join(__dirname, 'data.json');
    const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));

    // Fix the very last one explicitly (Viale Monte Rosa 18)
    // Coords from Google Maps for Viale Monte Rosa 18, Milan = 45.4741, 9.1506
    let fixed = 0;
    for (let i = 0; i < data.length; i++) {
        const item = data[i];
        if (item.address.toLowerCase().includes('monte rosa')) {
            data[i].lat = 45.4741;
            data[i].lng = 9.1506;
            fixed++;
        }
    }

    if (fixed > 0) {
        fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
        const jsContent = `const markersData = ${JSON.stringify(data, null, 2)};`;
        fs.writeFileSync(path.join(__dirname, 'data.js'), jsContent, 'utf8');
        console.log(`\nFATTO! Fissati manualmente gli ultimi ${fixed} record ribelli di Viale Monte Rosa.`);
    }
}

main();
