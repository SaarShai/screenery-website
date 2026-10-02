// Design registry for the exporter. Owner-authored fields (kinds, extras, logo slots) grow here.
// Geometry comes from catalog-all `<id>-opened.json` (closed pose is recovered from the hinge data).
const has = (s, ...words) => words.some((w) => s.toLowerCase().includes(w));

function classify(partId, name) {
  const s = `${partId} ${name ?? ''}`;
  if (has(s, 'stabilizer', 'connector')) return { kind: 'support' };
  if (has(s, 'topper')) return { kind: 'topper' };
  if (has(s, 'free-standing', 'horse extra', 'extra ')) return { kind: 'extra' };
  return { kind: 'wall' };
}

export const DESIGNS = {
  birthday: {
    order: 1, name: 'Birthday', palette: 'birthday', classify,
    extras: [
      { id: 'toppers', label: 'Star toppers', match: (p) => p.startsWith('topper-star'), default_on: true },
      { id: 'stars', label: 'Free-standing stars', match: (p) => p.startsWith('free-standing-star'), default_on: true },
    ],
    // Chain joints (kit part ids). Each side: the movable unit, the joint's flap node, which panel the
    // flap extends from (donor) and which panel's back-ply sockets receive it (receiver). The exporter
    // seats the joint (flap coplanar with the receiver's back ply, socket tips one gap from the flap
    // root), folds layouts about the flap root, and repeats the unit through the same joint.
    chain: {
      max_extra: 2,
      left: { unit: ['narrow-left-bottom', 'narrow-left-top', 'tall-stabilizer-03', 'topper-star-02'], flap: 'door-right-flap', donor: 'door-right', receiver: 'narrow-left-bottom' },
      right: { unit: ['narrow-right-bottom', 'narrow-right-top', 'tall-stabilizer-04', 'topper-star-03'], flap: 'narrow-right-bottom-flap', donor: 'narrow-right-bottom', receiver: 'door-left' },
    },
  },
  police: {
    order: 2, name: 'Police Station', palette: 'police', classify,
    imageRoot: '../catalog-render-pilot',
    extras: [{ id: 'toppers', label: 'Toppers', match: (p) => p.startsWith('extra topper'), default_on: true }],
  },
  'fire-station': {
    order: 3, name: 'Fire Station', palette: 'fire-station', classify,
    extras: [{ id: 'toppers', label: 'Toppers', match: (p) => p.startsWith('extra topper'), default_on: true }],
  },
  princess: {
    order: 4, name: 'Princess Palace', palette: 'princess',
    // P-ids without a readable name: P006/P009 stabilizers, P017 topper (catalog-all report 2026-09-10)
    classify: (p, name) => (['P006', 'P009'].includes(p) ? { kind: 'support' } : p === 'P017' ? { kind: 'topper' } : classify(p, name)),
    extras: [
      { id: 'topper', label: 'Topper', match: (p) => p === 'P017', default_on: true },
      { id: 'horse', label: 'Horse', match: (p, name) => has(name ?? '', 'horse'), default_on: true },
    ],
    chain: {
      max_extra: 2,
      left: { unit: ['p003', 'p011', 'p007'], flap: 'p004-flap', donor: 'p004', receiver: 'p003' },
      // P002's upper added socket would merge into its window opening.
      // Right repeats remain unavailable; see princess/right-side-unavailable.json.
    },
  },
  space: {
    order: 5, name: 'Spaceship', palette: 'space', classify, extras: [],
    chain: {
      max_extra: 2,
      left: { unit: ['narrow-1-bottom', 'narrow-1-top', 'connector-1'], flap: 'narrow-1-bottom-flap', donor: 'narrow-1-bottom', receiver: 'door-left' },
      right: { unit: ['narrow-2-bottom', 'narrow-2-top', 'connector-4'], flap: 'door-right-flap', donor: 'door-right', receiver: 'narrow-2-bottom' },
    },
  },
};

// catalog-all layout ids → kit layout ids; anything else is skipped
export const LAYOUT_IDS = { straight: 'Straight', '135-forward': 'Concave', '135-backward': 'Convex', concertina: 'Concertina' };
