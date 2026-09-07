"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, Phone, X } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { siteConfig } from "@/lib/data/site-config";

const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/services", label: "Services" },
  { href: "/zone-intervention", label: "Zone d'intervention" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 font-heading text-lg font-semibold text-neutral-700"
          onClick={() => setOpen(false)}
        >
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
          {siteConfig.companyName}
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-neutral-700 transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <ThemeToggle />
          <a
            href={siteConfig.phoneHref}
            className="flex items-center gap-2 text-sm text-neutral-700 transition-colors hover:text-accent"
          >
            <Phone size={16} />
            {siteConfig.phone}
          </a>
          <Link
            href="/contact"
            className="cursor-pointer border border-current px-4 py-2 text-sm tracking-wide text-accent uppercase transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            Devis
          </Link>
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            className="inline-flex cursor-pointer items-center justify-center p-2 text-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            aria-label="Ouvrir le menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </Container>

      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <Container className="flex flex-col gap-1 py-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-2 py-2 text-sm text-neutral-700 transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <a
              href={siteConfig.phoneHref}
              className="mt-2 flex cursor-pointer items-center justify-center gap-2 bg-accent px-4 py-3 text-sm tracking-wide text-on-accent uppercase"
            >
              <Phone size={16} />
              {siteConfig.phone}
            </a>
          </Container>
        </div>
      )}
    </header>
  );
}
