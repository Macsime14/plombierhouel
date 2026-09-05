"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, Phone, X, Wrench } from "lucide-react";
import { Container } from "@/components/ui/Container";
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
    <header className="sticky top-0 z-50 border-b border-neutral-100 bg-white/95 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-neutral-700" onClick={() => setOpen(false)}>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white">
            <Wrench size={18} />
          </span>
          {siteConfig.companyName}
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-medium text-neutral-700 hover:text-primary">
              {link.label}
            </Link>
          ))}
        </nav>

        <a
          href={siteConfig.phoneHref}
          className="hidden items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark md:inline-flex"
        >
          <Phone size={16} />
          {siteConfig.phone}
        </a>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md p-2 text-neutral-700 md:hidden"
          aria-label="Ouvrir le menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </Container>

      {open && (
        <div className="border-t border-neutral-100 bg-white md:hidden">
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
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white"
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
