import { useState, useEffect, useRef, useCallback } from 'react';
import type { RouteState, PlaybackSpeed } from '../types';
import type { LatLng } from '../types';
import { calcBearing } from '../utils/geo';

export function useSimulation(fullRoute: LatLng[], baseIntervalMs = 800) {
  const [routeState, setRouteState] = useState<RouteState>({
    fullRoute,
    traveledRoute: [fullRoute[0]],
    currentIndex: 0,
    currentPosition: fullRoute[0],
    heading: 0,
    speed: 25,
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<PlaybackSpeed>(1);
  const [isComplete, setIsComplete] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const indexRef = useRef(0);

  const tick = useCallback(() => {
    indexRef.current += 1;
    const idx = indexRef.current;

    if (idx >= fullRoute.length) {
      setIsPlaying(false);
      setIsComplete(true);
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const currentPosition = fullRoute[idx];
    const prevPos = fullRoute[Math.max(0, idx - 1)];
    const heading = calcBearing(prevPos, currentPosition);

    setRouteState({
      fullRoute,
      traveledRoute: fullRoute.slice(0, idx + 1),
      currentIndex: idx,
      currentPosition,
      heading,
      speed: 20 + Math.random() * 15,
    });
  }, [fullRoute]);

  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (isPlaying) {
      const interval = baseIntervalMs / speed;
      timerRef.current = setInterval(tick, interval);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, speed, tick, baseIntervalMs]);

  const play = useCallback(() => {
    if (isComplete) return;
    setIsPlaying(true);
  }, [isComplete]);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const reset = useCallback(() => {
    setIsPlaying(false);
    setIsComplete(false);
    indexRef.current = 0;
    setRouteState({
      fullRoute,
      traveledRoute: [fullRoute[0]],
      currentIndex: 0,
      currentPosition: fullRoute[0],
      heading: 0,
      speed: 25,
    });
  }, [fullRoute]);

  const changeSpeed = useCallback((s: PlaybackSpeed) => {
    setSpeed(s);
  }, []);

  return { routeState, isPlaying, isComplete, speed, play, pause, reset, changeSpeed };
}
