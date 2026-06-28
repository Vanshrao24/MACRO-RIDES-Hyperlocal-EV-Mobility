import type { PlaybackSpeed, ThemeMode } from '../types';

interface ControlsBarProps {
  isPlaying: boolean;
  isComplete: boolean;
  speed: PlaybackSpeed;
  theme: ThemeMode;
  driverSpeed: number;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onSpeedChange: (s: PlaybackSpeed) => void;
  onThemeToggle: () => void;
}

const SPEEDS: PlaybackSpeed[] = [0.5, 1, 2, 4];

export function ControlsBar({
  isPlaying,
  isComplete,
  speed,
  theme,
  driverSpeed,
  onPlay,
  onPause,
  onReset,
  onSpeedChange,
  onThemeToggle,
}: ControlsBarProps) {
  return (
    <div className="controls-bar">
      <div className="controls-left">
        {/* Play/Pause */}
        {!isComplete ? (
          <button
            className={`ctrl-btn primary ${isPlaying ? 'active' : ''}`}
            onClick={isPlaying ? onPause : onPlay}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <rect x="3" y="2" width="4" height="12" rx="1" />
                <rect x="9" y="2" width="4" height="12" rx="1" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M3 2.5l10 5.5-10 5.5V2.5z" />
              </svg>
            )}
            {isPlaying ? 'Pause' : 'Play'}
          </button>
        ) : (
          <span className="complete-badge">✓ Route Complete</span>
        )}

        {/* Reset */}
        <button className="ctrl-btn" onClick={onReset} title="Reset">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
            <path d="M7 1.5A5.5 5.5 0 1 1 1.5 7H3a4 4 0 1 0 4-4V1.5z" />
            <path d="M2 1v3.5h3.5" strokeWidth="1.2" stroke="currentColor" fill="none" strokeLinecap="round" />
          </svg>
          Reset
        </button>

        <div className="divider-v" />

        {/* Speed control */}
        <div className="speed-control">
          <span className="speed-label">Speed</span>
          {SPEEDS.map(s => (
            <button
              key={s}
              className={`speed-btn ${speed === s ? 'active' : ''}`}
              onClick={() => onSpeedChange(s)}
            >
              {s}×
            </button>
          ))}
        </div>

        <div className="divider-v" />

        {/* Driver speed indicator */}
        <div className="driver-speed">
          <span className="speed-icon">⚡</span>
          <span>{Math.round(driverSpeed)} km/h</span>
        </div>
      </div>

      <div className="controls-right">
        <div className="h3-badge" title="H3 spatial indexing active">
          <span>H3</span> Res-9
        </div>
        <div className="corridor-badge">
          350m corridor
        </div>
        {/* Theme toggle */}
        <button className="ctrl-btn" onClick={onThemeToggle} title="Toggle theme">
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>
    </div>
  );
}
