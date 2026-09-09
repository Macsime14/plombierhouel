import { Phone } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export function Hero({ phoneHref }: { phoneHref: string }) {
  return (
    <section className="border-b border-border">
      <Container className="py-16 sm:py-28">
        <div className="max-w-2xl">
          <h1 className="font-heading text-4xl leading-[1.06] font-semibold tracking-tight text-text sm:text-5xl lg:text-6xl">
            Un travail propre, des conseils clairs, un chantier bien mené.
          </h1>
          <p className="mt-6 max-w-lg text-lg text-text-muted">
            J&apos;interviens pour vos besoins en plomberie et en chauffage, avec la même
            exigence à chaque étape.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button href="/contact" className="w-full sm:w-auto">
              Demander un devis
            </Button>
            <Button href={phoneHref} variant="secondary" className="w-full sm:w-auto">
              <Phone size={16} />
              Appeler
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
