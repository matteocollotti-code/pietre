import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix per l'icona di default di Leaflet in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const milanCoords: [number, number] = [45.4642, 9.1900];
const initialZoom = 13;

const goldIcon = L.divIcon({
    className: 'custom-div-icon',
    html: "<div class='gold-stone-marker'></div>",
    iconSize: [12, 12],
    iconAnchor: [6, 6]
});

const createClusterCustomIcon = function (cluster: any) {
    return L.divIcon({
        html: `<div style="background-color: #d4af37; border: 2px solid #7c5c02; color: black; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-weight: bold;">${cluster.getChildCount()}</div>`,
        className: 'custom-cluster-icon',
        iconSize: L.point(24, 24)
    });
};

function MilanBoundary() {
    const map = useMap();
    useEffect(() => {
        fetch('https://nominatim.openstreetmap.org/search?q=Milano%2C+Lombardia%2C+Italy&polygon_geojson=1&format=json&limit=1')
            .then(res => res.json())
            .then(data => {
                if (data && data.length > 0) {
                    L.geoJSON(data[0].geojson, {
                        style: {
                            color: '#c0392b', weight: 2, opacity: 0.8, fillColor: '#c0392b', fillOpacity: 0.05
                        }
                    }).addTo(map);
                }
            });
    }, [map]);
    return null;
}

interface MapProps {
    markers: any[];
}

export default function MapComponent({ markers }: MapProps) {
    return (
        <div className="w-full h-full relative z-0">
            <MapContainer
                center={milanCoords}
                zoom={initialZoom}
                zoomControl={false}
                className="w-full h-full"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    subdomains="abcd"
                    maxZoom={20}
                />
                <MilanBoundary />

                <MarkerClusterGroup
                    chunkedLoading
                    spiderfyOnMaxZoom={true}
                    showCoverageOnHover={false}
                    zoomToBoundsOnClick={false}
                    maxClusterRadius={30}
                    iconCreateFunction={createClusterCustomIcon}
                    eventHandlers={{
                        clusterclick: (e: any) => {
                            const cluster = e.layer;
                            const map = cluster._map;
                            // Esegue un 'flyToBounds' animato e più lento in caso di gruppi grandi
                            // Controlla se al livello massimo deve spiderfiare
                            if (map.getZoom() === map.getMaxZoom() || cluster.getChildCount() === cluster.getAllChildMarkers().length && map.getBoundsZoom(cluster.getBounds()) === map.getZoom()) {
                                cluster.spiderfy();
                            } else {
                                map.flyToBounds(cluster.getBounds(), { padding: [50, 50], duration: 1.5 });
                            }
                        }
                    }}
                >
                    {markers.map((item, idx) => {
                        if (!item.lat || !item.lng) return null;
                        const isFemale = item.raw?.genere?.toString().toLowerCase() === 'f';
                        const labelNato = isFemale ? 'Nata il:' : 'Nato il:';
                        const labelMorto = isFemale ? 'Morta il:' : 'Morto il:';
                        const labelLuogoMorte = isFemale ? 'Morta a:' : 'Morto a:';

                        return (
                            <Marker
                                key={idx}
                                position={[item.lat, item.lng]}
                                icon={goldIcon}
                                eventHandlers={{
                                    click: (e) => {
                                        const map = e.target._map;
                                        map.flyTo([item.lat, item.lng], 17, {
                                            animate: true,
                                            duration: 1.5
                                        });
                                    }
                                }}
                            >
                                <Popup>
                                    <div className="font-sans">
                                        <h3 className="font-bold text-lg text-amber-600 border-b pb-1 mb-2">{item.name}</h3>
                                        <p className="m-0 mb-1"><strong>Indirizzo:</strong> {item.address}</p>
                                        {item.birthDate && <p className="m-0 mb-1"><strong>{labelNato}</strong> {item.birthDate}</p>}
                                        {item.deathDate && <p className="m-0 mb-1"><strong>{labelMorto}</strong> {item.deathDate}</p>}
                                        {item.deathPlace && <p className="m-0 mb-1"><strong>{labelLuogoMorte}</strong> {item.deathPlace}</p>}
                                        {item.age && <p className="m-0 mb-1"><strong>Età:</strong> {item.age}</p>}
                                    </div>
                                </Popup>
                            </Marker>
                        )
                    })}
                </MarkerClusterGroup>
            </MapContainer>
        </div>
    );
}
