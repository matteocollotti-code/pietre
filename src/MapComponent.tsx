import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from '@/components/ui/button';

// Fix per l'icona di default di Leaflet in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const milanCoords: [number, number] = [45.4642, 9.1900];
const initialZoom = 13;

const getGenderIcon = (isFemale: boolean) => L.divIcon({
    className: 'custom-div-icon',
    html: `<div class="w-3 h-3 rounded-sm shadow-md border border-white/50 backdrop-blur-sm ${isFemale ? 'bg-orange-500/90 shadow-orange-500/40' : 'bg-purple-600/90 shadow-purple-600/40'}"></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6]
});

const createClusterCustomIcon = function (cluster: any) {
    return L.divIcon({
        html: `<div class="w-8 h-8 rounded-full border border-white/60 bg-white/70 backdrop-blur-md shadow-lg flex items-center justify-center font-bold text-slate-800 text-sm ring-2 ring-white/20">${cluster.getChildCount()}</div>`,
        className: 'custom-cluster-icon',
        iconSize: L.point(32, 32)
    });
};

function MilanBoundary() {
    const map = useMap();
    useEffect(() => {
        fetch('https://nominatim.openstreetmap.org/search?q=Milano%2C+Lombardia%2C+Italy&polygon_geojson=1&format=json&limit=1')
            .then(res => res.json())
            .then(data => {
                if (data && data.length > 0) {
                    const geojson = data[0].geojson;

                    // 1. Draw the classic boundary (Stroke only)
                    L.geoJSON(geojson, {
                        style: {
                            color: '#c0392b',
                            weight: 2,
                            opacity: 0.8,
                            fillOpacity: 0,
                            interactive: false
                        }
                    }).addTo(map);

                    // 2. Create the inverted polygon to fade the outside world
                    let holes: any[] = [];
                    if (geojson.type === 'Polygon') {
                        holes = geojson.coordinates;
                    } else if (geojson.type === 'MultiPolygon') {
                        geojson.coordinates.forEach((polygonRings: any) => {
                            holes.push(...polygonRings);
                        });
                    }

                    const worldOuterRing = [
                        [180, 90],
                        [-180, 90],
                        [-180, -90],
                        [180, -90],
                        [180, 90]
                    ];

                    const invertedPolygon = {
                        type: "Feature",
                        geometry: {
                            type: "Polygon",
                            coordinates: [
                                worldOuterRing,
                                ...holes
                            ]
                        }
                    };

                    L.geoJSON(invertedPolygon as any, {
                        style: {
                            color: 'transparent',
                            weight: 0,
                            fillColor: '#f8fafc', // slate-50 color to match app background
                            fillOpacity: 0.85,
                            interactive: false
                        }
                    }).addTo(map);
                }
            });
    }, [map]);
    return null;
}

interface MapProps {
    markers: any[];
    routes?: { id: string, color: string, points: [number, number][] }[];
    onOpenDetail?: (info: { name: string, theme: string }) => void;
}

export default function MapComponent({ markers, routes = [], onOpenDetail }: MapProps) {
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

                {routes.map(r => (
                    <Polyline
                        key={r.id}
                        positions={r.points}
                        pathOptions={{ color: r.color, weight: 3, opacity: 0.8 }}
                    />
                ))}

                <MarkerClusterGroup
                    chunkedLoading
                    spiderfyOnMaxZoom={true}
                    showCoverageOnHover={false}
                    zoomToBoundsOnClick={true}
                    maxClusterRadius={1}
                    iconCreateFunction={createClusterCustomIcon}
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
                                icon={getGenderIcon(isFemale)}
                            >
                                <Popup className="glass-popup">
                                    <div className="font-sans">
                                        <h3 className={`font-bold text-lg border-b border-slate-200 pb-1 mb-2 ${isFemale ? 'text-orange-600' : 'text-purple-600'}`}>
                                            {item.name}
                                        </h3>
                                        <p className="m-0 mb-1"><strong>Indirizzo:</strong> {item.address}</p>
                                        {item.birthDate && <p className="m-0 mb-1"><strong>{labelNato}</strong> {item.birthDate}</p>}
                                        {item.deathDate && <p className="m-0 mb-1"><strong>{labelMorto}</strong> {item.deathDate}</p>}
                                        {item.deathPlace && <p className="m-0 mb-1"><strong>{labelLuogoMorte}</strong> {item.deathPlace}</p>}
                                        {item.age && <p className="m-0 mb-1"><strong>Età:</strong> {item.age}</p>}

                                        <div className="mt-3 flex flex-col gap-1.5">
                                            {(item.raw?.corpi === 1 || item.raw?.corpi === '1') && (
                                                <Button size="sm" variant="outline" className="w-full text-[11px] h-7 border-red-500/50 text-red-700 hover:bg-red-50 bg-white/50 backdrop-blur-sm" onClick={() => onOpenDetail?.({ name: item.name, theme: 'Corpi' })}>Approfondimento: Corpi</Button>
                                            )}
                                            {(item.raw?.case === 1 || item.raw?.case === '1') && (
                                                <Button size="sm" variant="outline" className="w-full text-[11px] h-7 border-green-500/50 text-green-700 hover:bg-green-50 bg-white/50 backdrop-blur-sm" onClick={() => onOpenDetail?.({ name: item.name, theme: 'Casa' })}>Approfondimento: Casa</Button>
                                            )}
                                            {(item.raw?.cose === 1 || item.raw?.cose === '1' || item.raw?.['cose '] === 1 || item.raw?.['cose '] === '1') && (
                                                <Button size="sm" variant="outline" className="w-full text-[11px] h-7 border-blue-500/50 text-blue-700 hover:bg-blue-50 bg-white/50 backdrop-blur-sm" onClick={() => onOpenDetail?.({ name: item.name, theme: 'Cose' })}>Approfondimento: Cose</Button>
                                            )}
                                            {(item.raw?.amore === 1 || item.raw?.amore === '1') && (
                                                <Button size="sm" variant="outline" className="w-full text-[11px] h-7 border-pink-500/50 text-pink-700 hover:bg-pink-50 bg-white/50 backdrop-blur-sm" onClick={() => onOpenDetail?.({ name: item.name, theme: 'Amore' })}>Approfondimento: Amore</Button>
                                            )}
                                        </div>
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
