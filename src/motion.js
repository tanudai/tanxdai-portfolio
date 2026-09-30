// Motion bible: every animation uses one of these named presets.
// CSS mirrors them as --ease-* and --dur-* tokens in workspace.css. `npm run audit` enforces both.
export const ease = {
  enter: [0.16, 1, 0.3, 1],   // fast out, soft landing: things arriving
  exit: [0.7, 0, 0.84, 0],    // ease in: things leaving
  hero: [0.65, 0, 0.35, 1],   // strong S-curve: the one big move
};

export const duration = { quick: 0.18, base: 0.3, hero: 0.52 };

export const spring = {
  deck: { type: 'spring', stiffness: 310, damping: 36, mass: 0.9 }, // project deck travel
  ui: { type: 'spring', stiffness: 420, damping: 38 },              // tabs, small surfaces
  sheet: { type: 'spring', stiffness: 330, damping: 32 },           // dialogs and sheets
  page: { type: 'spring', stiffness: 340, damping: 32 },            // service page changes
};

// Constant-rate travel is the one place linear motion is correct.
export const loop = {
  trail: { duration: 7, ease: 'linear', repeat: Infinity },         // border light round the active frame
};

// Physics feel for the draggable blocks on the Personal tab (Matter.js constraint): how firmly the pointer holds a block, and how much that hold is damped.
export const grip = { stiffness: 0.18, damping: 0.12 };
