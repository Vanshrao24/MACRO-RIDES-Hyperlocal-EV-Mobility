import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Polyline, Polygon, CircleMarker, Tooltip, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import type { PickupPoint, Zone, LatLng, ThemeMode } from '../types';
import { DRIVER_ROUTE, MAP_CENTER, MAP_ZOOM } from '../data/sampleData';
import { DriverMarker } from './DriverMarker';

interface MapViewProps {
  traveledRoute: LatLng[];
  currentPosition: LatLng;
  heading: number;
  corridorPolygons: LatLng[][];
  pickups: PickupPoint[];
  zones: Zone[];
  theme: ThemeMode;
  selectedPickup: PickupPoint | null;
  onPickupClick: (p: PickupPoint) => void;
}

function TileLayerSwitcher({ theme }: { theme: ThemeMode }) {
  const darkTile = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
  const lightTile = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
  const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>';
  return <TileLayer url={theme === 'dark' ? darkTile : lightTile} attribution={attribution} />;
}

function FollowDriver({ position }: { position: LatLng }) {
  const map = useMap();
  const prevRef = useRef<LatLng | null>(null);
  useEffect(() => {
    if (
      prevRef.current &&
      prevRef.current.lat === position.lat &&
      prevRef.current.lng === position.lng
    ) return;
    prevRef.current = position;
    // Smooth pan without zoom change
    map.panTo([position.lat, position.lng], { animate: true, duration: 0.6, noMoveStart: true });
  }, [position, map]);
  return null;
}

const PICKUP_TYPE_COLORS: Record<PickupPoint['type'], string> = {
  metro: '#6366f1',
  bus_stop: '#f59e0b',
  landmark: '#8b5cf6',
  residential: '#10b981',
};

const ZONE_TYPE_OPACITY: Record<Zone['type'], number> = {
  operational: 0.12,
  premium: 0.15,
  restricted: 0.18,
};

export function MapView({
  traveledRoute,
  currentPosition,
  heading,
  corridorPolygons,
  pickups,
  zones,
  theme,
  selectedPickup,
  onPickupClick,
}: MapViewProps) {
  return (
    <MapContainer
      center={[MAP_CENTER.lat, MAP_CENTER.lng]}
      zoom={MAP_ZOOM}
      style={{ width: '100%', height: '100%' }}
      zoomControl={false}
    >
      <TileLayerSwitcher theme={theme} />
      <FollowDriver position={currentPosition} />

      {/* Zone Polygons */}
      {zones.map(zone => (
        <Polygon
          key={zone.id}
          positions={zone.polygon.map(p => [p.lat, p.lng])}
          pathOptions={{
            color: zone.color,
            fillColor: zone.color,
            fillOpacity: ZONE_TYPE_OPACITY[zone.type],
            weight: 1.5,
            dashArray: zone.type === 'restricted' ? '6 4' : undefined,
          }}
        >
          <Tooltip sticky>
            <span style={{ fontWeight: 600 }}>{zone.name}</span>
            <br />
            <span style={{ textTransform: 'capitalize', fontSize: '11px', opacity: 0.7 }}>{zone.type}</span>
          </Tooltip>
        </Polygon>
      ))}

      {/* Corridor Buffer */}
      {corridorPolygons.map((poly, i) => (
        <Polygon
          key={`corridor-${i}`}
          positions={poly.map(p => [p.lat, p.lng])}
          pathOptions={{
            color: '#38bdf8',
            fillColor: '#38bdf8',
            fillOpacity: 0.13,
            weight: 2,
            dashArray: '8 4',
          }}
        />
      ))}

      {/* Full Route (ghost) */}
      <Polyline
        positions={DRIVER_ROUTE.map(p => [p.lat, p.lng])}
        pathOptions={{ color: theme === 'dark' ? '#334155' : '#cbd5e1', weight: 3, dashArray: '4 6' }}
      />

      {/* Traveled Route */}
      {traveledRoute.length >= 2 && (
        <Polyline
          positions={traveledRoute.map(p => [p.lat, p.lng])}
          pathOptions={{ color: '#38bdf8', weight: 4, lineCap: 'round', lineJoin: 'round' }}
        />
      )}

      {/* Pickup Points */}
      {pickups.map(pickup => {
        const isSelected = selectedPickup?.id === pickup.id;
        const color = pickup.eligible ? PICKUP_TYPE_COLORS[pickup.type] : (theme === 'dark' ? '#4b5563' : '#9ca3af');
        const radius = pickup.eligible ? (isSelected ? 11 : 8) : 5;

        return (
          <CircleMarker
            key={pickup.id}
            center={[pickup.position.lat, pickup.position.lng]}
            radius={radius}
            pathOptions={{
              color: pickup.eligible ? color : (theme === 'dark' ? '#374151' : '#d1d5db'),
              fillColor: color,
              fillOpacity: pickup.eligible ? 0.9 : 0.4,
              weight: isSelected ? 3 : pickup.eligible ? 2 : 1,
            }}
            eventHandlers={{ click: () => onPickupClick(pickup) }}
          >
            <Tooltip permanent={false} direction="top" offset={[0, -8]}>
              <div style={{ minWidth: 130 }}>
                <div style={{ fontWeight: 700, fontSize: '12px', marginBottom: 2 }}>{pickup.name}</div>
                <div style={{ fontSize: '11px', opacity: 0.8, textTransform: 'capitalize' }}>{pickup.type.replace('_', ' ')}</div>
                <div style={{ fontSize: '11px', marginTop: 2 }}>
                  {pickup.eligible
                    ? <span style={{ color: '#10b981', fontWeight: 600 }}>✓ {pickup.waitingCount} rider{pickup.waitingCount !== 1 ? 's' : ''} waiting</span>
                    : <span style={{ color: '#ef4444' }}>✗ Out of corridor</span>
                  }
                </div>
                {pickup.distanceFromRoute !== undefined && (
                  <div style={{ fontSize: '10px', opacity: 0.6, marginTop: 1 }}>
                    {Math.round(pickup.distanceFromRoute)}m from route
                  </div>
                )}
              </div>
            </Tooltip>
          </CircleMarker>
        );
      })}

      {/* Driver Marker */}
      <DriverMarker position={currentPosition} heading={heading} theme={theme} />
    </MapContainer>
  );
}
