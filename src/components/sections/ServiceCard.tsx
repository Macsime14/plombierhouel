import Image from "next/image";
import type { Service } from "@/types/service";
import { servicePhotos } from "@/lib/data/photos";

export function ServiceCard({ service }: { service: Service }) {
  const Icon = service.icon;
  const photo = servicePhotos[service.slug];

  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm transition-all motion-safe:hover:-translate-y-1 hover:shadow-md dark:border-stone-800 dark:bg-stone-900">
      {photo && (
        <div className="relative h-40 w-full">
          <Image
            src={photo}
            alt={service.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      )}
      <div className="p-6">
        <div className="flex items-center gap-2">
          <Icon size={18} className="text-primary" />
          <h3 className="font-heading text-lg font-semibold text-neutral-700">{service.title}</h3>
        </div>
        <p className="mt-2 text-sm text-neutral-500">{service.shortDescription}</p>
      </div>
    </div>
  );
}
