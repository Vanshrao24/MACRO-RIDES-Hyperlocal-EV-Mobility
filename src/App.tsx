import { useState, useCallback } from 'react';
import { MapView } from './components/MapView';
import { StatsSidebar } from './components/StatsSidebar';
import { ControlsBar } from './components/ControlsBar';
import { useSimulation } from './hooks/useSimulation';
import { useCorridor } from './hooks/useCorridor';
import { DRIVER_ROUTE, ZONES } from './data/sampleData';
import type { PickupPoint, ThemeMode } from './types';
import './styles/app.css';

export default function App() {
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [selectedPickup, setSelectedPickup] = useState<PickupPoint | null>(null);

  const { routeState, isPlaying, isComplete, speed, play, pause, reset, changeSpeed } = useSimulation(DRIVER_ROUTE);
  const { corridorPolygons, pickups, stats } = useCorridor(routeState.traveledRoute, DRIVER_ROUTE);

  const handleThemeToggle = useCallback(() => {
    setTheme(t => t === 'dark' ? 'light' : 'dark');
  }, []);

  return (
    <div className={`app-root ${theme}`}>
      <StatsSidebar
        stats={stats}
        pickups={pickups}
        selectedPickup={selectedPickup}
        onSelectPickup={setSelectedPickup}
        theme={theme}
      />
      <div className="map-area">
        <ControlsBar
          isPlaying={isPlaying}
          isComplete={isComplete}
          speed={speed}
          theme={theme}
          driverSpeed={routeState.speed}
          onPlay={play}
          onPause={pause}
          onReset={reset}
          onSpeedChange={changeSpeed}
          onThemeToggle={handleThemeToggle}
        />
        <div className="map-container">
          <MapView
            traveledRoute={routeState.traveledRoute}
            currentPosition={routeState.currentPosition}
            heading={routeState.heading}
            corridorPolygons={corridorPolygons}
            pickups={pickups}
            zones={ZONES}
            theme={theme}
            selectedPickup={selectedPickup}
            onPickupClick={p => setSelectedPickup(prev => prev?.id === p.id ? null : p)}
          />
        </div>
        <div className="map-attribution-bar">
          Koramangala → Indiranagar · Bengaluru · H3 Res-9 · 350m Turf Buffer
        </div>
      </div>
    </div>
  );
}
