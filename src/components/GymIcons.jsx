// 3D-Shaded Die-Cut Hybrid Gym Equipment Assets for the Iron & Discipline playground.
// Features realistic specular lighting, cast-iron & chrome textures, embossed weights, and true silhouette contours.

export function Plate20KG() {
  return (
    <svg width="60" height="60" viewBox="0 0 100 100" fill="none" className="gym-asset gym-plate" aria-hidden="true">
      <defs>
        <radialGradient id="plate-rim" cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#3d4942" />
          <stop offset="50%" stopColor="#222b26" />
          <stop offset="100%" stopColor="#111613" />
        </radialGradient>
        <radialGradient id="plate-hub" cx="35%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#e8f3ec" />
          <stop offset="40%" stopColor="#8c9e94" />
          <stop offset="85%" stopColor="#414d46" />
          <stop offset="100%" stopColor="#1e2621" />
        </radialGradient>
        <linearGradient id="plate-flange" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2c3630" />
          <stop offset="100%" stopColor="#141a16" />
        </linearGradient>
        <filter id="plate-shadow" x="-10%" y="-10%" width="125%" height="125%">
          <feDropShadow dx="0" dy="4" stdDeviation="3.5" floodColor="#000" floodOpacity="0.6" />
        </filter>
      </defs>

      {/* Main Outer Rim */}
      <circle cx="50" cy="50" r="47" fill="url(#plate-rim)" filter="url(#plate-shadow)" stroke="#4a5950" strokeWidth="1.2" />
      {/* Outer Lip Bevel */}
      <circle cx="50" cy="50" r="44" stroke="#101512" strokeWidth="1" fill="none" opacity="0.8" />
      <circle cx="50" cy="50" r="43.5" stroke="#5a6b61" strokeWidth="0.6" fill="none" opacity="0.4" />

      {/* Recessed Flange Surface */}
      <circle cx="50" cy="50" r="38" fill="url(#plate-flange)" stroke="#1a221d" strokeWidth="1.5" />

      {/* 3 Grip Openings (Tri-Grip Design) */}
      <g fill="#0e1210" stroke="#36433b" strokeWidth="1">
        <path d="M 36 21 C 45 18 55 18 64 21 C 62 26 58 28 50 28 C 42 28 38 26 36 21 Z" />
        <path d="M 68 39 C 75 46 76 56 71 64 C 66 61 63 56 61 49 C 63 43 66 40 68 39 Z" />
        <path d="M 29 64 C 24 56 25 46 32 39 C 34 40 37 43 39 49 C 37 56 34 61 29 64 Z" />
      </g>

      {/* Inner Lip */}
      <circle cx="50" cy="50" r="23" fill="#1b231e" stroke="#3b4840" strokeWidth="1.2" />

      {/* Embossed Text */}
      <text x="50" y="38" fill="#c3d5cb" fontSize="7.5" fontWeight="900" fontFamily="system-ui, sans-serif" textAnchor="middle" letterSpacing="0.8">20 KG</text>
      <text x="50" y="66" fill="#889c90" fontSize="5.5" fontWeight="700" fontFamily="system-ui, sans-serif" textAnchor="middle" letterSpacing="0.5">OLYMPIC</text>

      {/* Stainless Steel 50mm Olympic Center Ring */}
      <circle cx="50" cy="50" r="14" fill="url(#plate-hub)" stroke="#ffffff" strokeWidth="0.6" strokeOpacity="0.4" />
      <circle cx="50" cy="50" r="8.5" fill="#080b09" stroke="#1a241e" strokeWidth="1.2" />
    </svg>
  );
}

export function HexDumbbell() {
  return (
    <svg width="66" height="34" viewBox="0 0 110 56" fill="none" className="gym-asset gym-db" aria-hidden="true">
      <defs>
        <linearGradient id="db-head-l" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3d4942" />
          <stop offset="45%" stopColor="#252f29" />
          <stop offset="100%" stopColor="#131915" />
        </linearGradient>
        <linearGradient id="db-head-r" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#35403a" />
          <stop offset="55%" stopColor="#202923" />
          <stop offset="100%" stopColor="#0f1411" />
        </linearGradient>
        <linearGradient id="db-bar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e5f0ea" />
          <stop offset="25%" stopColor="#b4c7bc" />
          <stop offset="65%" stopColor="#5d7065" />
          <stop offset="100%" stopColor="#253028" />
        </linearGradient>
        <pattern id="knurl" width="4" height="4" patternUnits="userSpaceOnUse">
          <path d="M0 2 L2 0 L4 2 L2 4 Z" fill="#46574d" opacity="0.6" />
        </pattern>
        <filter id="db-shadow" x="-10%" y="-15%" width="125%" height="135%">
          <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#000" floodOpacity="0.6" />
        </filter>
      </defs>

      <g filter="url(#db-shadow)">
        {/* Steel Knurled Bar */}
        <rect x="26" y="22" width="58" height="12" rx="3" fill="url(#db-bar)" stroke="#1a221d" strokeWidth="1" />
        <rect x="32" y="23" width="46" height="10" fill="url(#knurl)" opacity="0.8" />
        <rect x="52" y="21.5" width="6" height="13" rx="1.5" fill="#e5f0ea" opacity="0.5" />

        {/* Left Hex Head */}
        <polygon points="5,16 20,4 32,14 32,42 20,52 5,40" fill="url(#db-head-l)" stroke="#516358" strokeWidth="1.2" />
        <polygon points="5,16 20,4 32,14 20,24" fill="#4c5c52" opacity="0.5" />
        {/* Embossed Weight on Left */}
        <text x="18" y="32" fill="#c3d5cb" fontSize="10" fontWeight="900" fontFamily="system-ui, sans-serif" textAnchor="middle">50</text>

        {/* Right Hex Head */}
        <polygon points="78,14 90,4 105,16 105,40 90,52 78,42" fill="url(#db-head-r)" stroke="#516358" strokeWidth="1.2" />
        <polygon points="78,14 90,4 105,16 90,24" fill="#45544b" opacity="0.4" />
        {/* Embossed Weight on Right */}
        <text x="92" y="32" fill="#c3d5cb" fontSize="10" fontWeight="900" fontFamily="system-ui, sans-serif" textAnchor="middle">50</text>
      </g>
    </svg>
  );
}

export function Kettlebell24KG() {
  return (
    <svg width="48" height="58" viewBox="0 0 80 96" fill="none" className="gym-asset gym-kb" aria-hidden="true">
      <defs>
        <radialGradient id="kb-bell" cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#3d4942" />
          <stop offset="50%" stopColor="#242e28" />
          <stop offset="100%" stopColor="#101512" />
        </radialGradient>
        <linearGradient id="kb-handle" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#9cb3a6" />
          <stop offset="40%" stopColor="#55695e" />
          <stop offset="85%" stopColor="#27332b" />
          <stop offset="100%" stopColor="#151c17" />
        </linearGradient>
        <filter id="kb-shadow" x="-15%" y="-10%" width="135%" height="125%">
          <feDropShadow dx="0" dy="4" stdDeviation="3.5" floodColor="#000" floodOpacity="0.65" />
        </filter>
      </defs>

      <g filter="url(#kb-shadow)">
        {/* Curved Steel Handle */}
        <path d="M 23 44 C 23 16 30 8 40 8 C 50 8 57 16 57 44" fill="none" stroke="url(#kb-handle)" strokeWidth="9" strokeLinecap="round" />
        {/* Inner handle cutout */}
        <path d="M 27 44 C 27 22 32 16 40 16 C 48 16 53 22 53 44" fill="none" stroke="#0e1310" strokeWidth="2.5" opacity="0.7" />

        {/* Spherical Cast Iron Bell Body */}
        <circle cx="40" cy="58" r="33" fill="url(#kb-bell)" stroke="#4a5a50" strokeWidth="1.4" />
        {/* Flattened Base Bottom */}
        <path d="M 24 88 C 34 91 46 91 56 88 L 54 85 C 45 87 35 87 26 85 Z" fill="#141a16" />

        {/* Specular Rim Light */}
        <path d="M 18 42 C 28 34 46 34 58 42" stroke="#667b6f" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" fill="none" />

        {/* Embossed 24 KG Badge */}
        <circle cx="40" cy="58" r="15" fill="#1b231e" stroke="#334037" strokeWidth="1.2" />
        <text x="40" y="56" fill="#c3d5cb" fontSize="9.5" fontWeight="900" fontFamily="system-ui, sans-serif" textAnchor="middle">24</text>
        <text x="40" y="66" fill="#889c90" fontSize="5" fontWeight="700" fontFamily="system-ui, sans-serif" textAnchor="middle" letterSpacing="0.6">KG</text>
      </g>
    </svg>
  );
}

export function ShakerBottle() {
  return (
    <svg width="34" height="60" viewBox="0 0 54 96" fill="none" className="gym-asset gym-shaker" aria-hidden="true">
      <defs>
        <linearGradient id="shaker-body" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#35423a" />
          <stop offset="35%" stopColor="#202923" />
          <stop offset="70%" stopColor="#151b17" />
          <stop offset="100%" stopColor="#0b0e0c" />
        </linearGradient>
        <linearGradient id="shaker-lid" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1db954" />
          <stop offset="70%" stopColor="#126b32" />
          <stop offset="100%" stopColor="#083819" />
        </linearGradient>
        <filter id="shaker-shadow" x="-15%" y="-10%" width="135%" height="125%">
          <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#000" floodOpacity="0.55" />
        </filter>
      </defs>

      <g filter="url(#shaker-shadow)">
        {/* Flip Cap & Loop */}
        <path d="M 18 10 C 18 5 24 2 30 2 C 36 2 39 5 39 10" fill="url(#shaker-lid)" stroke="#39e373" strokeWidth="0.8" />
        <rect x="23" y="2" width="10" height="5" rx="2" fill="#39e373" opacity="0.6" />

        {/* Screw-on Main Lid */}
        <rect x="10" y="10" width="34" height="12" rx="3" fill="#18241c" stroke="#3b5243" strokeWidth="1.2" />
        <rect x="13" y="13" width="28" height="2" fill="#2d3d33" />
        <circle cx="34" cy="16" r="3.5" fill="url(#shaker-lid)" />

        {/* Ergonomic Tapered Bottle Body */}
        <path d="M 12 22 L 15 88 C 15 91 18 93 22 93 L 32 93 C 36 93 39 91 39 88 L 42 22 Z" fill="url(#shaker-body)" stroke="#45574c" strokeWidth="1.2" />

        {/* Translucent Window with Measurement Hash Marks */}
        <rect x="24" y="32" width="6" height="46" rx="2" fill="#1db954" opacity="0.18" />
        <line x1="22" y1="40" x2="26" y2="40" stroke="#719480" strokeWidth="1" />
        <line x1="22" y1="52" x2="27" y2="52" stroke="#719480" strokeWidth="1.2" />
        <line x1="22" y1="64" x2="26" y2="64" stroke="#719480" strokeWidth="1" />
        <line x1="22" y1="76" x2="27" y2="76" stroke="#719480" strokeWidth="1.2" />

        {/* Brand Text */}
        <text x="27" y="58" fill="#a4c2b0" fontSize="5" fontWeight="800" fontFamily="system-ui, sans-serif" transform="rotate(-90 27 58)" textAnchor="middle" letterSpacing="0.8">PRO-BLEND</text>
      </g>
    </svg>
  );
}

export function SteelFlask() {
  return (
    <svg width="34" height="56" viewBox="0 0 54 90" fill="none" className="gym-asset gym-flask" aria-hidden="true">
      <defs>
        <linearGradient id="flask-body" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#3d4a42" />
          <stop offset="30%" stopColor="#252f2a" />
          <stop offset="70%" stopColor="#141a17" />
          <stop offset="100%" stopColor="#0b0e0c" />
        </linearGradient>
        <linearGradient id="flask-cap" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#cad8d0" />
          <stop offset="60%" stopColor="#67786f" />
          <stop offset="100%" stopColor="#2b3630" />
        </linearGradient>
        <filter id="flask-shadow" x="-15%" y="-10%" width="135%" height="125%">
          <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#000" floodOpacity="0.55" />
        </filter>
      </defs>

      <g filter="url(#flask-shadow)">
        {/* Paracord Steel Handle Loop */}
        <path d="M 21 14 C 21 4 33 4 33 14" fill="none" stroke="#2e3a33" strokeWidth="4.5" strokeLinecap="round" />
        <path d="M 21 14 C 21 5 33 5 33 14" fill="none" stroke="#ffaa71" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />

        {/* Stainless Steel Cap */}
        <rect x="18" y="14" width="18" height="9" rx="2" fill="url(#flask-cap)" stroke="#1a221d" strokeWidth="1" />
        <rect x="20" y="16" width="14" height="1.5" fill="#e5f0ea" opacity="0.6" />

        {/* Flask Neck */}
        <rect x="16" y="23" width="22" height="4" fill="#1b241e" />

        {/* Cylindrical Insulated Body */}
        <rect x="11" y="27" width="32" height="58" rx="5" fill="url(#flask-body)" stroke="#4c5d53" strokeWidth="1.2" />

        {/* Heavy Silicone Base Boot */}
        <path d="M 11 74 L 11 80 C 11 83 14 85 17 85 L 37 85 C 40 85 43 83 43 80 L 43 74 Z" fill="#111613" stroke="#253229" strokeWidth="1" />

        {/* Specular Highlight Streak */}
        <line x1="16" y1="30" x2="16" y2="72" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" opacity="0.25" />
        <text x="27" y="55" fill="#889e91" fontSize="4.5" fontWeight="800" fontFamily="system-ui, sans-serif" transform="rotate(-90 27 55)" textAnchor="middle" letterSpacing="1">HYDRO 32oz</text>
      </g>
    </svg>
  );
}

export function HeavyGripper() {
  return (
    <svg width="44" height="50" viewBox="0 0 74 84" fill="none" className="gym-asset gym-gripper" aria-hidden="true">
      <defs>
        <linearGradient id="spring-metal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e5f0ea" />
          <stop offset="35%" stopColor="#7a8f83" />
          <stop offset="70%" stopColor="#3d4a43" />
          <stop offset="100%" stopColor="#151b17" />
        </linearGradient>
        <linearGradient id="gripper-handle" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffb07a" />
          <stop offset="50%" stopColor="#ba6838" />
          <stop offset="100%" stopColor="#54280f" />
        </linearGradient>
        <pattern id="knurl-fine" width="3" height="3" patternUnits="userSpaceOnUse">
          <path d="M0 1.5 L1.5 0 L3 1.5 L1.5 3 Z" fill="#2d1508" opacity="0.5" />
        </pattern>
        <filter id="grip-shadow" x="-15%" y="-10%" width="135%" height="125%">
          <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#000" floodOpacity="0.6" />
        </filter>
      </defs>

      <g filter="url(#grip-shadow)">
        {/* Coiled High-Tensile Steel Torsion Spring */}
        <circle cx="37" cy="20" r="14" stroke="url(#spring-metal)" strokeWidth="6" fill="#101512" />
        <circle cx="37" cy="20" r="10" stroke="#151c17" strokeWidth="2" fill="none" />
        <circle cx="37" cy="20" r="4" fill="#090d0b" />

        {/* Left Knurled Anodized Handle */}
        <g transform="rotate(16 37 20)">
          <rect x="18" y="32" width="12" height="46" rx="3" fill="url(#gripper-handle)" stroke="#ffb07a" strokeWidth="0.8" />
          <rect x="18" y="36" width="12" height="38" fill="url(#knurl-fine)" />
          <text x="24" y="60" fill="#ffe2cf" fontSize="4.5" fontWeight="900" fontFamily="system-ui, sans-serif" transform="rotate(-90 24 60)" textAnchor="middle">200 LBS</text>
        </g>

        {/* Right Knurled Anodized Handle */}
        <g transform="rotate(-16 37 20)">
          <rect x="44" y="32" width="12" height="46" rx="3" fill="url(#gripper-handle)" stroke="#ffb07a" strokeWidth="0.8" />
          <rect x="44" y="36" width="12" height="38" fill="url(#knurl-fine)" />
          <text x="50" y="60" fill="#ffe2cf" fontSize="4.5" fontWeight="900" fontFamily="system-ui, sans-serif" transform="rotate(-90 50 60)" textAnchor="middle">TITAN</text>
        </g>
      </g>
    </svg>
  );
}

export function OlympicClamp() {
  return (
    <svg width="42" height="42" viewBox="0 0 70 70" fill="none" className="gym-asset gym-clamp" aria-hidden="true">
      <defs>
        <radialGradient id="clamp-body" cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#3d4942" />
          <stop offset="50%" stopColor="#222b26" />
          <stop offset="100%" stopColor="#111613" />
        </radialGradient>
        <linearGradient id="clamp-lever" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ff5555" />
          <stop offset="50%" stopColor="#c72525" />
          <stop offset="100%" stopColor="#690a0a" />
        </linearGradient>
        <filter id="clamp-shadow" x="-15%" y="-15%" width="135%" height="135%">
          <feDropShadow dx="0" dy="3.5" stdDeviation="2.5" floodColor="#000" floodOpacity="0.6" />
        </filter>
      </defs>

      <g filter="url(#clamp-shadow)">
        {/* Outer Hex/Octagonal Collar Ring */}
        <polygon points="22,6 48,6 64,22 64,48 48,64 22,64 6,48 6,22" fill="url(#clamp-body)" stroke="#4a5950" strokeWidth="1.5" />

        {/* Rubber Inner Grip Ring */}
        <circle cx="35" cy="35" r="20" fill="#131815" stroke="#2a362f" strokeWidth="1.5" />
        <circle cx="35" cy="35" r="13" fill="#080b09" stroke="#ffaa71" strokeWidth="0.8" opacity="0.5" />

        {/* Quick-Release Cam Lever Latch (Red Accent) */}
        <path d="M 44 8 C 54 4 62 10 60 20 L 52 24 Z" fill="url(#clamp-lever)" stroke="#ff7777" strokeWidth="0.8" />
        <circle cx="48" cy="18" r="2.5" fill="#e8f3ec" />
      </g>
    </svg>
  );
}

export function ChalkBlock() {
  return (
    <svg width="42" height="34" viewBox="0 0 70 56" fill="none" className="gym-asset gym-chalk" aria-hidden="true">
      <defs>
        <linearGradient id="chalk-top" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="50%" stopColor="#e8ece9" />
          <stop offset="100%" stopColor="#c5cdc8" />
        </linearGradient>
        <linearGradient id="chalk-side" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#b4beb8" />
          <stop offset="100%" stopColor="#75827b" />
        </linearGradient>
        <filter id="chalk-shadow" x="-15%" y="-15%" width="135%" height="135%">
          <feDropShadow dx="0" dy="3.5" stdDeviation="2.5" floodColor="#000" floodOpacity="0.5" />
        </filter>
      </defs>

      <g filter="url(#chalk-shadow)">
        {/* 3D Isometric Chalk Cube */}
        <polygon points="12,16 35,6 58,16 35,26" fill="url(#chalk-top)" stroke="#e8ece9" strokeWidth="0.8" />
        <polygon points="12,16 35,26 35,50 12,40" fill="url(#chalk-side)" stroke="#67736c" strokeWidth="0.8" />
        <polygon points="35,26 58,16 58,40 35,50" fill="#95a19a" stroke="#67736c" strokeWidth="0.8" />

        {/* Indented Cross Brand Stamp on Top Face */}
        <path d="M 33 13 L 37 13 L 37 19 L 33 19 Z M 30 15 L 40 15 L 40 17 L 30 17 Z" fill="#98a39d" opacity="0.6" />
      </g>
    </svg>
  );
}
