import Image from "next/image";
import { realisations } from "@/lib/data/realisations";

export function Realisations() {
  return (
    <div className="space-y-16">
      {realisations.map((item, index) => {
        const imageFirst = index % 2 === 1;

        return (
          <div key={item.description} className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div className={`relative aspect-[4/3] w-full ${imageFirst ? "lg:order-1" : "lg:order-2"}`}>
              <Image
                src={item.photo}
                alt={item.description}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className={imageFirst ? "lg:order-2" : "lg:order-1"}>
              <span className="font-heading text-sm text-accent">{String(index + 1).padStart(2, "0")}</span>
              <h3 className="mt-1 font-heading text-2xl font-semibold text-neutral-700">{item.type}</h3>
              <p className="mt-1 text-sm text-neutral-500">{item.location}</p>
              <p className="mt-4 max-w-md text-neutral-500">{item.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
