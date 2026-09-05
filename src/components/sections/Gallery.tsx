import Image from "next/image";
import { galleryPhotos } from "@/lib/data/photos";

export function Gallery() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {galleryPhotos.map((photo, index) => (
        <div key={index} className="relative aspect-square overflow-hidden rounded-2xl">
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      ))}
    </div>
  );
}
