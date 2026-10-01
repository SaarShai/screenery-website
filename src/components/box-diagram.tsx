/**
 * The two carry boxes to one scale, in the line style of the original box drawing
 * (public/images/model diagrams/diagrams-box.png). Each box is drawn from its own
 * width, height and depth, so proportions are true; the logo and icons are cut from
 * the original drawing and never stretched. Sizes are outer, from ground truth/box-framework.md.
 */
const BOXES = [
  { name: "Primary box", note: "Most designs", w: 112, h: 71, d: 27 },
  { name: "Large box", note: "Designs with longer panels", w: 150, h: 106, d: 16 },
];

const K = 2.0; // px per cm
const ink = "#17150f";
const font = "Helvetica Neue, Helvetica, Arial, sans-serif";

type P = [number, number];

// Confetti from the original box: kind and position as a fraction of the face.
const CONFETTI: [string, number, number][] = [
  ["n", 0.07, 0.12], ["t", 0.22, 0.1], ["o", 0.33, 0.16], ["t", 0.48, 0.18], ["t", 0.7, 0.15],
  ["d", 0.12, 0.33], ["n", 0.22, 0.33], ["m", 0.55, 0.36], ["n", 0.75, 0.38], ["t", 0.88, 0.34],
  ["t", 0.08, 0.5], ["d", 0.84, 0.6], ["n", 0.92, 0.63], ["o", 0.06, 0.7], ["n", 0.28, 0.82],
  ["t", 0.11, 0.86], ["d", 0.38, 0.78], ["t", 0.52, 0.8], ["n", 0.66, 0.9], ["o", 0.58, 0.95], ["d", 0.88, 0.85],
];

function glyph(kind: string, [x, y]: P, s: number) {
  switch (kind) {
    case "t":
      return <path d={`M${x - s},${y + s} L${x},${y - s} L${x + s},${y + s} Z`} />;
    case "o":
      return <path d={`M${x},${y - s} C${x + s},${y} ${x + s * 0.6},${y + s} ${x},${y + s} C${x - s * 0.6},${y + s} ${x - s},${y} ${x},${y - s} Z`} />;
    case "d":
      return <path d={`M${x - s * 0.7},${y - s} V${y + s} C${x + s * 1.2},${y + s} ${x + s * 1.2},${y - s} ${x - s * 0.7},${y - s} Z`} />;
    case "m":
      return <path d={`M${x - s},${y + s} L${x - s * 0.5},${y - s} L${x},${y} L${x + s * 0.5},${y - s} L${x + s},${y + s} Z`} />;
    default:
      return <path d={`M${x - s},${y - s * 0.6} h${s * 0.7} v${s * 1.2} h${s * 0.6} v${-s * 1.6} h${s * 0.7} v${s * 2} h${-s * 2} Z`} />;
  }
}

function Box({ x, base, w, h, d }: { x: number; base: number; w: number; h: number; d: number }) {
  const W = w * K;
  const H = h * K;
  // Gentle perspective, as in the original: the right end is nearer, so taller.
  const TL: P = [x, base - H - 0.08 * W];
  const TR: P = [x + W, TL[1] + 0.03 * W];
  const BL: P = [x + 0.025 * W, TL[1] + H];
  const BR: P = [x + 0.975 * W, base];
  const o: P = [d * K * 0.75, -d * K * 0.32]; // depth runs back and up
  const add = (a: P, b: P): P => [a[0] + b[0], a[1] + b[1]];
  const pt = (u: number, v: number): P => [
    (1 - v) * ((1 - u) * TL[0] + u * TR[0]) + v * ((1 - u) * BL[0] + u * BR[0]),
    (1 - v) * ((1 - u) * TL[1] + u * TR[1]) + v * ((1 - u) * BL[1] + u * BR[1]),
  ];
  const poly = (ps: P[]) => ps.map((p) => p.join(",")).join(" ");
  const ux: P = [TR[0] - TL[0], TR[1] - TL[1]];
  const vy: P = [BL[0] - TL[0], BL[1] - TL[1]];
  // Place a cut-out image on the face without stretching it: width as a fraction of the face width.
  const place = (u: number, v: number, du: number, iw: number) => {
    const [px, py] = pt(u, v);
    const sx = (du * Math.hypot(...ux)) / iw;
    const a = ux[0] / Math.hypot(...ux);
    const b = ux[1] / Math.hypot(...ux);
    return `matrix(${a * sx},${b * sx},${(vy[0] / Math.hypot(...vy)) * sx},${(vy[1] / Math.hypot(...vy)) * sx},${px},${py})`;
  };
  const handleAt = add(pt(0.5, 0), [o[0] / 2, o[1] / 2]);
  const top = Math.min(TL[1] + o[1], TR[1] + o[1]);

  return (
    <g>
      <g fill="#fff" stroke={ink} strokeWidth={1.1} strokeLinejoin="round">
        <polygon points={poly([TL, add(TL, o), add(TR, o), TR])} />
        <polygon points={poly([TR, add(TR, o), add(BR, o), BR])} />
        <polygon points={poly([TL, TR, BR, BL])} />
      </g>
      {/* handle */}
      <path d={`M${handleAt[0] - 18},${handleAt[1]} C${handleAt[0] - 16},${handleAt[1] - 20} ${handleAt[0] + 16},${handleAt[1] - 20} ${handleAt[0] + 18},${handleAt[1]}`} fill="none" stroke={ink} strokeWidth={4} strokeLinecap="round" />
      <path d={`M${handleAt[0] - 18},${handleAt[1]} C${handleAt[0] - 16},${handleAt[1] - 20} ${handleAt[0] + 16},${handleAt[1] - 20} ${handleAt[0] + 18},${handleAt[1]}`} fill="none" stroke="#fff" strokeWidth={1.6} strokeLinecap="round" />
      {/* slots along the side */}
      {[0.25, 0.5, 0.75].map((v) => {
        const [sx, sy] = add(pt(1, v), [o[0] / 2, o[1] / 2]);
        return <ellipse key={v} cx={sx} cy={sy} rx={0.9} ry={3} fill="none" stroke={ink} strokeWidth={0.8} />;
      })}
      <g fill="none" stroke={ink} strokeWidth={0.8} strokeLinejoin="round">
        {CONFETTI.map(([k, u, v], i) => (
          <g key={i}>{glyph(k, pt(u, v), Math.max(2.4, W / 150))}</g>
        ))}
      </g>
      <image href="/images/model diagrams/box-logo.png" width={342} height={103} transform={place(0.24, 0.42, 0.5, 342)} />
      <image href="/images/model diagrams/box-icons.png" width={62} height={35} transform={place(0.06, 0.8, 0.09, 62)} />

      {/* measurements, as on the original */}
      <g stroke={ink} strokeWidth={0.9}>
        <line x1={TL[0]} y1={top - 16} x2={TR[0] + o[0]} y2={top - 16} markerStart="url(#bd-a)" markerEnd="url(#bd-a)" />
        <line x1={BR[0] + o[0] + 16} y1={TR[1] + o[1]} x2={BR[0] + o[0] + 16} y2={BR[1]} markerStart="url(#bd-a)" markerEnd="url(#bd-a)" />
      </g>
      <text x={(TL[0] + TR[0] + o[0]) / 2} y={top - 24} textAnchor="middle" fill={ink} fontSize={15} fontFamily={font}>{w}cm</text>
      <text x={BR[0] + o[0] + 24} y={(TR[1] + BR[1]) / 2 + 5} fill={ink} fontSize={15} fontFamily={font}>{h}cm</text>
    </g>
  );
}

export default function BoxDiagram() {
  const base = 330;
  const xs = [8, 356];
  return (
    <svg viewBox="0 0 760 400" className="h-auto w-full" role="img" aria-label="Carry boxes to scale: Primary 112 × 71 × 27 cm and Large 150 × 106 × 16 cm">
      <defs>
        <marker id="bd-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,1 L10,5 L0,9" fill="none" stroke={ink} strokeWidth={1.2} />
        </marker>
      </defs>
      {BOXES.map((b, i) => (
        <g key={b.name}>
          <Box x={xs[i]} base={base} {...b} />
          <text x={xs[i]} y={base + 34} fill={ink} fontSize={15} fontFamily="var(--font-display, serif)">
            {b.name} <tspan fill="#5b574f" fontFamily={font} fontSize={12}>· {b.w} × {b.h} × {b.d} cm</tspan>
          </text>
          <text x={xs[i]} y={base + 52} fill="#6f5a41" fontSize={10} letterSpacing="0.14em" fontFamily={font}>{b.note.toUpperCase()}</text>
        </g>
      ))}
    </svg>
  );
}
