import { services } from "@/lib/data/services";

export function ServicesList({ limit }: { limit?: number }) {
  const items = limit ? services.slice(0, limit) : services;

  return (
    <ol className="divide-y divide-neutral-200 dark:divide-stone-800">
      {items.map((service, index) => (
        <li
          key={service.slug}
          className="flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
        >
          <div className="flex items-baseline gap-4">
            <span className="font-heading text-sm text-primary/60">{String(index + 1).padStart(2, "0")}</span>
            <span className="font-heading text-lg font-semibold text-neutral-700">{service.title}</span>
          </div>
          <p className="text-sm text-neutral-500 sm:text-right">{service.shortDescription}</p>
        </li>
      ))}
    </ol>
  );
}
