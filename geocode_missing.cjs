const fs = require('fs');

async function geocode(address) {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address + ', Milano, Italy')}&format=json&limit=1`;
    const res = await fetch(url, { headers: { 'User-Agent': 'Pietre d Inciampo App' } });
    const data = await res.json();
    if (data && data.length > 0) {
        return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    }
    return null;
}

const newStones = [
    { name: "Bortolotti Ezio", addrInfo: "via Gadames 119" },
    { name: "Ciocca Carlo", addrInfo: "via n.Palmieri 18" }, // we'll use "via palmieri 18" for geocoding
    { name: "Di Veroli Michele", addrInfo: "via Erodoto 2" },
    { name: "Spizzichino Regina", addrInfo: "via Erodoto 2" },
    { name: "Negroni Luigi", addrInfo: "via palmieri 22" },
    { name: "Filippi Alvaro", addrInfo: "viale certosa 97" }
];

async function run() {
    console.log('Loading missing.json to get full raw data...');
    const missing = JSON.parse(fs.readFileSync('missing.json', 'utf8'));

    // We already have 236 in data.json
    let data = JSON.parse(fs.readFileSync('data.json', 'utf8'));
    console.log('Current data.json length:', data.length);

    let added = 0;
    for (const stone of newStones) {
        // find the original raw object
        let rawObj = missing.find(m => m['Cognome e Nome'] && m['Cognome e Nome'].toLowerCase().includes(stone.name.split(' ')[0].toLowerCase()));

        let geoQuery = stone.addrInfo.replace('n.Palmieri', 'Palmieri');
        const coords = await geocode(geoQuery);

        if (coords) {
            data.push({
                name: rawObj ? rawObj['Cognome e Nome'] : stone.name,
                address: stone.addrInfo,
                birthDate: rawObj && rawObj['Data di\nNascita'] ? String(rawObj['Data di\nNascita']) : '',
                deathDate: rawObj && rawObj['Data di\nMorte'] ? String(rawObj['Data di\nMorte']) : '',
                deathPlace: rawObj && rawObj['Luogo di\nMorte'] ? String(rawObj['Luogo di\nMorte']) : '',
                age: rawObj && rawObj.Età ? parseInt(rawObj.Età) : null,
                lat: coords.lat,
                lng: coords.lng,
                raw: rawObj || {
                    "Cognome e Nome": stone.name,
                    "Indirizzo pietra": stone.addrInfo,
                    corpi: 0, case: 0, "cose ": 0, amore: 0
                }
            });
            added++;
            console.log(`Geocoded ${stone.name} at ${coords.lat}, ${coords.lng}`);
        } else {
            console.log(`Failed to geocode ${stone.name} (${stone.addrInfo})`);
        }
        // sleep a bit to respect nominatim rate limits
        await new Promise(r => setTimeout(r, 1200));
    }

    fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
    console.log(`Updated data.json. New length: ${data.length} (Expected: 242)`);
}

run();
