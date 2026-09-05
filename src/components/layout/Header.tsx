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
    <header className="sticky top-0 z-50 border-b border-neutral-100 bg-white/95 backdrop-blur dark:border-stone-800 dark:bg-stone-950/95">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-heading font-bold text-neutral-700" onClick={() => setOpen(false)}>
          <Image
            src="/images/logo.png"
            alt={siteConfig.companyName}
            width={36}
            height={36}
            className="h-9 w-9 dark:hidden"
          />
          <Image
            src="/images/logo-dark.png"
            alt={siteConfig.companyName}
            width={36}
            height={36}
            className="hidden h-9 w-9 dark:block"
          />
          {siteConfig.companyName}
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-medium text-neutral-700 hover:text-primary">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          <a
            href={siteConfig.phoneHref}
            className="inline-flex items-center gap-2 rounded-full bg-warm px-4 py-2 text-sm font-semibold text-white hover:bg-warm-dark"
          >
            <Phone size={16} />
            {siteConfig.phone}
          </a>
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md p-2 text-neutral-700"
            aria-label="Ouvrir le menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </Container>

      {open && (
        <div className="border-t border-neutral-100 bg-white md:hidden dark:border-stone-800 dark:bg-stone-950">
          <Container className="flex flex-col gap-1 py-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md px-2 py-2 text-sm font-medium text-neutral-700 hover:bg-primary-light hover:text-primary"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <a
              href={siteConfig.phoneHref}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-warm px-4 py-2 text-sm font-semibold text-white"
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
