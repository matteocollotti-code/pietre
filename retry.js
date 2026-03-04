const fs = require('fs');
const path = require('path');

const delay = ms => new Promise(res => setTimeout(res, ms));

async function geocodeAddress(query) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`;
    try {
        const res = await fetch(url, { headers: { 'User-Agent': 'MappaPietreMilano/1.1' } });
        if (!res.ok) return null;
        const data = await res.json();
        if (data && data.length > 0) {
            return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
        }
    } catch (e) {
        console.error(`Error geocoding ${query}:`, e.message);
    }
    return null;
}

function cleanAddress(addr) {
    let q = addr.toLowerCase();

    // Sostituzioni di vie comuni che OpenStreetMap preferisce
    q = q.replace('castelmorrone', 'castel morrone');
    q = q.replace('c. correnti', 'cesare correnti');
    q = q.replace('p.zza', 'piazza');
    q = q.replace('v.le', 'viale');
    q = q.replace('v. ', 'via ');
    q = q.replace('c.so', 'corso');
    // San antonio -> Sant'Antonio
    q = q.replace('sant antonio', "sant'antonio");

    return q;
}

async function main() {
    const dataFile = path.join(__dirname, 'data.json');
    const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));

    const missing = data.filter(d => d.lat === null || d.lng === null);
    console.log(`Trovati ${missing.length} indirizzi senza coordinate. Provo formule alternative...`);

    for (let i = 0; i < data.length; i++) {
        if (data[i].lat === null || data[i].lng === null) {
            let addr = data[i].address;

            // Tentativo 1: Pulizia custom e rimozione numeri civici
            let altQuery = cleanAddress(addr);
            // Prova anche rimuovendo tutto ciò che viene dopo una virgola
            altQuery = altQuery.split(',')[0].trim();
            // Rimuovi eventuali numeri civici rimanenti
            let altQueryNoNumbers = altQuery.replace(/\d+/g, '').replace(/[a-z]$/i, '').trim();
            // ma prima proviamo la pulizia

            console.log(`Retry: ${addr} --> ${altQuery}`);
            let coords = await geocodeAddress(`${altQuery}, Milano, Italia`);

            if (!coords && altQuery !== altQueryNoNumbers) {
                console.log(`      No luck. Retry senza numeri: ${altQueryNoNumbers}`);
                await delay(1100);
                coords = await geocodeAddress(`${altQueryNoNumbers}, Milano, Italia`);
            }

            if (coords) {
                data[i].lat = coords.lat;
                data[i].lng = coords.lng;
                console.log(`[RISOLTO] ${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`);
            } else {
                console.log(`[ANCORA NON TROVATO]`);
            }

            await delay(1100);
        }
    }

    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));

    // Ricrea il file JS
    const jsContent = `const markersData = ${JSON.stringify(data, null, 2)};`;
    fs.writeFileSync(path.join(__dirname, 'data.js'), jsContent, 'utf8');

    // Trova quelli ancora mancanti per l'utente
    const stillMissing = data.filter(d => d.lat === null || d.lng === null);
    if (stillMissing.length > 0) {
        console.log("\nIndirizzi ancora non trovati:");
        stillMissing.forEach(m => console.log(`- ${m.name}: ${m.address}`));
    }
}

main();
