import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
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
          <Reveal key={service.slug} delay={(index % 4) * 80}>
            <div className="grid gap-8 py-10 lg:grid-cols-2 lg:items-center">
              <div className={imageFirst ? "lg:order-2" : "lg:order-1"}>
                <h3 className="mt-1 font-heading text-2xl font-semibold text-text">{service.title}</h3>
                <p className="mt-2 max-w-sm text-text-muted">{service.description}</p>
              </div>

              {photo && (
                <div
                  className={`relative aspect-[4/3] w-full overflow-hidden ${imageFirst ? "lg:order-1" : "lg:order-2"}`}
                >
                  <Image
                    src={photo}
                    alt={service.title}
                    fill
                    sizes="(min-width: 1024px) 45vw, 100vw"
                    className="object-cover transition-transform duration-700 motion-safe:hover:scale-105"
                  />
                </div>
              )}
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}
