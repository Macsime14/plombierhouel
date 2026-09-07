import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ServicesList } from "@/components/sections/ServicesList";
import { siteConfig } from "@/lib/data/site-config";

export const metadata: Metadata = {
  title: "Nos services",
  description: `Découvrez tous les services de plomberie et de chauffage proposés par ${siteConfig.companyName} : dépannage, chauffage, sanitaires, recherche de fuite et rénovation.`,
};

export default function ServicesPage() {
  return (
    <section className="py-16 sm:py-24">
      <Container>
        <SectionTitle eyebrow="Mes services" title="Ce que je fais" />
        <div className="mt-10 max-w-2xl">
          <ServicesList />
        </div>
      </Container>
    </section>
  );
}
