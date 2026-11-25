export function SectionHeading({
  number,
  label,
  title,
  children,
}: {
  number: string;
  label: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="section-head" data-reveal>
      <div>
        <p className="eyebrow">
          {number} / {label}
        </p>
        <h2>{title}</h2>
      </div>
      {children && <p className="section-intro">{children}</p>}
    </div>
  );
}
