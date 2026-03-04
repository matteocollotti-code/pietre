const fs = require('fs');
const path = require('path');

const delay = ms => new Promise(res => setTimeout(res, ms));

async function geocodeAddressMilan(query) {
    // Use structured search with city constraint for the absolute highest strictly-Milan precision
    const url = `https://nominatim.openstreetmap.org/search?format=json&city=Milano&country=Italia&street=${encodeURIComponent(query)}&limit=1`;
    try {
        const res = await fetch(url, { headers: { 'User-Agent': 'MappaPietreMilano/1.6' } });
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

// Coordinate fisse manuali per gli indirizzi peggiori che OSM sbaglia
const MANUAL_FIXES = {
    // Via Sant'Antonio 1 (non in provincia)
    "besso francesco": { lat: 45.4612, lng: 9.1934 },
    // Via Lambro 7 (non a Opera o altrove)
    "semmel bogner anna": { lat: 45.4746, lng: 9.2065 },
    "sommel tynya": { lat: 45.4746, lng: 9.2065 },
    // Via Parini 1/A
    "riva mario": { lat: 45.4764, lng: 9.1947 },
    // Viale Vittorio Veneto 4
    "piazzolla angelo antonio": { lat: 45.4765, lng: 9.2014 }
};


async function main() {
    const dataFile = path.join(__dirname, 'data.json');
    const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));

    // Ricalcoliamo e filtriamo chi è manifestamente fuori dai confini "visivi" del perimetro
    // Polygon check approssimato per hinterland
    function isStrictlyInMilanCenter(lat, lng) {
        return lat > 45.40 && lat < 45.53 && lng > 9.08 && lng < 9.26;
    }

    let modified = 0;
    for (let i = 0; i < data.length; i++) {
        const item = data[i];

        let fixed = false;

        // Applica i fix manuali prima
        const lookup = item.name.toLowerCase();
        if (MANUAL_FIXES[lookup]) {
            if (data[i].lat !== MANUAL_FIXES[lookup].lat) {
                data[i].lat = MANUAL_FIXES[lookup].lat;
                data[i].lng = MANUAL_FIXES[lookup].lng;
                console.log(`Manual Fix Applicato: ${item.name} -> ${item.lat}, ${item.lng}`);
                modified++;
                fixed = true;
            }
        }

        // Se non è stato fixato e ricade in zone periferiche ambigue di Nominatim, riprova con city=Milano
        if (!fixed && item.lat && item.lng && !isStrictlyInMilanCenter(item.lat, item.lng)) {
            console.log(`[OUTLIER RILEVATO] ${item.name} in ${item.address} (${item.lat}, ${item.lng}) - Sembra troppo fuori mappa.`);

            // Rimuovi i numeri civici spesso causano bug su Milano
            let streetOnly = item.address.replace(/\d+/g, '').replace(/[a-z]$/i, '').trim();

            streetOnly = streetOnly.replace('s. eufemia', "sant'eufemia");
            streetOnly = streetOnly.replace('sant antonio', "sant'antonio");
            streetOnly = streetOnly.replace('visconti di modrone', 'uberto visconti di modrone');

            let coords = await geocodeAddressMilan(streetOnly);
            if (coords && isStrictlyInMilanCenter(coords.lat, coords.lng)) {
                data[i].lat = coords.lat;
                data[i].lng = coords.lng;
                console.log(`  -> [CORRETTO] Spostato a ${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`);
                modified++;
            } else {
                console.log(`  -> [FALLITO] Impossibile trovare un match migliore dentro la città.`);
            }
            await delay(1100);
        }
    }

    if (modified > 0) {
        fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
        const jsContent = `const markersData = ${JSON.stringify(data, null, 2)};`;
        fs.writeFileSync(path.join(__dirname, 'data.js'), jsContent, 'utf8');
        console.log(`\nFinito. Corretti ${modified} punti.`);
    } else {
        console.log(`\nFinito. Tutti i punti sembrano già essere ben dentro la città.`);
    }
}

main();
