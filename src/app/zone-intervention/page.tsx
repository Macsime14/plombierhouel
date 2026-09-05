import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { InterventionZone } from "@/components/sections/InterventionZone";
import { siteConfig } from "@/lib/data/site-config";

export const metadata: Metadata = {
  title: "Zone d'intervention",
  description: `${siteConfig.companyName} intervient à ${siteConfig.areaDescription}. Découvrez toutes les villes desservies.`,
};

export default function ZoneInterventionPage() {
  return (
    <section className="py-16 sm:py-24">
      <Container>
        <SectionTitle
          eyebrow="Zone d'intervention"
          title={`Nous intervenons à ${siteConfig.areaDescription}`}
          description="Vous ne trouvez pas votre ville dans la liste ? Contactez-nous, nous pouvons peut-être tout de même intervenir."
        />
        <div className="mt-10">
          <InterventionZone />
        </div>
      </Container>
    </section>
  );
}
