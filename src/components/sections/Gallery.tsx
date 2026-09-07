import Image from "next/image";
import { galleryPhotos } from "@/lib/data/photos";

export function Gallery() {
  const [featured, ...rest] = galleryPhotos;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <div className="relative col-span-2 aspect-video overflow-hidden rounded-lg sm:aspect-auto sm:row-span-2">
        <Image
          src={featured.src}
          alt={featured.alt}
          fill
          sizes="(min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      {rest.slice(0, 4).map((photo, index) => (
        <div key={index} className="relative aspect-square overflow-hidden rounded-lg">
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="25vw"
            className="object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      ))}
    </div>
  );
}
