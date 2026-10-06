import type { CSSProperties } from "react";

const panels = [
  <polygon key={0} points="182.42 488.48 22.79 453.46 22.79 103.23 182.42 138.25 182.42 488.48" />,
  <path key={1} d="M162.34,103.9v350.23l47.17-10.35v-178.98c-.3-14.68,14-30.21,31.96-34.69,17.96-4.48,32.77,3.8,33.09,18.48v180.92l47.4-10.4V68.88l-159.62,35.02Z" />,
  <polygon key={2} points="460.61 481.94 300.99 446.92 300.99 96.69 460.61 131.72 460.61 481.94" />,
  <path key={3} d="M440.46,111.79v350.23l159.62-35.02V76.77l-159.62,35.02ZM559.88,237.64l-66.61,17.51v-58.39c-.31-15.04,14.34-30.94,32.73-35.52,18.39-4.58,33.56,3.89,33.88,18.93v57.48Z" />,
];
const fills = ["#2eb3a4", "#ed686a", "#fdc424", "#42afe4"] as const;

/** Blend the moving panels; their intersection colors vanish when the panels separate. */
export default function LogoPanels({ panelClassName }: { panelClassName?: string }) {
  return (
    <g style={{ isolation: "isolate" }}>
      {panels.map((shape, i) => (
        <g
          key={i}
          className={panelClassName}
          data-panel={i}
          fill={fills[i]}
          style={{ "--i": i, mixBlendMode: "multiply" } as CSSProperties}
        >
          {shape}
        </g>
      ))}
    </g>
  );
}
