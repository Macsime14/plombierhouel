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
          eyebrow="Contact"
          title="Demandez votre devis gratuit"
          description="Renseignez le formulaire ci-dessous ou contactez-nous directement par téléphone."
        />

        <div className="mt-12 grid gap-12 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <ContactForm />
          </div>

          <div className="space-y-4 lg:col-span-2">
            <div className="rounded-2xl bg-accent p-6">
              <p className="flex items-center gap-3 text-sm text-neutral-700">
                <Phone size={18} className="text-primary" />
                <a href={siteConfig.phoneHref} className="hover:text-primary">
                  {siteConfig.phone}
                </a>
              </p>
              <p className="mt-3 flex items-center gap-3 text-sm text-neutral-700">
                <Mail size={18} className="text-primary" />
                <a href={`mailto:${siteConfig.email}`} className="hover:text-primary">
                  {siteConfig.email}
                </a>
              </p>
              <p className="mt-3 flex items-center gap-3 text-sm text-neutral-700">
                <MapPin size={18} className="text-primary" />
                {siteConfig.address}
              </p>
              <p className="mt-3 flex items-center gap-3 text-sm text-neutral-700">
                <Clock size={18} className="text-primary" />
                {siteConfig.hours}
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
