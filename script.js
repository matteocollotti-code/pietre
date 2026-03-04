// Coordinate di Milano
const milanCoords = [45.4642, 9.1900];
const initialZoom = 13;

// Inizializza la mappa nel div con id "map"
const map = L.map('map', {
    zoomControl: false
}).setView(milanCoords, initialZoom);

// CartoDB Voyager Style (light and clean)
L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20
}).addTo(map);

L.control.zoom({ position: 'bottomright' }).addTo(map);

// Inizializza un marker cluster group o un layer group
const markersLayer = L.layerGroup().addTo(map);

// Definizione dello stile per i marker: Pietre d'Inciampo come rettangoli dorati
const goldIcon = L.divIcon({
    className: 'custom-div-icon',
    html: "<div class='gold-stone-marker'></div>",
    iconSize: [12, 12], // Dimensioni del rettangolo d'oro
    iconAnchor: [6, 6]
});

// Funzione per mostrare i punti
function loadMarkers(data) {
    if (!data || !Array.isArray(data)) return;

    data.forEach(item => {
        if (item.lat && item.lng) {
            // Testo popup ricco di informazioni
            const popupContent = `
                <div class="popup-content">
                    <h3 style="margin: 0 0 5px 0;">${item.name}</h3>
                    <p style="margin: 0 0 5px 0;"><strong>Indirizzo:</strong> ${item.address}</p>
                    ${item.birthDate ? `<p style="margin: 0 0 5px 0;"><strong>Nato il:</strong> ${item.birthDate}</p>` : ''}
                    ${item.deathDate ? `<p style="margin: 0 0 5px 0;"><strong>Morto il:</strong> ${item.deathDate}</p>` : ''}
                    ${item.deathPlace ? `<p style="margin: 0 0 5px 0;"><strong>Luogo morte:</strong> ${item.deathPlace}</p>` : ''}
                    ${item.age ? `<p style="margin: 0 0 5px 0;"><strong>Età:</strong> ${item.age}</p>` : ''}
                </div>
            `;

            const marker = L.marker([item.lat, item.lng], { icon: goldIcon })
                .bindPopup(popupContent);

            markersLayer.addLayer(marker);
        }
    });

    console.log(`Caricati ${markersLayer.getLayers().length} marker sulla mappa.`);
}

// Carica e visualizza i confini del comune di Milano
function loadMilanBoundary() {
    const nominatimUrl =
        'https://nominatim.openstreetmap.org/search?q=Milano%2C+Lombardia%2C+Italy&polygon_geojson=1&format=json&limit=1';

    fetch(nominatimUrl, {
        headers: { 'Accept-Language': 'it', 'User-Agent': 'pietre-inciampo-map/1.0' }
    })
        .then(response => {
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return response.json();
        })
        .then(data => {
            if (!data || data.length === 0) {
                console.warn('Confini di Milano non trovati.');
                return;
            }
            const geojson = data[0].geojson;
            L.geoJSON(geojson, {
                style: {
                    color: '#c0392b',
                    weight: 2,
                    opacity: 0.8,
                    fillColor: '#c0392b',
                    fillOpacity: 0.05
                }
            }).addTo(map);
            console.log('Confini di Milano caricati sulla mappa.');
        })
        .catch(err => {
            console.error('Errore nel caricamento dei confini di Milano:', err);
        });
}

// Quando la finestra si carica, verifica se c'è l'array markersData
// definito in data.js
window.onload = function () {
    loadMilanBoundary();

    if (typeof markersData !== 'undefined') {
        loadMarkers(markersData);
    } else {
        console.warn("Nessun dato markersData trovato. Assicurati che data.js sia caricato correttamente.");
    }
};
