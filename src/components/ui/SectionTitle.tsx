export function SectionTitle({
  title,
  description,
  center = false,
}: {
  title: string;
  description?: string;
  center?: boolean;
}) {
  return (
    <div className={`max-w-2xl ${center ? "mx-auto text-center" : ""}`}>
      <h2 className="font-heading text-3xl font-semibold tracking-tight text-text sm:text-4xl">
        {title}
      </h2>
      {description && <p className="mt-4 text-lg text-text-muted">{description}</p>}
    </div>
  );
}
