import Image from "next/image";
import { Phone } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/lib/data/site-config";
import { heroPhoto } from "@/lib/data/photos";

export function Hero() {
  return (
    <section className="grid lg:grid-cols-[0.85fr_1.15fr]">
      <div className="flex flex-col justify-center px-6 py-16 sm:px-12 lg:px-16 lg:py-0">
        <p className="text-sm tracking-wide text-accent uppercase">
          Plomberie &amp; chauffage — {siteConfig.areaDescription}
        </p>
        <h1 className="mt-5 font-heading text-4xl leading-[1.1] font-semibold tracking-tight text-neutral-700 sm:text-5xl">
          Un travail propre, des conseils clairs, un chantier bien mené.
        </h1>
        <p className="mt-6 max-w-md text-lg text-neutral-500">
          J&apos;interviens pour vos besoins en plomberie et en chauffage, avec la même exigence à chaque étape.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Button href="/contact" className="w-full sm:w-auto">
            Demander un devis
          </Button>
          <Button href={siteConfig.phoneHref} variant="secondary" className="w-full sm:w-auto">
            <Phone size={16} />
            Appeler
          </Button>
        </div>
      </div>

      <div className="relative min-h-[360px] lg:min-h-[560px]">
        <Image src={heroPhoto.src} alt={heroPhoto.alt} fill priority sizes="(min-width: 1024px) 58vw, 100vw" className="object-cover" />
      </div>
    </section>
  );
}
