import LogoPanels from "./logo-panels";
import s from "./folding-screen-mark.module.css";

export default function FoldingScreenMark({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 55 623 450" className={`${s.mark} ${className}`}>
      <LogoPanels panelClassName={s.panel} />
    </svg>
  );
}
