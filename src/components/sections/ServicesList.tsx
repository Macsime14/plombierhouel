import Image from "next/image";
import type { ServicePublic } from "@/lib/domain/services-site";

export function ServicesList({
  services,
  limit,
}: {
  services: ServicePublic[];
  limit?: number;
}) {
  const items = limit ? services.slice(0, limit) : services;

  return (
    <div className="divide-y divide-border">
      {items.map((service, index) => {
        const imageFirst = index % 2 === 1;

        return (
          <div
            key={service.slug}
            className="grid gap-8 py-10 lg:grid-cols-2 lg:items-center"
          >
            <div className={imageFirst ? "lg:order-2" : "lg:order-1"}>
              <h3 className="font-heading text-2xl font-semibold text-text">{service.titre}</h3>
              <p className="mt-2 max-w-sm text-text-muted">{service.description}</p>
            </div>

            {service.photoUrl ? (
              <div
                className={`relative aspect-[4/3] w-full overflow-hidden ${imageFirst ? "lg:order-1" : "lg:order-2"}`}
              >
                <Image
                  src={service.photoUrl}
                  alt={service.photoAlt ?? service.titre}
                  fill
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  className="object-cover transition-transform duration-700 motion-safe:hover:scale-105"
                />
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
