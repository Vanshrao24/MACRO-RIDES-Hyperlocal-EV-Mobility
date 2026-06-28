import * as h3 from 'h3-js';
import * as turf from '@turf/turf';
import type { LatLng, PickupPoint, CorridorStats } from '../types';
import { CORRIDOR_RADIUS_METERS, H3_RESOLUTION } from '../data/sampleData';

/**
 * Build a Turf LineString from route points
 */
export function routeToLineString(route: LatLng[]) {
  return turf.lineString(route.map(p => [p.lng, p.lat]));
}

/**
 * Create a 350m buffer polygon around the route using Turf
 */
export function buildCorridorPolygon(route: LatLng[]) {
  if (route.length < 2) return null;
  const line = routeToLineString(route);
  return turf.buffer(line, CORRIDOR_RADIUS_METERS / 1000, { units: 'kilometers', steps: 16 });
}

/**
 * Get all H3 cells covering the corridor polygon at the given resolution
 */
export function getCorridorH3Cells(corridorGeoJson: turf.Feature<turf.Polygon | turf.MultiPolygon>): Set<string> {
  const cells = new Set<string>();
  const geom = corridorGeoJson.geometry;

  const polys = geom.type === 'MultiPolygon'
    ? geom.coordinates
    : [geom.coordinates];

  for (const poly of polys) {
    try {
      const filled = h3.polygonToCells(
        {
          outer: poly[0].map(([lng, lat]) => [lat, lng] as [number, number]),
          holes: poly.slice(1).map(hole => hole.map(([lng, lat]) => [lat, lng] as [number, number])),
        },
        H3_RESOLUTION
      );
      filled.forEach(c => cells.add(c));
    } catch {
      // skip malformed polygons
    }
  }
  return cells;
}

/**
 * Assign H3 index to each pickup point and determine eligibility
 */
export function evaluatePickupPoints(
  pickups: Omit<PickupPoint, 'h3Index' | 'eligible' | 'distanceFromRoute'>[],
  corridorCells: Set<string>,
  traveledRoute: LatLng[]
): PickupPoint[] {
  const line = traveledRoute.length >= 2 ? routeToLineString(traveledRoute) : null;

  return pickups.map(p => {
    const h3Index = h3.latLngToCell(p.position.lat, p.position.lng, H3_RESOLUTION);
    const eligible = corridorCells.has(h3Index);

    let distanceFromRoute: number | undefined;
    if (line) {
      const pt = turf.point([p.position.lng, p.position.lat]);
      const nearest = turf.nearestPointOnLine(line, pt, { units: 'meters' });
      distanceFromRoute = nearest.properties.dist ?? undefined;
    }

    return { ...p, h3Index, eligible, distanceFromRoute };
  });
}

/**
 * Calculate bearing between two points (degrees)
 */
export function calcBearing(from: LatLng, to: LatLng): number {
  const fromPt = turf.point([from.lng, from.lat]);
  const toPt = turf.point([to.lng, to.lat]);
  return turf.bearing(fromPt, toPt);
}

/**
 * Calculate total route length in km
 */
export function calcRouteLength(route: LatLng[]): number {
  if (route.length < 2) return 0;
  const line = routeToLineString(route);
  return turf.length(line, { units: 'kilometers' });
}

/**
 * Corridor area in km²
 */
export function calcCorridorArea(corridorGeoJson: turf.Feature<turf.Polygon | turf.MultiPolygon> | null): number {
  if (!corridorGeoJson) return 0;
  return turf.area(corridorGeoJson) / 1_000_000; // m² → km²
}

/**
 * Convert corridor GeoJSON to Leaflet-compatible LatLng arrays
 */
export function corridorToLeafletCoords(
  corridorGeoJson: turf.Feature<turf.Polygon | turf.MultiPolygon>
): LatLng[][] {
  const geom = corridorGeoJson.geometry;
  const polys = geom.type === 'MultiPolygon'
    ? geom.coordinates
    : [geom.coordinates];

  return polys.map(poly =>
    poly[0].map(([lng, lat]) => ({ lat, lng }))
  );
}

/**
 * Aggregate stats for sidebar
 */
export function buildStats(
  pickups: PickupPoint[],
  corridorGeoJson: turf.Feature<turf.Polygon | turf.MultiPolygon> | null,
  fullRoute: LatLng[],
  traveledRoute: LatLng[]
): CorridorStats {
  const eligible = pickups.filter(p => p.eligible);
  return {
    totalPickups: pickups.length,
    eligiblePickups: eligible.length,
    corridorAreaKm2: calcCorridorArea(corridorGeoJson),
    routeLengthKm: calcRouteLength(fullRoute),
    traveledKm: calcRouteLength(traveledRoute),
    estimatedRiders: eligible.reduce((acc, p) => acc + p.waitingCount, 0),
  };
}
