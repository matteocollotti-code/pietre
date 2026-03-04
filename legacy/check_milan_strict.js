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
    return lat >= MILAN_BBOX.minLat && lat <= MILAN_BBOX.maxLat &&
        lng >= MILAN_BBOX.minLng && lng <= MILAN_BBOX.maxLng;
}

async function geocodeAddress(query) {
    // Use viewbox and bounded to strictly constrain results to Milan
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&viewbox=${MILAN_BBOX.minLng},${MILAN_BBOX.maxLat},${MILAN_BBOX.maxLng},${MILAN_BBOX.minLat}&bounded=1&limit=1`;

    try {
        const res = await fetch(url, { headers: { 'User-Agent': 'MappaPietreMilano/1.4' } });
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

    // Fix those 18 specifically to typical OSM names
    q = q.replace('s. eufemia', "sant'eufemia");
    q = q.replace('sant antonio', "sant'antonio");
    q = q.replace('sant’andrea', "sant'andrea");
    // "Via Visconti di Modrone" in OSM is "Via Uberto Visconti di Modrone"
    q = q.replace('visconti di modrone', 'uberto visconti di modrone');

    return q;
}

async function main() {
    const dataFile = path.join(__dirname, 'data.json');
    const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));

    // Filtra chi è fuori Milano oggi
    const outliers = data.filter(d => d.lat === null || d.lng === null || !isInsideMilan(d.lat, d.lng));

    for (let i = 0; i < data.length; i++) {
        const item = data[i];
        if (item.lat === null || item.lng === null || !isInsideMilan(item.lat, item.lng)) {
            console.log(`Retry BBOX: ${item.address}`);

            let query = cleanAddress(item.address);
            let altQueryNoNumbers = query.replace(/\d+/g, '').replace(/[a-z]$/i, '').trim();

            let coords = await geocodeAddress(`${query}`);

            if (!coords) {
                await delay(1100);
                coords = await geocodeAddress(`${altQueryNoNumbers}`);
            }

            if (coords) {
                data[i].lat = coords.lat;
                data[i].lng = coords.lng;
                console.log(`  -> [RISOLTO] BBOX: ${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`);
            } else {
                console.log(`  -> [FALLITO] Nemmeno limitando l'area`);
            }

            await delay(1100);
        }
    }

    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
    const jsContent = `const markersData = ${JSON.stringify(data, null, 2)};`;
    fs.writeFileSync(path.join(__dirname, 'data.js'), jsContent, 'utf8');
}

main();
