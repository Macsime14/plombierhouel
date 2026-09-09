import type { Metadata } from "next";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ContactForm } from "@/components/sections/ContactForm";
import { getSiteData } from "@/lib/domain/site-data";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteData();
  return {
    title: "Contact",
    description: `Contactez ${site.companyName} pour une demande de devis ou une intervention à ${site.areaDescription}.`,
  };
}

export default async function ContactPage() {
  const site = await getSiteData();

  return (
    <section className="py-16 sm:py-24">
      <Container>
        <SectionTitle
          title="Demandez votre devis gratuit"
          description="Renseignez le formulaire ci-dessous ou contactez-moi directement par téléphone."
        />

        <div className="mt-12 grid gap-12 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <ContactForm />
          </div>

          <div className="space-y-4 lg:col-span-2">
            <div className="rounded-sm border border-border bg-surface p-6">
              <p className="flex items-center gap-3 text-sm text-text">
                <Phone size={18} className="text-accent" />
                <a href={site.phoneHref} className="hover:text-accent">
                  {site.phone}
                </a>
              </p>
              <p className="mt-3 flex items-center gap-3 text-sm text-text">
                <Mail size={18} className="text-accent" />
                <a href={`mailto:${site.email}`} className="hover:text-accent">
                  {site.email}
                </a>
              </p>
              <p className="mt-3 flex items-center gap-3 text-sm text-text">
                <MapPin size={18} className="text-accent" />
                {site.address}
              </p>
              <p className="mt-3 flex items-center gap-3 text-sm text-text">
                <Clock size={18} className="text-accent" />
                {site.hours}
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
