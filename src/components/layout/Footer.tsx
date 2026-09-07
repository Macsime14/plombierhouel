import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Phone, Clock } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/lib/data/site-config";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-neutral-100 dark:border-stone-800 bg-accent">
      <Container className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <Image
              src="/images/logo.png"
              alt={siteConfig.companyName}
              width={32}
              height={32}
              className="h-8 w-8 dark:hidden"
            />
            <Image
              src="/images/logo-dark.png"
              alt={siteConfig.companyName}
              width={32}
              height={32}
              className="hidden h-8 w-8 dark:block"
            />
            <p className="font-heading text-lg font-bold text-neutral-700">{siteConfig.companyName}</p>
          </div>
          <p className="mt-2 text-sm text-neutral-500">{siteConfig.tagline}</p>
        </div>

        <div className="space-y-2 text-sm text-neutral-700">
          <p className="flex items-center gap-2">
            <Phone size={16} className="text-primary" />
            <a
              href={siteConfig.phoneHref}
              className="rounded-sm transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {siteConfig.phone}
            </a>
          </p>
          <p className="flex items-center gap-2">
            <Mail size={16} className="text-primary" />
            <a
              href={`mailto:${siteConfig.email}`}
              className="rounded-sm transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {siteConfig.email}
            </a>
          </p>
          <p className="flex items-center gap-2">
            <MapPin size={16} className="text-primary" />
            {siteConfig.address}
          </p>
          <p className="flex items-center gap-2">
            <Clock size={16} className="text-primary" />
            {siteConfig.hours}
          </p>
        </div>

        <div className="space-y-2 text-sm">
          <p className="font-semibold text-neutral-700">Navigation</p>
          <Link href="/services" className="block rounded-sm text-neutral-500 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
            Services
          </Link>
          <Link href="/zone-intervention" className="block rounded-sm text-neutral-500 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
            Zone d&apos;intervention
          </Link>
          <Link href="/contact" className="block rounded-sm text-neutral-500 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
            Contact
          </Link>
        </div>

        <div className="space-y-2 text-sm text-neutral-500">
          <p className="font-semibold text-neutral-700">Informations légales</p>
          <p>SIRET : {siteConfig.siret}</p>
          <p>{siteConfig.address}</p>
        </div>
      </Container>

      <div className="border-t border-neutral-100 dark:border-stone-800 py-4">
        <Container>
          <p className="text-center text-xs text-neutral-500">
            © {new Date().getFullYear()} {siteConfig.companyName}. Tous droits réservés.
          </p>
        </Container>
      </div>
    </footer>
  );
}
