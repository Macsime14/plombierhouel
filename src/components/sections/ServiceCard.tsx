import Image from "next/image";
import type { Service } from "@/types/service";
import { servicePhotos } from "@/lib/data/photos";

export function ServiceCard({ service }: { service: Service }) {
  const Icon = service.icon;
  const photo = servicePhotos[service.slug];

  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm transition-shadow hover:shadow-md">
      {photo && (
        <div className="relative h-40 w-full">
          <Image
            src={photo}
            alt={service.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
          <span className="absolute bottom-3 left-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-primary shadow">
            <Icon size={20} />
          </span>
        </div>
      )}
      <div className="p-6">
        <h3 className="font-heading text-lg font-semibold text-neutral-700">{service.title}</h3>
        <p className="mt-2 text-sm text-neutral-500">{service.shortDescription}</p>
      </div>
    </div>
  );
}
