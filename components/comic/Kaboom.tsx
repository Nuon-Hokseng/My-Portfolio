import type { CSSProperties } from "react";

// Small comic explosion sticker. With `pop`, it pops in once after `delay`
// seconds (reduced-motion users get the settled state immediately).
export function Kaboom({
  text = "BOOM!",
  rotate = -8,
  pop = false,
  delay = 0,
  className = "",
}: {
  text?: string;
  rotate?: number;
  pop?: boolean;
  delay?: number;
  className?: string;
}) {
  const style = { "--r": `${rotate}deg`, "--delay": `${delay}s` } as CSSProperties;
  return (
    <div className={`kaboom ${pop ? "kaboom-pop" : ""} ${className}`} style={style} aria-hidden="true">
      <b />
      <i />
      <span>{text}</span>
    </div>
  );
}
