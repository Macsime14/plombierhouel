import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { InterventionZone } from "@/components/sections/InterventionZone";
import { getSiteData } from "@/lib/domain/site-data";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteData();
  return {
    title: "Zone d'intervention",
    description: `${site.companyName} intervient à ${site.areaDescription}. Découvrez toutes les villes desservies.`,
  };
}

export default async function ZoneInterventionPage() {
  const site = await getSiteData();

  return (
    <section className="py-16 sm:py-24">
      <Container>
        <SectionTitle
          title={`Nous intervenons à ${site.areaDescription}`}
          description="Vous ne trouvez pas votre ville dans la liste ? Contactez-nous, nous pouvons peut-être tout de même intervenir."
        />
        <div className="mt-10">
          <InterventionZone />
        </div>
      </Container>
    </section>
  );
}
