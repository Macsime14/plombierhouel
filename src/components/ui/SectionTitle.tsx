export function SectionTitle({
  eyebrow,
  title,
  description,
  center = false,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  center?: boolean;
}) {
  return (
    <div className={`max-w-2xl ${center ? "mx-auto text-center" : ""}`}>
      <span className={`block h-0.5 w-10 bg-accent ${center ? "mx-auto" : ""}`} aria-hidden="true" />
      {eyebrow && <p className="mt-4 text-sm font-medium tracking-wide text-accent uppercase">{eyebrow}</p>}
      <h2 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-neutral-700 sm:text-4xl">
        {title}
      </h2>
      {description && <p className="mt-4 text-lg text-neutral-500">{description}</p>}
    </div>
  );
}
