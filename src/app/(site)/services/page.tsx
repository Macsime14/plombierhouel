import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ServicesList } from "@/components/sections/ServicesList";
import { getSiteData } from "@/lib/domain/site-data";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteData();
  return {
    title: "Nos services",
    description: `Découvrez tous les services de plomberie et de chauffage proposés par ${site.companyName} : dépannage, chauffage, sanitaires, recherche de fuite et rénovation.`,
  };
}

export default function ServicesPage() {
  return (
    <section className="py-16 sm:py-24">
      <Container>
        <SectionTitle title="Ce que je fais" />
        <div className="mt-10">
          <ServicesList />
        </div>
      </Container>
    </section>
  );
}
