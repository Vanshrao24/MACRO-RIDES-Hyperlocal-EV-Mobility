import { useMemo } from "react";
import type { PickupPoint, CorridorStats } from "../types";
import type { LatLng } from "../types";

import {
  buildCorridorPolygon,
  getCorridorH3Cells,
  evaluatePickupPoints,
  corridorToLeafletCoords,
  buildStats,
} from "../utils/geo";

import { PICKUP_POINTS } from "../data/sampleData";

import type { Feature, Polygon, MultiPolygon } from "geojson";

export function useCorridor(traveledRoute: LatLng[], fullRoute: LatLng[]) {
  const corridorGeoJson = useMemo(() => {
    if (traveledRoute.length < 2) return null;
    return buildCorridorPolygon(traveledRoute);
  }, [traveledRoute]);

  const corridorCells = useMemo(() => {
    if (!corridorGeoJson) return new Set<string>();

    return getCorridorH3Cells(
      corridorGeoJson as Feature<Polygon | MultiPolygon>
    );
  }, [corridorGeoJson]);

  const corridorPolygons = useMemo(() => {
    if (!corridorGeoJson) return [];

    return corridorToLeafletCoords(
      corridorGeoJson as Feature<Polygon | MultiPolygon>
    );
  }, [corridorGeoJson]);

  const pickups: PickupPoint[] = useMemo(() => {
    return evaluatePickupPoints(
      PICKUP_POINTS,
      corridorCells,
      traveledRoute
    );
  }, [corridorCells, traveledRoute]);

  const stats: CorridorStats = useMemo(() => {
    return buildStats(
      pickups,
      corridorGeoJson as Feature<Polygon | MultiPolygon> | null,
      fullRoute,
      traveledRoute
    );
  }, [pickups, corridorGeoJson, fullRoute, traveledRoute]);

  return {
    corridorGeoJson,
    corridorPolygons,
    corridorCells,
    pickups,
    stats,
  };
}
