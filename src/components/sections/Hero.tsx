import Image from "next/image";
import { Phone } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/lib/data/site-config";
import { heroPhoto } from "@/lib/data/photos";

export function Hero() {
  return (
    <section>
      <div className="relative aspect-[3/2] w-full sm:aspect-[16/9] lg:aspect-[21/9]">
        <Image
          src={heroPhoto.src}
          alt={heroPhoto.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <Container className="py-12 sm:py-16">
        <div className="max-w-2xl">
          <h1 className="font-heading text-4xl leading-[1.08] font-semibold tracking-tight text-text sm:text-5xl">
            Un travail propre, des conseils clairs, un chantier bien mené.
          </h1>
          <p className="mt-5 max-w-lg text-lg text-text-muted">
            J&apos;interviens pour vos besoins en plomberie et en chauffage, avec la même
            exigence à chaque étape.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button href="/contact" className="w-full sm:w-auto">
              Demander un devis
            </Button>
            <Button
              href={siteConfig.phoneHref}
              variant="secondary"
              className="w-full sm:w-auto"
            >
              <Phone size={16} />
              Appeler
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
