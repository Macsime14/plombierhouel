import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Phone, Clock } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/lib/data/site-config";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-surface">
      <Container className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <Image
              src="/images/logo.png"
              alt={siteConfig.companyName}
              width={28}
              height={28}
              className="h-7 w-7 dark:hidden"
            />
            <Image
              src="/images/logo-dark.png"
              alt={siteConfig.companyName}
              width={28}
              height={28}
              className="hidden h-7 w-7 dark:block"
            />
            <p className="font-heading text-lg font-semibold text-text">{siteConfig.companyName}</p>
          </div>
          <p className="mt-2 text-sm text-text-muted">{siteConfig.tagline}</p>
        </div>

        <div className="space-y-2 text-sm text-text">
          <p className="flex items-center gap-2">
            <Phone size={16} className="text-accent" />
            <a
              href={siteConfig.phoneHref}
              className="transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              {siteConfig.phone}
            </a>
          </p>
          <p className="flex items-center gap-2">
            <Mail size={16} className="text-accent" />
            <a
              href={`mailto:${siteConfig.email}`}
              className="transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              {siteConfig.email}
            </a>
          </p>
          <p className="flex items-center gap-2">
            <MapPin size={16} className="text-accent" />
            {siteConfig.address}
          </p>
          <p className="flex items-center gap-2">
            <Clock size={16} className="text-accent" />
            {siteConfig.hours}
          </p>
        </div>

        <div className="space-y-2 text-sm">
          <p className="font-medium text-text">Navigation</p>
          <Link
            href="/services"
            className="block text-text-muted transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            Services
          </Link>
          <Link
            href="/zone-intervention"
            className="block text-text-muted transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            Zone d&apos;intervention
          </Link>
          <Link
            href="/contact"
            className="block text-text-muted transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            Contact
          </Link>
        </div>

        <div className="space-y-2 text-sm text-text-muted">
          <p className="font-medium text-text">Informations légales</p>
          <p>SIRET : {siteConfig.siret}</p>
          <p>{siteConfig.address}</p>
        </div>
      </Container>

      <div className="border-t border-border py-4">
        <Container>
          <p className="text-center text-xs text-text-muted">
            © {new Date().getFullYear()} {siteConfig.companyName}. Tous droits réservés.
          </p>
        </Container>
      </div>
    </footer>
  );
}
