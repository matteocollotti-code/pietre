const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

const delay = ms => new Promise(res => setTimeout(res, ms));

async function geocodeAddress(address) {
    // Aggiungi "Milano, Italia" alla ricerca per restringere il campo
    const query = `${address}, Milano, Italia`;
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`;

    try {
        const res = await fetch(url, {
            headers: {
                'User-Agent': 'MappaPietreMilano/1.0 (matteocollotti-code)'
            }
        });

        if (!res.ok) {
            console.warn(`[WARN] Nominatim HTTP Error ${res.status} for address ${address}`);
            return null;
        }

        const data = await res.json();
        if (data && data.length > 0) {
            return {
                lat: parseFloat(data[0].lat),
                lng: parseFloat(data[0].lon)
            };
        }
    } catch (e) {
        console.error(`Error geocoding ${address}:`, e.message);
    }
    return null;
}

async function main() {
    const dataFile = path.join(__dirname, 'data.json');
    let existingData = [];

    if (fs.existsSync(dataFile)) {
        existingData = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
    }

    const workbook = xlsx.readFile(path.join(__dirname, 'pietre.xlsx'));
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = xlsx.utils.sheet_to_json(sheet);

    console.log(`Loaded ${rows.length} records. Found ${existingData.length} already geocoded.`);

    const geocodedMap = new Map();
    existingData.forEach(d => geocodedMap.set(d.name, d));

    const results = [...existingData];
    let newAdded = 0;

    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const name = row['Cognome e Nome'];
        const address = row['Indirizzo pietra'];

        if (!name || !address) continue;

        // Skip if already geocoded
        if (geocodedMap.has(name)) {
            // but we could also check if it failed previously.
            const prev = geocodedMap.get(name);
            if (prev.lat && prev.lng) {
                continue;
            } else {
                // Remove the failed one to try again
                results.splice(results.indexOf(prev), 1);
            }
        }

        process.stdout.write(`Geocoding (${i + 1}/${rows.length}): ${address} ... `);
        const coords = await geocodeAddress(address);

        const entry = {
            name: name,
            address: address,
            birthDate: row['Data di\nNascita'] || '',
            deathDate: row['Data di\nMorte'] || '',
            deathPlace: row['Luogo di\nMorte'] || '',
            age: row['Età'] || '',
            lat: coords ? coords.lat : null,
            lng: coords ? coords.lng : null,
            raw: row // save full row just in caso
        };

        results.push(entry);
        geocodedMap.set(name, entry);

        if (coords) {
            console.log(`[OK] ${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`);
        } else {
            console.log(`[NOT FOUND]`);
        }

        newAdded++;

        // Save intermediate every 10 rows
        if (newAdded % 10 === 0) {
            fs.writeFileSync(dataFile, JSON.stringify(results, null, 2));
        }

        // Wait 1.1 seconds between requests per Nominatim TOS
        await delay(1100);
    }

    // Final save
    fs.writeFileSync(dataFile, JSON.stringify(results, null, 2));
    console.log(`Done! Exported to data.json`);
}

main();
