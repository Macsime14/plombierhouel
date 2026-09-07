import Image from "next/image";
import { Phone } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/lib/data/site-config";
import { heroPhoto } from "@/lib/data/photos";

export function Hero() {
  return (
    <section>
      <div className="relative aspect-[16/9] sm:aspect-[21/9]">
        <Image src={heroPhoto.src} alt={heroPhoto.alt} fill priority sizes="100vw" className="object-cover" />
      </div>

      <div className="bg-accent px-6 py-10 sm:px-12 sm:py-14 lg:py-16">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Plombier chauffagiste — {siteConfig.areaDescription}
          </p>
          <h1 className="mt-4 font-heading text-3xl font-bold tracking-tight text-neutral-700 sm:text-4xl lg:text-5xl">
            La plomberie, sans mauvaise surprise.
          </h1>
          <p className="mt-4 text-lg text-neutral-500">
            Dépannage, chauffage et rénovation à {siteConfig.areaDescription} : je me déplace, je diagnostique sur
            place et je vous explique ce qu&apos;il y a à faire avant d&apos;intervenir.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
            <Button href="/contact" className="w-full sm:w-auto">
              Demander un devis
            </Button>
            <Button href={siteConfig.phoneHref} variant="secondary" className="w-full sm:w-auto">
              <Phone size={16} />
              Appeler
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
