import { useMemo } from 'react';
import { Marker } from 'react-leaflet';
import L from 'leaflet';
import type { LatLng, ThemeMode } from '../types';

interface DriverMarkerProps {
  position: LatLng;
  heading: number;
  theme: ThemeMode;
}

export function DriverMarker({ position, heading, theme }: DriverMarkerProps) {
  const icon = useMemo(() => {
    const bg = theme === 'dark' ? '#0ea5e9' : '#0284c7';
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
        <circle cx="20" cy="20" r="18" fill="${bg}" fill-opacity="0.25" />
        <circle cx="20" cy="20" r="12" fill="${bg}" />
        <circle cx="20" cy="20" r="12" fill="white" fill-opacity="0.15" />
        <path d="M20 9 L24 17 L20 15 L16 17 Z" fill="white" transform="rotate(${heading}, 20, 20)" />
        <circle cx="20" cy="20" r="3" fill="white" />
      </svg>
    `;
    return L.divIcon({
      html: svg,
      className: '',
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });
  }, [heading, theme]);

  return <Marker position={[position.lat, position.lng]} icon={icon} zIndexOffset={1000} />;
}
