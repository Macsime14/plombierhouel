import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Button } from "@/components/ui/Button";
import { Hero } from "@/components/sections/Hero";
import { Reassurance } from "@/components/sections/Reassurance";
import { About } from "@/components/sections/About";
import { ServicesList } from "@/components/sections/ServicesList";
import { Realisations } from "@/components/sections/Realisations";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { Differentiators } from "@/components/sections/Differentiators";
import { Qualifications } from "@/components/sections/Qualifications";
import { InterventionZone } from "@/components/sections/InterventionZone";
import { getSiteData } from "@/lib/domain/site-data";

export default async function Home() {
  const site = await getSiteData();

  return (
    <>
      <Hero phoneHref={site.phoneHref} />
      <Reassurance />
      <About about={site.about} photo={site.aboutPhoto} />

      <section className="py-16 sm:py-24">
        <Container>
          <SectionTitle title="Ce que je fais" />
          <div className="mt-10">
            <ServicesList limit={4} />
          </div>
          <div className="mt-8">
            <Link
              href="/services"
              className="group inline-flex items-center gap-2 text-sm text-accent transition-colors hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              Voir tous les services
              <ArrowRight
                size={16}
                className="motion-safe:transition-transform motion-safe:group-hover:translate-x-1"
              />
            </Link>
          </div>
        </Container>
      </section>

      <section className="bg-surface py-16 sm:py-24">
        <Container>
          <SectionTitle title="Sur le terrain" />
          <div className="mt-12">
            <Realisations />
          </div>
        </Container>
      </section>

      <ProcessSteps />
      <Differentiators />
      <Qualifications />

      <section className="py-16 sm:py-24">
        <Container>
          <SectionTitle title={`Nous intervenons à ${site.areaDescription}`} />
          <div className="mt-8">
            <InterventionZone />
          </div>
        </Container>
      </section>

      <section className="border-t border-border py-16 sm:py-24">
        <Container className="text-center">
          <h2 className="font-heading text-3xl font-semibold text-text sm:text-4xl">
            Vous avez un projet ? Parlons-en.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-text-muted">
            Expliquez-moi votre besoin, je vous réponds rapidement.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href="/contact" className="w-full sm:w-auto">
              Demander un devis
            </Button>
            <Button href={site.phoneHref} variant="secondary" className="w-full sm:w-auto">
              Appeler
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
