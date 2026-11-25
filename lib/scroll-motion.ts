/** One motion vocabulary, with a different composition for each section. */
export const motionGroups = [
  { selector: "#about .section-head", effect: "heading" },
  { selector: "#about .stats > div", effect: "stat" },
  { selector: "#skills .section-head", effect: "left" },
  { selector: "#skills .skill-card", effect: "fan" },
  { selector: "#experience .section-head", effect: "heading" },
  { selector: "#experience .experience-photos", effect: "left" },
  { selector: "#experience .experience-copy", effect: "right" },
  { selector: "#journey .section-head", effect: "right" },
  { selector: "#journey .timeline > li", effect: "timeline" },
  { selector: "#journey .education-photo", effect: "photo" },
  { selector: "#gallery .section-head", effect: "heading" },
  { selector: "#gallery .filter-bar", effect: "quiet" },
  { selector: "#gallery .project-card", effect: "project" },
  { selector: "#gallery .volunteer-layout > .photo-viewer", effect: "photo" },
  { selector: "#gallery .volunteer-copy", effect: "right" },
  { selector: "#gallery .work-photo.teaching", effect: "left" },
  { selector: "#gallery .work-photo.volunteer", effect: "zoom" },
  { selector: "#gallery .private-work", effect: "quiet" },
  { selector: "#certificates .section-head", effect: "zoom" },
  { selector: "#certificates .photo-viewer", effect: "award" },
  { selector: "#certificates .achievement-copy", effect: "right" },
  { selector: "#extras > div:first-child", effect: "heading" },
  { selector: "#extras .extra-options > details", effect: "quiet" },
  { selector: "#contact .contact-grid > div:first-child", effect: "contact" },
  { selector: "#contact .contact-details", effect: "right" },
  { selector: "#contact .footer", effect: "quiet" },
] as const;

export type MotionEffect = (typeof motionGroups)[number]["effect"];

export function entranceFrames(
  effect: MotionEffect,
  compact: boolean,
  index: number,
): Keyframe[] {
  const distance = compact ? 0.65 : 1;
  let transform: string;
  switch (effect) {
    case "heading":
      transform = `translateY(${32 * distance}px)`;
      break;
    case "stat":
      transform = `translateY(${40 * distance}px) scale(.94)`;
      break;
    case "left":
      transform = `translateX(${-44 * distance}px)`;
      break;
    case "right":
      transform = `translateX(${44 * distance}px)`;
      break;
    case "fan":
      transform = `translateY(${64 * distance}px) rotate(${(index - 1) * (compact ? 1 : 2)}deg) scale(.95)`;
      break;
    case "timeline":
      transform = `translateX(${-28 * distance}px)`;
      break;
    case "photo":
      transform = `translateY(${28 * distance}px) scale(${compact ? 1.025 : 1.055})`;
      break;
    case "project":
      transform = `translateY(${56 * distance}px) rotate(${(index % 2 ? 1 : -1) * (compact ? 0.6 : 1.2)}deg) scale(.97)`;
      break;
    case "zoom":
      transform = `translateY(${24 * distance}px) scale(.91)`;
      break;
    case "award":
      transform = `translateY(${26 * distance}px) rotate(-.7deg) scale(.95)`;
      break;
    case "contact":
      transform = `translateY(${64 * distance}px)`;
      break;
    case "quiet":
      transform = `translateY(${20 * distance}px)`;
      break;
  }
  return [
    { transform, opacity: 0 },
    { transform: "none", opacity: 1 },
  ];
}
