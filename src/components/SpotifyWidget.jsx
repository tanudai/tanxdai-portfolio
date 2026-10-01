import { useState, useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'motion/react';

const PLAYLIST_URL = 'https://music.youtube.com/playlist?list=RDCLAK5uy_mcd5hbKGTuwPRREfC4-0foufnfjx90hrg';
const PLAYLIST_NAME = 'HIIT Workout';

const TRACKS = [
  {
    title: 'Makeba',
    artist: 'Jain',
    genre: 'WORKOUT HYPE',
    src: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/24/31/34/24313488-9bec-15cd-90c7-79c3297ca5a2/mzaf_772666532216043993.plus.aac.p.m4a',
    art: 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/5a/78/86/5a788626-308e-eb19-80e3-1b3b78ef1fe8/886446194783.jpg/100x100bb.jpg',
    link: 'https://music.youtube.com/watch?v=VI9gIPBH_dM'
  },
  {
    title: 'Satisfaction',
    artist: 'David Guetta',
    genre: 'ELECTRO ENERGY',
    src: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/25/79/74/257974ed-2207-dd98-7e93-40e97de8ff00/mzaf_15419689746277624085.plus.aac.p.m4a',
    art: 'https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/82/f3/99/82f399a3-fda0-cd5e-f07f-a235060d194c/196589382511.jpg/100x100bb.jpg',
    link: 'https://music.youtube.com/watch?v=HLXAejLADAY'
  },
  {
    title: 'Desire',
    artist: 'Calvin Harris & Sam Smith',
    genre: 'HIGH TEMPO DANCE',
    src: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/12/d0/81/12d08160-3e2a-7b93-c9ec-55df3c8f8df8/mzaf_3597527060037878054.plus.aac.p.m4a',
    art: 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/d2/43/52/d2435238-84c2-1264-4e43-928dc5c1b720/196871283625.jpg/100x100bb.jpg',
    link: 'https://music.youtube.com/watch?v=1JPNFp0f53I'
  },
  {
    title: 'Feel It Still',
    artist: 'Portugal. The Man',
    genre: 'UPBEAT CARDIO',
    src: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/63/7c/dd/637cdd7a-3000-0784-28c7-dcbfe99209c8/mzaf_2191237013429360837.plus.aac.p.m4a',
    art: 'https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/76/fc/2d/76fc2dba-69ea-2718-012d-962dcb661bf1/075679896933.jpg/100x100bb.jpg',
    link: 'https://music.youtube.com/watch?v=pBkHHoOIIn8'
  }
];

export default function SpotifyWidget({ compact = false }) {
  const reducedMotion = useReducedMotion();
  const [expanded, setExpanded] = useState(false);
  const [playbackError, setPlaybackError] = useState('');
  const [loading, setLoading] = useState(false);
  const [trackIdx, setTrackIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(30);
  const audioRef = useRef(null);
  const recordButtonRef = useRef(null);

  const current = TRACKS[trackIdx];

  // Sync audio source when trackIdx changes
  useEffect(() => {
    if (!audioRef.current) return;
    setPlaybackError('');
    setCurrentTime(0);
    audioRef.current.src = current.src;
    audioRef.current.load();
    if (isPlaying) {
      audioRef.current.play().catch(() => setIsPlaying(false));
    } else {
      setCurrentTime(0);
    }
  }, [trackIdx]);

  // Clean up audio on unmount
  useEffect(() => {
    const audio = audioRef.current;
    return () => {
      if (audio) {
        audio.pause();
        audio.removeAttribute('src');
        audio.load();
      }
    };
  }, []);

  const handleTogglePlay = (e) => {
    e.stopPropagation();
    setExpanded(true);
    if (compact && !expanded && isPlaying) return;
    setPlaybackError('');
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      setLoading(true);
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        setPlaybackError('Preview unavailable. Try another track.');
        setIsPlaying(false);
      }).finally(() => setLoading(false));
    }
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setTrackIdx(i => (i + 1) % TRACKS.length);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setTrackIdx(i => (i - 1 + TRACKS.length) % TRACKS.length);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      if (audioRef.current.duration && !isNaN(audioRef.current.duration)) {
        setDuration(audioRef.current.duration);
      }
    }
  };

  const handleEnded = () => {
    // Auto advance to next song
    setTrackIdx(i => (i + 1) % TRACKS.length);
  };

  const formatTime = (s) => {
    if (isNaN(s)) return '0:00';
    const mins = Math.floor(s / 60);
    const secs = Math.floor(s % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (compact) return (
    <div className={`mini-vinyl-bar ${isPlaying ? 'is-playing' : ''}`} data-decorative="true">
      <audio
        ref={audioRef}
        src={current.src}
        preload="metadata"
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onPlaying={() => { setIsPlaying(true); setLoading(false); }}
        onPause={() => setIsPlaying(false)}
        onError={() => { setIsPlaying(false); setLoading(false); setPlaybackError('Preview unavailable.'); }}
      />
      <button
        ref={recordButtonRef}
        type="button"
        className={`mini-vinyl-disc ${isPlaying ? 'spinning' : ''}`}
        onClick={handleTogglePlay}
        aria-label={isPlaying ? 'Pause music' : 'Play music'}
        title={`${current.title} by ${current.artist}`}
        disabled={loading}
      >
        <span className="mini-vinyl-grooves" aria-hidden="true">
          <img src={current.art} alt="" className="mini-vinyl-art" />
        </span>
        <span className="mini-vinyl-hole" aria-hidden="true" />
      </button>
      <div className="mini-vinyl-info">
        <div className="mini-vinyl-headline">
          <span className="mini-track-title">{current.title}</span>
          <span className="mini-track-sep" aria-hidden="true">·</span>
          <span className="mini-track-artist">{current.artist}</span>
        </div>
        <div className="mini-vinyl-subline">
          <a
            href={PLAYLIST_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mini-playlist-link"
            title="Open HIIT Workout on YouTube Music"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="mini-yt-dot" aria-hidden="true" />
            <span className="mini-pl-title">{loading ? 'LOADING…' : isPlaying ? 'PLAYING' : 'HIIT WORKOUT'}</span>
            <span className="mini-pl-sub">· YT Music</span>
            <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="7" y1="17" x2="17" y2="7" />
              <polyline points="7 7 17 7 17 17" />
            </svg>
          </a>
        </div>
      </div>
      <div className="mini-vinyl-actions">
        <button
          type="button"
          className="mini-ctrl-btn"
          onClick={handlePrev}
          aria-label="Previous track"
          title="Previous track"
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <line x1="5" y1="5" x2="5" y2="19" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            <polygon points="19,5 9,12 19,19" />
          </svg>
        </button>
        <button
          type="button"
          className={`mini-ctrl-btn mini-play-btn ${isPlaying ? 'is-playing' : ''}`}
          onClick={handleTogglePlay}
          aria-label={isPlaying ? 'Pause music' : 'Play music'}
          title={isPlaying ? 'Pause' : 'Play'}
          disabled={loading}
        >
          {isPlaying ? (
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <rect x="5" y="4" width="4" height="16" rx="1" />
              <rect x="15" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <polygon points="6,4 20,12 6,20" />
            </svg>
          )}
        </button>
        <button
          type="button"
          className="mini-ctrl-btn"
          onClick={handleNext}
          aria-label="Next track"
          title="Next track"
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <polygon points="5,5 15,12 5,19" />
            <line x1="19" y1="5" x2="19" y2="19" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  );

  return (
    <div className={`spotify-card ${isPlaying ? 'is-playing' : ''}`} data-decorative="true">
      {/* Hidden Native Audio Element */}
      <audio
        ref={audioRef}
        src={current.src}
        preload="metadata"
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onError={() => { setIsPlaying(false); setPlaybackError('Preview unavailable. Try another track.'); }}
      />

      <div className="spotify-top-row">
        <div className="spotify-tag">
          <span className="spotify-icon-dot" />
          <span className="spotify-label">{current.genre}</span>
        </div>
        <div className="spotify-eq" title={isPlaying ? 'Playing audio' : 'Paused'}>
          <span className="eq-bar bar-1" />
          <span className="eq-bar bar-2" />
          <span className="eq-bar bar-3" />
          <span className="eq-bar bar-4" />
        </div>
      </div>

      <div className="spotify-main">
        {/* Spinning Vinyl Record with Real Album Art */}
        <button
          type="button"
          aria-label={isPlaying ? "Pause music" : compact ? "Play music and expand player" : "Play music"}
          aria-expanded={compact ? expanded : undefined}
          className={`vinyl-disc ${isPlaying ? 'spinning' : ''}`}
          title={`${current.title} by ${current.artist}`}
          onClick={handleTogglePlay}
        >
          <svg viewBox="0 0 100 100" className="vinyl-svg" aria-hidden="true">
            <circle cx="50" cy="50" r="48" fill="#121413" stroke="#253229" strokeWidth="1.5" />
            <circle cx="50" cy="50" r="41" fill="none" stroke="#1d2620" strokeWidth="0.8" />
            <circle cx="50" cy="50" r="34" fill="none" stroke="#2a382f" strokeWidth="0.8" />
            <circle cx="50" cy="50" r="27" fill="none" stroke="#1d2620" strokeWidth="0.8" />
            {/* Center Spindle Hole */}
            <circle cx="50" cy="50" r="4" fill="#0d110f" />
          </svg>
          {/* Album Artwork in Vinyl Center */}
          <div className="vinyl-art-wrap">
            <img src={current.art} alt={current.title} className="vinyl-art-img" />
            <span className="vinyl-center-pin" />
          </div>
          <span className="vinyl-sheen" />
        </button>

        {/* Track Info */}
        <div className="spotify-info">
          <a
            href={current.link}
            target="_blank"
            rel="noopener noreferrer"
            className="spotify-title"
            title="Open track on Spotify"
          >
            {current.title}
          </a>
          <span className="spotify-artist">{current.artist}</span>
          <div className="spotify-progress-wrap">
            <div className="spotify-progress-bar">
              <div
                className="spotify-progress-fill"
                style={{ width: `${Math.min(100, (currentTime / (duration || 30)) * 100)}%` }}
              />
            </div>
            <span className="spotify-time">{formatTime(currentTime)}</span>
          </div>
        </div>

        {/* Interactive Controls */}
        <div className="spotify-actions">
          <button
            type="button"
            className="spotify-btn prev-btn"
            onClick={handlePrev}
            aria-label="Previous track"
            title="Previous track"
          >
            <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor">
              <line x1="5" y1="5" x2="5" y2="19" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              <polygon points="19,5 9,12 19,19" />
            </svg>
          </button>
          <button
            type="button"
            className="spotify-btn play-btn"
            onClick={handleTogglePlay}
            aria-label={isPlaying ? 'Pause music' : 'Play music'}
            title={isPlaying ? 'Pause' : 'Play audio preview'}
          >
            {isPlaying ? (
              <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor">
                <rect x="5" y="4" width="4" height="16" rx="1" />
                <rect x="15" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor">
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
            <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5,5 15,12 5,19" />
              <line x1="19" y1="5" x2="19" y2="19" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Playlist Section: HIIT Workout on YouTube Music */}
      <div className="spotify-playlist-section">
        <div className="playlist-section-header">
          <div className="playlist-badge">
            <span className="playlist-badge-dot" />
            <span className="playlist-badge-label">PLAYLIST</span>
          </div>
          <a
            href={PLAYLIST_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="playlist-direct-link"
            title="Open HIIT Workout playlist on YouTube Music"
            aria-label="Open HIIT Workout playlist on YouTube Music"
          >
            <span className="playlist-link-name">{PLAYLIST_NAME}</span>
            <span className="playlist-link-curator">· YouTube Music</span>
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="7" y1="17" x2="17" y2="7" />
              <polyline points="7 7 17 7 17 17" />
            </svg>
          </a>
        </div>

        {/* Quick Pick Track Chips */}
        <div className="spotify-playlist" role="listbox" aria-label="HIIT Workout tracks">
          {TRACKS.slice(0, 4).map((t, idx) => {
            const isCurrent = idx === trackIdx;
            return (
              <button
                key={t.title}
                type="button"
                className={`spotify-track-chip ${isCurrent ? 'active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (isCurrent) {
                    handleTogglePlay(e);
                  } else {
                    setTrackIdx(idx);
                    setIsPlaying(true);
                  }
                }}
                role="option"
                aria-selected={isCurrent}
                title={`Play ${t.title} by ${t.artist}`}
              >
                <span className="track-chip-icon">
                  {isCurrent && isPlaying ? (
                    <svg width="7" height="7" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <rect x="5" y="4" width="4" height="16" rx="1" />
                      <rect x="15" y="4" width="4" height="16" rx="1" />
                    </svg>
                  ) : (
                    <svg width="7" height="7" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <polygon points="6,4 20,12 6,20" />
                    </svg>
                  )}
                </span>
                <span className="track-chip-name">{t.title}</span>
                <span className="track-chip-artist">{t.artist.split('&')[0].trim()}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
