const fs = require('fs');

const CENTRALE = [9.2036, 45.4861];   // lon, lat
const SAN_VITTORE = [9.1656, 45.4619];// lon, lat

async function fetchRoute(name, points) {
    // points is an array of {lat, lng} objects
    // we must prepend CENTRALE and append SAN_VITTORE
    // and format as lon,lat;lon,lat

    // Check if points is empty
    if (points.length === 0) return null;

    const coords = [
        CENTRALE,
        ...points.map(p => [p.lng, p.lat]),
        SAN_VITTORE
    ];

    const coordsStr = coords.map(c => `${c[0]},${c[1]}`).join(';');
    // We use driving because the public foot profile is often slower or restricted
    const url = `http://router.project-osrm.org/trip/v1/driving/${coordsStr}?roundtrip=false&source=first&destination=last&geometries=geojson`;

    console.log(`Fetching route for ${name} (${coords.length} points)`);
    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error(`Error fetching ${name}: ${response.status} ${response.statusText}`);
            return null;
        }
        const data = await response.json();
        if (data.code === 'Ok' && data.trips && data.trips.length > 0) {
            // The trip geometry contains an array of [lon, lat] coordinates
            // Leaflet expects [lat, lon] for Polyline!
            const trip = data.trips[0];
            const leafletCoords = trip.geometry.coordinates.map(c => [c[1], c[0]]);
            console.log(`Success: ${name} -> ${leafletCoords.length} path coordinates.`);
            return leafletCoords;
        } else {
            console.error(`OSRM returned code: ${data.code}`);
            return null;
        }
    } catch (err) {
        console.error(`Fetch exception for ${name}:`, err.message);
        return null;
    }
}

async function run() {
    const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));

    const themes = [
        { id: 'corpi', check: (r) => r.corpi == 1 },
        { id: 'case', check: (r) => r.case == 1 },
        { id: 'cose', check: (r) => r.cose == 1 || r['cose '] == 1 },
        { id: 'amore', check: (r) => r.amore == 1 }
    ];

    const routesMap = {};

    for (const theme of themes) {
        // filter data
        const pts = data.filter(d => d.lat && d.lng && d.raw && theme.check(d.raw));
        const route = await fetchRoute(theme.id, pts);
        if (route) {
            routesMap[theme.id] = route;
        }
        // sleep a bit to avoid hammering OSRM public API
        await new Promise(res => setTimeout(res, 2000));
    }

    fs.writeFileSync('./src/routes.json', JSON.stringify(routesMap, null, 2));
    console.log('Saved routes to src/routes.json');
}

run();
