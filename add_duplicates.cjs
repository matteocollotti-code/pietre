const fs = require('fs');
const xlsx = require('xlsx');

async function geocode(address) {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address + ', Milano, Italy')}&format=json&limit=1`;
    const res = await fetch(url, { headers: { 'User-Agent': 'Pietre d Inciampo App' } });
    const data = await res.json();
    if (data && data.length > 0) {
        return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    }
    return null;
}

async function run() {
    const workbook = xlsx.readFile('./legacy/pietre.xlsx');
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const excelData = xlsx.utils.sheet_to_json(sheet);
    let jsonData = JSON.parse(fs.readFileSync('data.json', 'utf8'));

    const targets = ['finzi edgardo', 'levi aldo', 'levi giuseppe'];
    let added = 0;

    for (const name of targets) {
        // Find all entries for this name in the excel
        const excelMatches = excelData.filter(d => (d['Cognome e Nome'] || '').trim().toLowerCase() === name);
        // Find all entries for this name in the json
        const jsonMatches = jsonData.filter(d => (d.name || '').trim().toLowerCase() === name);

        // Find which excel entries are missing from json based on address
        for (const e of excelMatches) {
            const addr = String(e['Indirizzo pietra']).trim();
            const exists = jsonMatches.some(j => j.address.includes(addr) || addr.includes(j.address));

            if (!exists) {
                console.log(`Missing stone found for ${name} at ${addr}`);
                // Proceed to geocode and add
                const coords = await geocode(addr);
                if (coords) {
                    jsonData.push({
                        name: e['Cognome e Nome'],
                        address: addr,
                        birthDate: e['Data di\nNascita'] ? String(e['Data di\nNascita']) : '',
                        deathDate: e['Data di\nMorte'] ? String(e['Data di\nMorte']) : '',
                        deathPlace: e['Luogo di\nMorte'] ? String(e['Luogo di\nMorte']) : '',
                        age: e.Età ? parseInt(e.Età) : null,
                        lat: coords.lat,
                        lng: coords.lng,
                        raw: {
                            "Cognome e Nome": e['Cognome e Nome'],
                            "Indirizzo pietra": addr,
                            genere: e.genere,
                            corpi: e.corpi || 0,
                            case: e.case || 0,
                            "cose ": e["cose "] || 0,
                            amore: e.amore || 0
                        }
                    });
                    added++;
                    console.log(`Successfully added ${name} at ${addr} coords: ${coords.lat}, ${coords.lng}`);
                } else {
                    console.log(`Failed to geocode ${addr}`);
                }
                // Rate limit
                await new Promise(r => setTimeout(r, 1500));
            }
        }
    }

    if (added > 0) {
        fs.writeFileSync('data.json', JSON.stringify(jsonData, null, 2));
        console.log(`Updated data.json. Total stones now: ${jsonData.length}`);
    } else {
        console.log(`No new stones were added. Total remains: ${jsonData.length}`);
    }
}

run();
