import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Button } from "@/components/ui/Button";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Qualifications } from "@/components/sections/Qualifications";
import { ServicesList } from "@/components/sections/ServicesList";
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
          <SectionTitle eyebrow="Mes services" title="Ce que je fais" />
          <div className="mt-10 max-w-2xl">
            <ServicesList limit={5} />
          </div>
          <div className="mt-8">
            <Link
              href="/services"
              className="group inline-flex items-center gap-2 rounded-sm text-sm font-semibold text-primary transition-colors hover:text-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              Voir tous les services
              <ArrowRight size={16} className="motion-safe:transition-transform motion-safe:group-hover:translate-x-1" />
            </Link>
          </div>
        </Container>
      </section>

      <ProcessSteps />

      <section className="py-16 sm:py-24">
        <Container>
          <SectionTitle eyebrow="Réalisations" title="Sur le terrain" />
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
        <Container className="flex flex-col items-center gap-6 rounded-lg bg-primary px-6 py-14 text-center sm:px-12">
          <h2 className="font-heading text-3xl font-bold text-white">Un projet ou une urgence ?</h2>
          <p className="max-w-xl text-white/90">Appelez-moi ou laissez-moi un message, je reviens vers vous rapidement.</p>
          <Button href="/contact">Demander un devis</Button>
        </Container>
      </section>
    </>
  );
}
