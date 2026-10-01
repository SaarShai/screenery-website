/**
 * The two carry boxes, drawn to the same scale with the original box line art
 * (public/images/model diagrams/box-art.png, cut from diagrams-box.png).
 * Sizes are outer, from ground truth/box-framework.md.
 */
const BOXES = [
  { name: "Primary box", note: "Most designs", w: 112, h: 71, d: 27 },
  { name: "Large box", note: "Designs with longer panels", w: 150, h: 106, d: 16 },
];

const K = 2.2; // px per cm across the box face
const ink = "#17150f";
const font = "Helvetica Neue, Helvetica, Arial, sans-serif";

function Box({ x, base, w, h }: { x: number; base: number; w: number; h: number }) {
  const W = w * K;
  const H = h * K * 1.142; // the art's 700 × 565 px frame holds a 150 × 106 cm face at its own proportions
  const top = base - H;
  return (
    <g>
      <image href="/images/model diagrams/box-art.png" x={x} y={top} width={W} height={H} preserveAspectRatio="none" />
      <g stroke={ink} strokeWidth={0.9}>
        <line x1={x + 4} y1={top - 14} x2={x + W - 4} y2={top - 14} markerStart="url(#bd-a)" markerEnd="url(#bd-a)" />
        <line x1={x + W + 14} y1={top + 4} x2={x + W + 14} y2={base - 4} markerStart="url(#bd-a)" markerEnd="url(#bd-a)" />
        <line x1={x + W + 8} y1={top + 4} x2={x + W + 20} y2={top + 4} />
        <line x1={x + W + 8} y1={base - 4} x2={x + W + 20} y2={base - 4} />
      </g>
      <text x={x + W / 2} y={top - 22} textAnchor="middle" fill={ink} fontSize={15} fontFamily={font}>{w}cm</text>
      <text x={x + W + 24} y={top + H / 2 + 5} fill={ink} fontSize={15} fontFamily={font}>{h}cm</text>
    </g>
  );
}

export default function BoxDiagram() {
  const base = 300;
  const xs = [10, 330];
  return (
    <svg viewBox="0 0 740 360" className="h-auto w-full" role="img" aria-label="Carry boxes to scale: Primary 112 × 71 × 27 cm and Large 150 × 106 × 16 cm">
      <defs>
        <marker id="bd-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,1 L10,5 L0,9" fill="none" stroke={ink} strokeWidth={1.2} />
        </marker>
      </defs>
      {BOXES.map((b, i) => (
        <g key={b.name}>
          <Box x={xs[i]} base={base} {...b} />
          <text x={xs[i]} y={base + 30} fill={ink} fontSize={15} fontFamily="var(--font-display, serif)">
            {b.name} <tspan fill="#5b574f" fontFamily={font} fontSize={12}>· {b.w} × {b.h} × {b.d} cm</tspan>
          </text>
          <text x={xs[i]} y={base + 48} fill="#6f5a41" fontSize={10} letterSpacing="0.14em" fontFamily={font}>{b.note.toUpperCase()}</text>
        </g>
      ))}
    </svg>
  );
}
