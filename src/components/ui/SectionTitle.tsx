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
      {eyebrow && (
        <p
          className={`flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-primary ${center ? "justify-center" : ""}`}
        >
          <span className="h-0.5 w-8 bg-warm" aria-hidden="true" />
          {eyebrow}
        </p>
      )}
      <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight text-neutral-700 sm:text-4xl">{title}</h2>
      {description && <p className="mt-4 text-lg text-neutral-500">{description}</p>}
    </div>
  );
}
