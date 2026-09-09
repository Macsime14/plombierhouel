"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, Phone, X } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/services", label: "Services" },
  { href: "/zone-intervention", label: "Zone d'intervention" },
  { href: "/contact", label: "Contact" },
];

export function Header({
  companyName,
  phone,
  phoneHref,
}: {
  companyName: string;
  phone: string;
  phoneHref: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 font-heading text-lg font-semibold text-text"
          onClick={() => setOpen(false)}
        >
          <Image
            src="/images/logo.png"
            alt={companyName}
            width={32}
            height={32}
            className="h-8 w-8 dark:hidden"
          />
          <Image
            src="/images/logo-dark.png"
            alt={companyName}
            width={32}
            height={32}
            className="hidden h-8 w-8 dark:block"
          />
          {companyName}
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-text transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <ThemeToggle />
          <a
            href={phoneHref}
            className="flex items-center gap-2 text-sm text-text transition-colors hover:text-accent"
          >
            <Phone size={16} />
            {phone}
          </a>
          <Link
            href="/contact"
            className="cursor-pointer rounded-sm bg-accent-warm px-4 py-2 text-sm font-medium text-on-accent-warm transition-colors hover:bg-accent-warm-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Demander un devis
          </Link>
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            className="inline-flex cursor-pointer items-center justify-center p-2 text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            aria-label="Ouvrir le menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </Container>

      <div
        aria-hidden={!open}
        className={`grid overflow-hidden bg-background transition-[grid-template-rows] duration-300 ease-out md:hidden ${
          open ? "grid-rows-[1fr] border-t border-border" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <Container className="flex flex-col gap-1 py-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-2 py-2 text-sm text-text transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <a
              href={phoneHref}
              className="mt-2 flex cursor-pointer items-center justify-center gap-2 rounded-sm bg-accent-warm px-4 py-3 text-sm font-medium text-on-accent-warm"
            >
              <Phone size={16} />
              {phone}
            </a>
          </Container>
        </div>
      </div>
    </header>
  );
}
