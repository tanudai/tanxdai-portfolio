import { useState, useEffect, useRef } from 'react';
import { toggleAmbientLoFi } from '../utils/audioPhysics.js';

const TRACKS = [
  { title: 'Resonance', artist: 'HOME', duration: '3:32', link: 'https://open.spotify.com/search/HOME%20Resonance' },
  { title: 'Awake', artist: 'Tycho', duration: '4:43', link: 'https://open.spotify.com/search/Tycho%20Awake' },
  { title: 'Memory Reboot', artist: 'VØJ & Narvent', duration: '2:48', link: 'https://open.spotify.com/search/Memory%20Reboot' },
  { title: 'Midnight City', artist: 'M83', duration: '4:03', link: 'https://open.spotify.com/search/M83%20Midnight%20City' },
  { title: 'Daylight', artist: 'Disasterpeace', duration: '3:15', link: 'https://open.spotify.com/search/Disasterpeace%20Daylight' },
];

export default function SpotifyWidget() {
  const [trackIdx, setTrackIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [seconds, setSeconds] = useState(48);
  const intervalRef = useRef(null);

  const current = TRACKS[trackIdx];

  const handleTogglePlay = (e) => {
    e.stopPropagation();
    setIsPlaying(prev => {
      const next = !prev;
      toggleAmbientLoFi(next);
      return next;
    });
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setTrackIdx(i => (i + 1) % TRACKS.length);
    setSeconds(0);
  };

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setSeconds(s => (s + 1) % 240);
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      toggleAmbientLoFi(false);
    };
  }, []);

  const formatTime = (s) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className={`spotify-card ${isPlaying ? 'is-playing' : ''}`}>
      <div className="spotify-top-row">
        <div className="spotify-tag">
          <span className="spotify-icon-dot" />
          <span className="spotify-label">NOW CODING TO</span>
        </div>
        <div className="spotify-eq">
          <span className="eq-bar bar-1" />
          <span className="eq-bar bar-2" />
          <span className="eq-bar bar-3" />
          <span className="eq-bar bar-4" />
        </div>
      </div>

      <div className="spotify-main">
        {/* Spinning Vinyl */}
        <div className={`vinyl-disc ${isPlaying ? 'spinning' : ''}`} title="Lo-fi Vinyl">
          <svg viewBox="0 0 100 100" className="vinyl-svg" aria-hidden="true">
            <circle cx="50" cy="50" r="48" fill="#121413" stroke="#253229" strokeWidth="1.5" />
            <circle cx="50" cy="50" r="41" fill="none" stroke="#1d2620" strokeWidth="0.8" />
            <circle cx="50" cy="50" r="34" fill="none" stroke="#2a382f" strokeWidth="0.8" />
            <circle cx="50" cy="50" r="27" fill="none" stroke="#1d2620" strokeWidth="0.8" />
            {/* Center Label */}
            <circle cx="50" cy="50" r="18" fill="#1db954" opacity="0.9" />
            <circle cx="50" cy="50" r="17" fill="#1a2e22" />
            <circle cx="50" cy="50" r="4" fill="#0d110f" />
          </svg>
          <span className="vinyl-sheen" />
        </div>

        {/* Track Info */}
        <div className="spotify-info">
          <a
            href={current.link}
            target="_blank"
            rel="noopener noreferrer"
            className="spotify-title"
            title="Open in Spotify"
          >
            {current.title}
          </a>
          <span className="spotify-artist">{current.artist}</span>
          <div className="spotify-progress-wrap">
            <div className="spotify-progress-bar">
              <div
                className="spotify-progress-fill"
                style={{ width: `${Math.min(100, (seconds / 200) * 100)}%` }}
              />
            </div>
            <span className="spotify-time">{formatTime(seconds)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="spotify-actions">
          <button
            type="button"
            className="spotify-btn play-btn"
            onClick={handleTogglePlay}
            aria-label={isPlaying ? 'Pause ambient lo-fi' : 'Play ambient lo-fi'}
            title={isPlaying ? 'Pause' : 'Play ambient chord'}
          >
            {isPlaying ? (
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                <rect x="5" y="4" width="4" height="16" rx="1" />
                <rect x="15" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="6,4 20,12 6,20" />
              </svg>
            )}
          </button>
          <button
            type="button"
            className="spotify-btn next-btn"
            onClick={handleNext}
            aria-label="Next track"
            title="Next track"
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5,4 15,12 5,20" />
              <line x1="19" y1="5" x2="19" y2="19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
