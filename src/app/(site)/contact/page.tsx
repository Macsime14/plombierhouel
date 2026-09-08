import type { Metadata } from "next";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ContactForm } from "@/components/sections/ContactForm";
import { siteConfig } from "@/lib/data/site-config";

export const metadata: Metadata = {
  title: "Contact",
  description: `Contactez ${siteConfig.companyName} pour une demande de devis ou une intervention à ${siteConfig.areaDescription}.`,
};

export default function ContactPage() {
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
            <div className="border border-border bg-surface p-6">
              <p className="flex items-center gap-3 text-sm text-text">
                <Phone size={18} className="text-accent" />
                <a href={siteConfig.phoneHref} className="hover:text-accent">
                  {siteConfig.phone}
                </a>
              </p>
              <p className="mt-3 flex items-center gap-3 text-sm text-text">
                <Mail size={18} className="text-accent" />
                <a href={`mailto:${siteConfig.email}`} className="hover:text-accent">
                  {siteConfig.email}
                </a>
              </p>
              <p className="mt-3 flex items-center gap-3 text-sm text-text">
                <MapPin size={18} className="text-accent" />
                {siteConfig.address}
              </p>
              <p className="mt-3 flex items-center gap-3 text-sm text-text">
                <Clock size={18} className="text-accent" />
                {siteConfig.hours}
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
