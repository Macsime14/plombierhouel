import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { siteConfig } from "@/lib/data/site-config";

export const metadata: Metadata = {
  title: "Nos services",
  description: `Découvrez tous les services de plomberie proposés par ${siteConfig.companyName} : dépannage, chauffage, sanitaires, recherche de fuite et rénovation.`,
};

export default function ServicesPage() {
  return (
    <section className="py-16 sm:py-24">
      <Container>
        <SectionTitle
          eyebrow="Nos services"
          title="Toutes nos prestations de plomberie"
          description="Chaque intervention est réalisée avec le même souci du détail, que ce soit une urgence ou un projet planifié."
        />
        <div className="mt-10">
          <ServicesGrid />
        </div>
      </Container>
    </section>
  );
}
