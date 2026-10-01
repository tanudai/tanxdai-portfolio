import { useState, useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'motion/react';

const TRACKS = [
  {
    title: 'Makeba',
    artist: 'Jain',
    genre: 'WORKOUT HYPE',
    src: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/24/31/34/24313488-9bec-15cd-90c7-79c3297ca5a2/mzaf_772666532216043993.plus.aac.p.m4a',
    art: 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/5a/78/86/5a788626-308e-eb19-80e3-1b3b78ef1fe8/886446194783.jpg/100x100bb.jpg',
    link: 'https://open.spotify.com/search/Jain%20Makeba'
  },
  {
    title: "'Till I Collapse",
    artist: 'Eminem',
    genre: 'HEAVY IRON PR',
    src: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/cf/8f/f1/cf8ff198-b736-395b-6b3f-877048ea5384/mzaf_11538452963444220646.plus.aac.p.m4a',
    art: 'https://is1-ssl.mzstatic.com/image/thumb/Music118/v4/dd/5c/e6/dd5ce621-f7d2-f767-7a08-e7a7eaa7870b/00602537526994.rgb.jpg/100x100bb.jpg',
    link: 'https://open.spotify.com/search/Eminem%20Till%20I%20Collapse'
  },
  {
    title: "Can't Hold Us",
    artist: 'Macklemore & Ryan Lewis',
    genre: 'HIGH ENERGY',
    src: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/83/4d/57/834d57bd-505a-2b6a-3a38-cc26f4d34171/mzaf_18284634626678368772.plus.aac.p.m4a',
    art: 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/91/c1/b5/91c1b5cc-d4f1-da61-d3dc-2dd93e6b0a7d/707541525299.jpg/100x100bb.jpg',
    link: 'https://open.spotify.com/search/Macklemore%20Cant%20Hold%20Us'
  },
  {
    title: 'Stronger',
    artist: 'Kanye West',
    genre: 'GYM MOTIVATION',
    src: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/9e/cc/69/9ecc6918-a8dc-354f-909f-ccc20a0a7a33/mzaf_7863921970418240507.plus.aac.p.m4a',
    art: 'https://is1-ssl.mzstatic.com/image/thumb/Music128/v4/39/25/2d/39252d65-2d50-b991-0962-f7a98a761271/00602517483507.rgb.jpg/100x100bb.jpg',
    link: 'https://open.spotify.com/search/Kanye%20West%20Stronger'
  },
  {
    title: 'INDUSTRY BABY',
    artist: 'Lil Nas X & Jack Harlow',
    genre: 'WORKOUT BEAT',
    src: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/51/97/7a/51977a71-448a-202a-5e60-756d5dcb6eeb/mzaf_194387576127428058.plus.aac.p.m4a',
    art: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/f7/16/67/f7166746-6299-5e54-8c7c-9535e941a53e/886449403929.jpg/100x100bb.jpg',
    link: 'https://open.spotify.com/search/Lil%20Nas%20X%20Industry%20Baby'
  },
  {
    title: 'Midnight City',
    artist: 'M83',
    genre: 'LATE NIGHT RUN',
    src: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/24/09/79/2409794c-3d5d-af26-580e-7dc00ee4f207/mzaf_369629549966021675.plus.aac.p.m4a',
    art: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/cb/7b/a9/cb7ba903-b5f1-cc21-90db-7a81b7aa0997/724596951057.jpg/100x100bb.jpg',
    link: 'https://open.spotify.com/search/M83%20Midnight%20City'
  },
  {
    title: 'Resonance',
    artist: 'HOME',
    genre: 'DEEP FOCUS CHILL',
    src: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/33/bb/1a/33bb1a1a-1448-3118-6891-639e61784145/mzaf_3810752549913623044.plus.aac.p.m4a',
    art: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/4f/13/65/4f1365b0-e97c-c469-c438-2f7d8f204355/872133025584_cover.jpg/100x100bb.jpg',
    link: 'https://open.spotify.com/search/HOME%20Resonance'
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
    <div className={`mini-vinyl-bar ${isPlaying ? 'is-playing' : ''}`}>
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
          <span className="mini-badge-genre">{loading ? 'LOADING AUDIO…' : isPlaying ? 'NOW PLAYING' : current.genre}</span>
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
    <div className={`spotify-card ${isPlaying ? 'is-playing' : ''}`}>
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

      {/* Playlist Quick Pick Grid (Fit without horizontal scroll) */}
      <div className="spotify-playlist" role="listbox" aria-label="Workout and focus tracks">
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
            >
              <span className="track-chip-icon">
                {isCurrent && isPlaying ? (
                  <svg width="7" height="7" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="5" y="4" width="4" height="16" rx="1" />
                    <rect x="15" y="4" width="4" height="16" rx="1" />
                  </svg>
                ) : (
                  <svg width="7" height="7" viewBox="0 0 24 24" fill="currentColor">
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
  );
}
