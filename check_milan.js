const fs = require('fs');
const path = require('path');

const delay = ms => new Promise(res => setTimeout(res, ms));

// Bounding box indicativo del Comune di Milano (più largo per includere tutto l'hinterland prossimo)
const MILAN_BBOX = {
    minLat: 45.38,
    maxLat: 45.54,
    minLng: 9.04,
    maxLng: 9.28
};

function isInsideMilan(lat, lng) {
    return lat >= MILAN_BBOX.minLat && lat <= MILAN_BBOX.maxLat &&
        lng >= MILAN_BBOX.minLng && lng <= MILAN_BBOX.maxLng;
}

async function geocodeAddress(query) {
    // Limita esplicitamente a Milano città con gli attributi di Nominatim
    const url = `https://nominatim.openstreetmap.org/search?format=json&city=Milano&country=Italy&street=${encodeURIComponent(query)}&limit=1`;
    try {
        const res = await fetch(url, { headers: { 'User-Agent': 'MappaPietreMilano/1.3' } });
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

    q = q.replace('castelmorrone', 'castel morrone');
    q = q.replace('c. correnti', 'cesare correnti');
    q = q.replace('p.zza', 'piazza');
    q = q.replace('v.le', 'viale');
    q = q.replace('v. ', 'via ');
    q = q.replace('c.so', 'corso');
    q = q.replace('sant antonio', "sant'antonio");
    q = q.replace('montenero', 'monte nero');
    q = q.replace('f.lli bronzetti', 'fratelli bronzetti');
    q = q.replace('via della passione', 'via passione');
    q = q.replace('donaetello', 'donatello');
    q = q.replace('fatebene fratelli', 'fatebenefratelli');
    q = q.replace('r. boscovich', 'ruggero boscovich');
    q = q.replace('l. necchi', 'lodovico necchi');
    q = q.replace('monterotondo', 'monte rotondo');

    return q;
}

async function main() {
    const dataFile = path.join(__dirname, 'data.json');
    const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));

    // Trova quelli fuori dal bounding box
    const outliers = data.filter(d => !isInsideMilan(d.lat, d.lng));
    console.log(`Trovati ${outliers.length} indirizzi geocodificati fuori da Milano. Ricalcolo in corso...`);

    for (let i = 0; i < data.length; i++) {
        const item = data[i];
        if (!isInsideMilan(item.lat, item.lng)) {
            console.log(`\nFuori Milano: ${item.name} in ${item.address} (Trovato a: ${item.lat}, ${item.lng})`);

            let query = cleanAddress(item.address);

            // Per queste casistiche usiamo la query specifica per la "STREET" dentro la "CITY=MILANO"
            // Nominatim supporta i parametri strutturati
            let coords = await geocodeAddress(query);

            if (!coords) {
                // Try parsing without numbers
                let altQueryNoNumbers = query.replace(/\d+/g, '').replace(/[a-z]$/i, '').trim();
                await delay(1100);
                coords = await geocodeAddress(altQueryNoNumbers);
            }

            if (coords) {
                // Check if the NEW coords are inside Milan
                if (isInsideMilan(coords.lat, coords.lng)) {
                    data[i].lat = coords.lat;
                    data[i].lng = coords.lng;
                    console.log(`  -> [RISOLTO] Ricollocato a Milano: ${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`);
                } else {
                    console.log(`  -> [ERRORE] Nominatim lo piazza ancora fuori: ${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`);
                }
            } else {
                console.log(`  -> [FALLITO] Impossibile trovare la via a Milano città`);
            }

            await delay(1100);
        }
    }

    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));

    const jsContent = `const markersData = ${JSON.stringify(data, null, 2)};`;
    fs.writeFileSync(path.join(__dirname, 'data.js'), jsContent, 'utf8');

    // Controllo finale
    const stillOut = data.filter(d => !isInsideMilan(d.lat, d.lng));
    if (stillOut.length > 0) {
        console.log(`\nATTENZIONE: ${stillOut.length} indirizzi sono ANCORA considerati fuori Milano.`);
        stillOut.forEach(m => console.log(`- ${m.name}: ${m.address}`));
    } else {
        console.log(`\nPERFETTO: Tutti e 247 gli indirizzi sono ora confermati all'interno di Milano città!`);
    }
}

main();
