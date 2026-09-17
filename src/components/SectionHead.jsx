export default function SectionHead({ eyebrow, title, subtitle, center = true }) {
  return (
    <div className={`${center ? "mx-auto text-center" : ""} max-w-2xl`}>
      {eyebrow && (
        <span className="text-xs font-bold uppercase tracking-widest text-brand">{eyebrow}</span>
      )}
      <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-ink">{title}</h2>
      {subtitle && <p className="mt-3 text-sm leading-relaxed text-muted">{subtitle}</p>}
    </div>
  );
}