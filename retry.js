const fs = require('fs');
const path = require('path');

const delay = ms => new Promise(res => setTimeout(res, ms));

async function geocodeAddress(query) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`;
    try {
        const res = await fetch(url, { headers: { 'User-Agent': 'MappaPietreMilano/1.2' } });
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

    // Sostituzioni generiche
    q = q.replace('castelmorrone', 'castel morrone');
    q = q.replace('c. correnti', 'cesare correnti');
    q = q.replace('p.zza', 'piazza');
    q = q.replace('v.le', 'viale');
    q = q.replace('v. ', 'via ');
    q = q.replace('c.so', 'corso');
    q = q.replace('sant antonio', "sant'antonio");

    // Correzioni specifiche per gli 8 indirizzi mancanti:
    q = q.replace('montenero', 'monte nero');
    q = q.replace('f.lli bronzetti', 'fratelli bronzetti');
    q = q.replace('via della passione', 'via passione'); // A volte omettendo "della" OSM lo trova meglio
    q = q.replace('donaetello', 'donatello'); // Errore di battitura nel file Excel
    q = q.replace('fatebene fratelli', 'fatebenefratelli'); // Scritto tutto attaccato
    q = q.replace('r. boscovich', 'ruggero boscovich'); // Nome completo
    q = q.replace('l. necchi', 'ludovico necchi'); // Nome completo
    q = q.replace('monterotondo', 'monte rotondo'); // Scritto staccato

    return q;
}

async function main() {
    const dataFile = path.join(__dirname, 'data.json');
    const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));

    const missing = data.filter(d => d.lat === null || d.lng === null);
    console.log(`Trovati ${missing.length} indirizzi senza coordinate. Riprovo con le nuove regole...`);

    for (let i = 0; i < data.length; i++) {
        if (data[i].lat === null || data[i].lng === null) {
            let addr = data[i].address;

            let altQuery = cleanAddress(addr);
            let altQueryNoNumbers = altQuery.replace(/\d+/g, '').replace(/[a-z]$/i, '').trim();

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
    } else {
        console.log("\nTUTTI GLI INDIRIZZI SONO STATI RISOLTI CON SUCCESSO! 🎉");
    }
}

main();
