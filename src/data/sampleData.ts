import type { LatLng, PickupPoint, Zone } from '../types';

// Route: Koramangala → Indiranagar (Bengaluru)
export const DRIVER_ROUTE: LatLng[] = [
  { lat: 12.9352, lng: 77.6245 }, // Koramangala 5th Block
  { lat: 12.9371, lng: 77.6268 },
  { lat: 12.9389, lng: 77.6290 },
  { lat: 12.9412, lng: 77.6315 },
  { lat: 12.9435, lng: 77.6341 },
  { lat: 12.9461, lng: 77.6360 },
  { lat: 12.9490, lng: 77.6378 },
  { lat: 12.9520, lng: 77.6395 },
  { lat: 12.9548, lng: 77.6415 },
  { lat: 12.9572, lng: 77.6440 },
  { lat: 12.9590, lng: 77.6468 },
  { lat: 12.9607, lng: 77.6497 },
  { lat: 12.9618, lng: 77.6528 },
  { lat: 12.9625, lng: 77.6558 },
  { lat: 12.9630, lng: 77.6585 },
  { lat: 12.9640, lng: 77.6610 },
  { lat: 12.9652, lng: 77.6635 },
  { lat: 12.9668, lng: 77.6658 },
  { lat: 12.9685, lng: 77.6678 },
  { lat: 12.9700, lng: 77.6695 }, // Indiranagar 12th Main
];

export const PICKUP_POINTS: Omit<PickupPoint, 'h3Index' | 'eligible' | 'distanceFromRoute'>[] = [
  // Along route (likely eligible)
  { id: 'p1', name: 'Koramangala Forum Mall', position: { lat: 12.9350, lng: 77.6100 }, type: 'landmark', waitingCount: 4 },
  { id: 'p2', name: '5th Block Bus Stop', position: { lat: 12.9378, lng: 77.6275 }, type: 'bus_stop', waitingCount: 2 },
  { id: 'p3', name: 'Sony World Signal', position: { lat: 12.9400, lng: 77.6302 }, type: 'bus_stop', waitingCount: 6 },
  { id: 'p4', name: 'HSR Sector 1', position: { lat: 12.9430, lng: 77.6335 }, type: 'residential', waitingCount: 3 },
  { id: 'p5', name: 'Agara Lake Stop', position: { lat: 12.9460, lng: 77.6358 }, type: 'bus_stop', waitingCount: 1 },
  { id: 'p6', name: 'BTM-HSR Junction', position: { lat: 12.9492, lng: 77.6373 }, type: 'metro', waitingCount: 9 },
  { id: 'p7', name: 'BDA Complex', position: { lat: 12.9522, lng: 77.6388 }, type: 'landmark', waitingCount: 2 },
  { id: 'p8', name: 'Domlur Flyover', position: { lat: 12.9558, lng: 77.6418 }, type: 'bus_stop', waitingCount: 5 },
  { id: 'p9', name: 'Embassy Golf Links', position: { lat: 12.9580, lng: 77.6450 }, type: 'landmark', waitingCount: 7 },
  { id: 'p10', name: 'Indira Nagar Metro', position: { lat: 12.9695, lng: 77.6405 }, type: 'metro', waitingCount: 12 },
  // Far from route (unlikely eligible)
  { id: 'p11', name: 'Jayanagar 4th Block', position: { lat: 12.9250, lng: 77.5830 }, type: 'bus_stop', waitingCount: 3 },
  { id: 'p12', name: 'JP Nagar Metro', position: { lat: 12.9108, lng: 77.5849 }, type: 'metro', waitingCount: 8 },
  { id: 'p13', name: 'Whitefield Main', position: { lat: 12.9716, lng: 77.7500 }, type: 'bus_stop', waitingCount: 4 },
  { id: 'p14', name: 'Bellandur Lake', position: { lat: 12.9255, lng: 77.6760 }, type: 'landmark', waitingCount: 2 },
  { id: 'p15', name: 'Marathahalli Bridge', position: { lat: 12.9591, lng: 77.7008 }, type: 'bus_stop', waitingCount: 6 },
  { id: 'p16', name: 'Ejipura Signal', position: { lat: 12.9478, lng: 77.6200 }, type: 'bus_stop', waitingCount: 3 },
  // Near-edge (may or may not be eligible)
  { id: 'p17', name: 'Domlur Layout', position: { lat: 12.9590, lng: 77.6490 }, type: 'residential', waitingCount: 1 },
  { id: 'p18', name: '12th Main Indiranagar', position: { lat: 12.9642, lng: 77.6642 }, type: 'residential', waitingCount: 4 },
  { id: 'p19', name: 'Jyoti Nivas College', position: { lat: 12.9365, lng: 77.6185 }, type: 'landmark', waitingCount: 2 },
  { id: 'p20', name: 'St Johns Hospital Stop', position: { lat: 12.9415, lng: 77.6172 }, type: 'bus_stop', waitingCount: 5 },
];

export const ZONES: Zone[] = [
  {
    id: 'z1',
    name: 'Koramangala Ops Zone',
    color: '#22d3ee',
    type: 'operational',
    polygon: [
      { lat: 12.9280, lng: 77.6180 },
      { lat: 12.9480, lng: 77.6180 },
      { lat: 12.9480, lng: 77.6400 },
      { lat: 12.9280, lng: 77.6400 },
    ],
  },
  {
    id: 'z2',
    name: 'HSR-Domlur Corridor',
    color: '#a78bfa',
    type: 'premium',
    polygon: [
      { lat: 12.9440, lng: 77.6340 },
      { lat: 12.9640, lng: 77.6340 },
      { lat: 12.9640, lng: 77.6540 },
      { lat: 12.9440, lng: 77.6540 },
    ],
  },
  {
    id: 'z3',
    name: 'Indiranagar Zone',
    color: '#34d399',
    type: 'operational',
    polygon: [
      { lat: 12.9600, lng: 77.6540 },
      { lat: 12.9780, lng: 77.6540 },
      { lat: 12.9780, lng: 77.6750 },
      { lat: 12.9600, lng: 77.6750 },
    ],
  },
  {
    id: 'z4',
    name: 'Restricted Zone',
    color: '#f87171',
    type: 'restricted',
    polygon: [
      { lat: 12.9200, lng: 77.6600 },
      { lat: 12.9350, lng: 77.6600 },
      { lat: 12.9350, lng: 77.6800 },
      { lat: 12.9200, lng: 77.6800 },
    ],
  },
];

export const MAP_CENTER: LatLng = { lat: 12.9530, lng: 77.6430 };
export const MAP_ZOOM = 14;
export const CORRIDOR_RADIUS_METERS = 350;
export const H3_RESOLUTION = 9; // ~174m hex edge — good granularity for 350m buffer
