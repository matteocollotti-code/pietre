const fs = require('fs');
const path = require('path');

async function main() {
    const dataFile = path.join(__dirname, 'data.json');
    const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));

    // Fix manuali definitivi per le vie omonime in provincia che OSM a volte preferisce
    const manualCoords = {
        "via mozart": { lat: 45.4688, lng: 9.2023 },
        "via mascheroni": { lat: 45.4678, lng: 9.1678 },
        "via ariosto": { lat: 45.4670, lng: 9.1643 },
        "via goldoni": { lat: 45.4667, lng: 9.2136 },
        "via e. de amicis": { lat: 45.4593, lng: 9.1760 } // Just to be safe
    };

    let modified = 0;
    for (let i = 0; i < data.length; i++) {
        const addr = data[i].address.toLowerCase();
        for (const [street, coords] of Object.entries(manualCoords)) {
            if (addr.includes(street)) {
                // If the coordinate is the WRONG one (outside center)
                if (data[i].lat < 45.44 || data[i].lat > 45.50 || data[i].lng < 9.12 || data[i].lng > 9.23) {
                    console.log(`Fissato ${data[i].name} in ${data[i].address} (era ${data[i].lat}, ${data[i].lng}) -> ${coords.lat}, ${coords.lng}`);
                    data[i].lat = coords.lat;
                    data[i].lng = coords.lng;
                    modified++;
                }
            }
        }
    }

    if (modified > 0) {
        fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
        const jsContent = `const markersData = ${JSON.stringify(data, null, 2)};`;
        fs.writeFileSync(path.join(__dirname, 'data.js'), jsContent, 'utf8');
        console.log(`\nApplicati ${modified} fix manuali.`);
    } else {
        console.log(`\nNessun nuovo fix necessario.`);
    }
}

main();
