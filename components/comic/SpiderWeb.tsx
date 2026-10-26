// Quarter spiderweb anchored at the SVG's top-left corner: radial threads
// plus rings that sag toward the centre. Flip it with a transform to sit
// in other corners.
const ANGLES = [0, 11.25, 22.5, 33.75, 45, 56.25, 67.5, 78.75, 90].map((d) => (d * Math.PI) / 180);
const RINGS = [44, 96, 158, 232, 318, 410];

const pt = (r: number, a: number) => `${(Math.cos(a) * r).toFixed(1)} ${(Math.sin(a) * r).toFixed(1)}`;

const WEB_PATH = [
  ...ANGLES.map((a) => `M0 0L${pt(420, a)}`),
  ...RINGS.flatMap((r) =>
    ANGLES.slice(0, -1).map((a, i) => {
      const b = ANGLES[i + 1];
      return `M${pt(r, a)}Q${pt(r * 0.86, (a + b) / 2)} ${pt(r, b)}`;
    }),
  ),
].join("");

export function SpiderWeb({ className = "" }: { className?: string }) {
  return (
    <svg className={`web-corner ${className}`} viewBox="0 0 380 380" aria-hidden="true">
      <path d={WEB_PATH} />
    </svg>
  );
}
