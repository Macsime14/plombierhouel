import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Button } from "@/components/ui/Button";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Qualifications } from "@/components/sections/Qualifications";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { Gallery } from "@/components/sections/Gallery";
import { InterventionZone } from "@/components/sections/InterventionZone";
import { siteConfig } from "@/lib/data/site-config";

export default function Home() {
  return (
    <>
      <Hero />

      <About />

      <Qualifications />

      <section className="py-16 sm:py-24">
        <Container>
          <SectionTitle
            eyebrow="Nos services"
            title="Une expertise complète en plomberie et chauffage"
            description="Du simple dépannage aux projets de rénovation, nous intervenons rapidement et avec soin."
          />
          <div className="mt-10">
            <ServicesGrid limit={3} />
          </div>
          <div className="mt-8">
            <Link href="/services" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-dark">
              Voir tous les services
              <ArrowRight size={16} />
            </Link>
          </div>
        </Container>
      </section>

      <ProcessSteps />

      <section className="py-16 sm:py-24">
        <Container>
          <SectionTitle
            eyebrow="Réalisations"
            title="Un aperçu de nos chantiers"
            description="Quelques exemples d'interventions récentes."
          />
          <div className="mt-10">
            <Gallery />
          </div>
        </Container>
      </section>

      <section className="bg-accent py-16 sm:py-24">
        <Container>
          <SectionTitle eyebrow="Zone d'intervention" title={`Nous intervenons à ${siteConfig.areaDescription}`} />
          <div className="mt-8">
            <InterventionZone />
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-24">
        <Container className="flex flex-col items-center gap-6 rounded-3xl bg-primary px-6 py-14 text-center sm:px-12">
          <h2 className="font-heading text-3xl font-bold text-white">Un projet ou une urgence de plomberie ou de chauffage ?</h2>
          <p className="max-w-xl text-white/90">
            Contactez-nous dès maintenant pour un devis gratuit ou une intervention rapide.
          </p>
          <Button href="/contact" variant="secondary">
            Demander un devis
          </Button>
        </Container>
      </section>
    </>
  );
}
