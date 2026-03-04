const fs = require('fs');
const path = require('path');

const delay = ms => new Promise(res => setTimeout(res, ms));

const MILAN_BBOX = {
    minLat: 45.38,
    maxLat: 45.54,
    minLng: 9.04,
    maxLng: 9.28
};

function isInsideMilan(lat, lng) {
    if (lat === null || lng === null) return false;
    return lat >= MILAN_BBOX.minLat && lat <= MILAN_BBOX.maxLat &&
        lng >= MILAN_BBOX.minLng && lng <= MILAN_BBOX.maxLng;
}

async function geocodeAddress(query) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&viewbox=${MILAN_BBOX.minLng},${MILAN_BBOX.maxLat},${MILAN_BBOX.maxLng},${MILAN_BBOX.minLat}&bounded=1&limit=1`;

    try {
        const res = await fetch(url, { headers: { 'User-Agent': 'MappaPietreMilano/1.5' } });
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


async function main() {
    const dataFile = path.join(__dirname, 'data.json');
    const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));

    // Manual fixes for the last 4 stubborn ones:
    // "Viale Monte Rosa, 18" -> "Viale Monterosa 18"
    // "via Ludovico il Moro 81" -> "Alzaia Naviglio Grande" (it's essentially the same street on the map, OSM gets confused) or just omit street number

    for (let i = 0; i < data.length; i++) {
        const item = data[i];
        if (!isInsideMilan(item.lat, item.lng)) {
            console.log(`Retry FINAL: ${item.address}`);

            let query = item.address.toLowerCase();

            // Last resort manual hacks for OSM
            if (query.includes('monte rosa')) {
                query = "viale monterosa, 18";
            }
            if (query.includes('ludovico il moro')) {
                query = "via lodovico il moro"; // Lodovico again!
            }

            let coords = await geocodeAddress(query);

            if (coords) {
                data[i].lat = coords.lat;
                data[i].lng = coords.lng;
                console.log(`  -> [RISOLTO] FINAL: ${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`);
            } else {
                console.log(`  -> [FALLITO]`);
            }

            await delay(1100);
        }
    }

    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
    const jsContent = `const markersData = ${JSON.stringify(data, null, 2)};`;
    fs.writeFileSync(path.join(__dirname, 'data.js'), jsContent, 'utf8');

    const stillOut = data.filter(d => !isInsideMilan(d.lat, d.lng));
    if (stillOut.length === 0) {
        console.log("\nECCELLENTE! Tutti gli indirizzi sono ORA a Milano.");
    } else {
        console.log("\nMancano:", stillOut.length);
    }
}

main();
