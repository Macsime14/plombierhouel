import Image from "next/image";
import { Phone, ShieldCheck, Clock, MapPin } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/lib/data/site-config";
import { heroPhoto } from "@/lib/data/photos";

export function Hero() {
  return (
    <section className="relative isolate min-h-[560px] overflow-hidden">
      <Image
        src={heroPhoto.src}
        alt={heroPhoto.alt}
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/90 via-primary-dark/70 to-primary-dark/40" />

      <Container className="relative py-20 lg:py-28">
        <div className="max-w-xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-white/80">
            Plombier chauffagiste à {siteConfig.areaDescription}
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Un plombier chauffagiste fiable, disponible pour vos travaux et dépannages
          </h1>
          <p className="mt-6 text-lg text-white/90">
            {siteConfig.companyName} intervient pour tous vos besoins en plomberie et en chauffage : dépannage,
            installation de chauffage, sanitaires et rénovation, avec un travail soigné et des délais respectés.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button href="/contact">Demander un devis</Button>
            <Button href={siteConfig.phoneHref} variant="secondary">
              <Phone size={16} />
              Appeler maintenant
            </Button>
          </div>

          <dl className="mt-10 grid grid-cols-3 gap-4 text-sm text-white/90">
            <div className="flex flex-col items-start gap-1">
              <ShieldCheck size={20} />
              Travail garanti
            </div>
            <div className="flex flex-col items-start gap-1">
              <Clock size={20} />
              {siteConfig.hours}
            </div>
            <div className="flex flex-col items-start gap-1">
              <MapPin size={20} />
              {siteConfig.areaDescription}
            </div>
          </dl>
        </div>
      </Container>
    </section>
  );
}
