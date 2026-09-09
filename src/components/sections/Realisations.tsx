import Image from "next/image";
import { realisations } from "@/lib/data/realisations";

export function Realisations() {
  return (
    <div className="space-y-16">
      {realisations.map((item, index) => {
        const imageFirst = index % 2 === 1;

        return (
          <div key={item.description} className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div
              className={`relative aspect-[4/3] w-full overflow-hidden ${imageFirst ? "lg:order-1" : "lg:order-2"}`}
            >
              <Image
                src={item.photo}
                alt={item.description}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover transition-transform duration-700 motion-safe:hover:scale-105"
              />
            </div>
            <div className={imageFirst ? "lg:order-2" : "lg:order-1"}>
              <h3 className="font-heading text-2xl font-semibold text-text">{item.type}</h3>
              <p className="mt-1 text-sm text-text-muted">{item.location}</p>
              <p className="mt-4 max-w-md text-text-muted">{item.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
