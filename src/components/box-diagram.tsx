/** The two shipping boxes, drawn to the same scale (2 px per cm) in line art. Sizes are outer, from ground truth/box-framework.md. */
const BOXES = [
  { name: "Primary box", note: "Most designs", w: 112, h: 71, d: 27 },
  { name: "Large box", note: "Designs with longer panels", w: 150, h: 106, d: 16 },
];

const S = 2; // px per cm
const K = 0.55; // oblique depth factor at 30°
const ink = "#17150f";

function Box({ x, base, w, h, d }: { x: number; base: number; w: number; h: number; d: number }) {
  const W = w * S;
  const H = h * S;
  const dx = d * S * K * Math.cos(Math.PI / 6);
  const dy = d * S * K * Math.sin(Math.PI / 6);
  const top = base - H;
  return (
    <g fill="none" stroke={ink} strokeWidth={1.2} strokeLinejoin="round">
      {/* top and side faces, then the front */}
      <path d={`M${x},${top} l${dx},${-dy} h${W} l${-dx},${dy} Z`} fill="#efe9df" />
      <path d={`M${x + W},${top} l${dx},${-dy} v${H} l${-dx},${dy} Z`} fill="#e4dccf" />
      <rect x={x} y={top} width={W} height={H} fill="#f6f1e8" />
      {/* handle */}
      <path d={`M${x + W / 2 - 16},${top} q16,-16 32,0`} strokeWidth={2.4} strokeLinecap="round" />
      {/* wordmark */}
      <text x={x + W / 2} y={top + H / 2 + 4} textAnchor="middle" fill={ink} stroke="none" fontSize={Math.min(13, W / 14)} letterSpacing="0.3em">
        SCREENERY
      </text>
      {/* width */}
      <g stroke={ink} strokeWidth={0.8}>
        <line x1={x} y1={base + 16} x2={x + W} y2={base + 16} markerStart="url(#bd-a)" markerEnd="url(#bd-a)" />
      </g>
      <text x={x + W / 2} y={base + 32} textAnchor="middle" fill={ink} stroke="none" fontSize={12}>{w} cm</text>
      {/* height */}
      <line x1={x - 14} y1={top} x2={x - 14} y2={base} stroke={ink} strokeWidth={0.8} markerStart="url(#bd-a)" markerEnd="url(#bd-a)" />
      <text x={x - 20} y={top + H / 2} textAnchor="middle" fill={ink} stroke="none" fontSize={12} transform={`rotate(-90 ${x - 20} ${top + H / 2})`} dy={-2}>{h} cm</text>
      {/* depth */}
      <text x={x + W + dx / 2 + 6} y={top - dy / 2 - 6} fill={ink} stroke="none" fontSize={12}>{d} cm</text>
    </g>
  );
}

export default function BoxDiagram() {
  const base = 250;
  const xs = [40, 380];
  return (
    <figure>
      <svg viewBox="0 0 740 330" className="h-auto w-full" role="img" aria-label="Shipping boxes to scale: Primary 112 × 71 × 27 cm and Large 150 × 106 × 16 cm">
        <defs>
          <marker id="bd-a" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10" fill="none" stroke={ink} strokeWidth={1.4} />
          </marker>
        </defs>
        {BOXES.map((b, i) => (
          <g key={b.name}>
            <Box x={xs[i]} base={base} {...b} />
            <text x={xs[i]} y={base + 62} fill={ink} fontSize={15} fontFamily="var(--font-display, serif)">{b.name}</text>
            <text x={xs[i]} y={base + 80} fill="#6f5a41" fontSize={10} letterSpacing="0.14em">{b.note.toUpperCase()}</text>
          </g>
        ))}
      </svg>
    </figure>
  );
}
