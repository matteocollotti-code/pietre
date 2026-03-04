// Coordinate di Milano
const milanCoords = [45.4642, 9.1900];
const initialZoom = 13;

// Inizializza la mappa nel div con id "map"
const map = L.map('map', {
    zoomControl: false // Disabilita per personalizzare dopo se richiesto
}).setView(milanCoords, initialZoom);

// Aggiungi un bellissimo stile scuro/chiaro di base via CartoDB
L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20
}).addTo(map);

// Aggiunge la control bar dello zoom in basso a destra
L.control.zoom({
    position: 'bottomright'
}).addTo(map);

// Aggiunge un marker al centro (Duomo di Milano)
L.marker(milanCoords).addTo(map)
    .bindPopup('<b>Milano</b><br>Centro città.')
    .openPopup();
