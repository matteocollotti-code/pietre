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

// Definizione dello stile per i marker: Pietre d'Inciampo
const circleMarkerStyle = {
    radius: 6,
    fillColor: "#ff9900", // Arancione oro
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
};

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

            const marker = L.circleMarker([item.lat, item.lng], circleMarkerStyle)
                .bindPopup(popupContent);

            markersLayer.addLayer(marker);
        }
    });

    console.log(`Caricati ${markersLayer.getLayers().length} marker sulla mappa.`);
}

// Quando la finestra si carica, verifica se c'è l'array markersData
// definito in data.js
window.onload = function () {
    if (typeof markersData !== 'undefined') {
        loadMarkers(markersData);
    } else {
        console.warn("Nessun dato markersData trovato. Assicurati che data.js sia caricato correttamente.");
    }
};
