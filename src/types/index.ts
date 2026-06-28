export interface LatLng {
  lat: number;
  lng: number;
}

export interface PickupPoint {
  id: string;
  name: string;
  position: LatLng;
  type: 'metro' | 'bus_stop' | 'landmark' | 'residential';
  waitingCount: number;
  h3Index?: string;
  eligible: boolean;
  distanceFromRoute?: number;
}

export interface Zone {
  id: string;
  name: string;
  color: string;
  polygon: LatLng[];
  type: 'operational' | 'restricted' | 'premium';
}

export interface RouteState {
  fullRoute: LatLng[];
  traveledRoute: LatLng[];
  currentIndex: number;
  currentPosition: LatLng;
  heading: number;
  speed: number; // km/h simulated
}

export interface CorridorStats {
  totalPickups: number;
  eligiblePickups: number;
  corridorAreaKm2: number;
  routeLengthKm: number;
  traveledKm: number;
  estimatedRiders: number;
}

export type ThemeMode = 'dark' | 'light';
export type PlaybackSpeed = 0.5 | 1 | 2 | 4;
