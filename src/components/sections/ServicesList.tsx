import Image from "next/image";
import { services } from "@/lib/data/services";
import { servicePhotos } from "@/lib/data/photos";

export function ServicesList({ limit }: { limit?: number }) {
  const items = limit ? services.slice(0, limit) : services;

  return (
    <div className="divide-y divide-border">
      {items.map((service, index) => {
        const photo = servicePhotos[service.slug];
        const imageFirst = index % 2 === 1;

        return (
          <div key={service.slug} className="grid gap-8 py-10 lg:grid-cols-2 lg:items-center">
            <div className={imageFirst ? "lg:order-2" : "lg:order-1"}>
              <span className="font-heading text-sm text-accent">{String(index + 1).padStart(2, "0")}</span>
              <h3 className="mt-1 font-heading text-2xl font-semibold text-neutral-700">{service.title}</h3>
              <p className="mt-2 max-w-sm text-neutral-500">{service.description}</p>
            </div>

            {photo && (
              <div className={`relative aspect-[4/3] w-full ${imageFirst ? "lg:order-1" : "lg:order-2"}`}>
                <Image
                  src={photo}
                  alt={service.title}
                  fill
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  className="object-cover"
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
