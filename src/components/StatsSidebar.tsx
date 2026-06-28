import type { CorridorStats, PickupPoint } from '../types';

interface StatsSidebarProps {
  stats: CorridorStats;
  pickups: PickupPoint[];
  selectedPickup: PickupPoint | null;
  onSelectPickup: (p: PickupPoint | null) => void;
  theme: 'dark' | 'light';
}

function StatCard({ label, value, unit, accent }: { label: string; value: string | number; unit?: string; accent?: string }) {
  return (
    <div className="stat-card">
      <div className="stat-value" style={accent ? { color: accent } : {}}>
        {value}
        {unit && <span className="stat-unit">{unit}</span>}
      </div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

const TYPE_ICON: Record<string, string> = {
  metro: '🚇',
  bus_stop: '🚌',
  landmark: '📍',
  residential: '🏠',
};

export function StatsSidebar({ stats, pickups, selectedPickup, onSelectPickup }: StatsSidebarProps) {
  const eligible = pickups.filter(p => p.eligible).sort((a, b) => b.waitingCount - a.waitingCount);
  const ineligible = pickups.filter(p => !p.eligible);

  const pct = stats.totalPickups > 0
    ? Math.round((stats.eligiblePickups / stats.totalPickups) * 100)
    : 0;
  const travelPct = stats.routeLengthKm > 0
    ? Math.min(100, Math.round((stats.traveledKm / stats.routeLengthKm) * 100))
    : 0;

  return (
    <aside className="sidebar">
      {/* Header */}
      <div className="sidebar-header">
        <div className="logo-row">
          <span className="logo-icon">🛵</span>
          <div>
            <div className="logo-brand">MACRO RIDES</div>
            <div className="logo-sub">Corridor Visualizer</div>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="sidebar-section">
        <div className="section-title">Route Progress</div>
        <div className="progress-bar-wrap">
          <div className="progress-bar-track">
            <div className="progress-bar-fill" style={{ width: `${travelPct}%` }} />
          </div>
          <div className="progress-label">{travelPct}% complete · {stats.traveledKm.toFixed(2)} / {stats.routeLengthKm.toFixed(2)} km</div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="sidebar-section">
        <div className="section-title">Live Stats</div>
        <div className="stats-grid">
          <StatCard label="Eligible Stops" value={stats.eligiblePickups} accent="#38bdf8" />
          <StatCard label="Coverage" value={pct} unit="%" accent="#34d399" />
          <StatCard label="Waiting Riders" value={stats.estimatedRiders} accent="#a78bfa" />
          <StatCard label="Corridor Area" value={stats.corridorAreaKm2.toFixed(2)} unit=" km²" />
        </div>
      </div>

      {/* Legend */}
      <div className="sidebar-section">
        <div className="section-title">Map Legend</div>
        <div className="legend">
          <div className="legend-item"><span className="legend-dot" style={{ background: '#38bdf8' }} /><span>Route Corridor (350m)</span></div>
          <div className="legend-item"><span className="legend-line traveled" /><span>Traveled Path</span></div>
          <div className="legend-item"><span className="legend-dot eligible" /><span>Eligible Pickup</span></div>
          <div className="legend-item"><span className="legend-dot ineligible" /><span>Out of Corridor</span></div>
          <div className="legend-spacer" />
          <div className="legend-item"><span className="legend-dot" style={{ background: '#22d3ee', opacity: 0.6 }} /><span>Operational Zone</span></div>
          <div className="legend-item"><span className="legend-dot" style={{ background: '#a78bfa', opacity: 0.6 }} /><span>Premium Zone</span></div>
          <div className="legend-item"><span className="legend-dot" style={{ background: '#f87171', opacity: 0.6 }} /><span>Restricted Zone</span></div>
        </div>
      </div>

      {/* Eligible pickup list */}
      <div className="sidebar-section" style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div className="section-title">
          Eligible Pickups
          <span className="badge badge-eligible">{eligible.length}</span>
          <span style={{ marginLeft: 'auto', opacity: 0.5, fontSize: '11px' }}>{ineligible.length} inactive</span>
        </div>
        <div className="pickup-list">
          {eligible.length === 0 && (
            <div className="empty-state">Drive further to unlock pickup points</div>
          )}
          {eligible.map(p => (
            <div
              key={p.id}
              className={`pickup-item ${selectedPickup?.id === p.id ? 'selected' : ''}`}
              onClick={() => onSelectPickup(selectedPickup?.id === p.id ? null : p)}
            >
              <span className="pickup-icon">{TYPE_ICON[p.type]}</span>
              <div className="pickup-info">
                <div className="pickup-name">{p.name}</div>
                <div className="pickup-meta">
                  {Math.round(p.distanceFromRoute ?? 0)}m away
                  <span className="pickup-type">{p.type.replace('_', ' ')}</span>
                </div>
              </div>
              <div className="pickup-riders">
                <span className="riders-count">{p.waitingCount}</span>
                <span className="riders-label">riders</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
