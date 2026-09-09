"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const liens = [
  { href: "/admin", label: "Tableau de bord" },
  { href: "/admin/demandes", label: "Demandes" },
  { href: "/admin/devis", label: "Devis" },
  { href: "/admin/factures", label: "Factures" },
  { href: "/admin/planning", label: "Planning" },
  { href: "/admin/clients", label: "Clients" },
  { href: "/admin/prestations", label: "Prestations" },
  { href: "/admin/site", label: "Contenu du site" },
  { href: "/admin/parametres", label: "Paramètres" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      {liens.map((lien) => {
        const actif =
          lien.href === "/admin" ? pathname === "/admin" : pathname.startsWith(lien.href);
        return (
          <Link
            key={lien.href}
            href={lien.href}
            aria-current={actif ? "page" : undefined}
            className={`rounded-md px-2 py-1.5 text-sm transition-colors ${
              actif
                ? "bg-surface-muted font-medium text-text"
                : "text-text-muted hover:bg-surface-muted hover:text-text"
            }`}
          >
            {lien.label}
          </Link>
        );
      })}
    </nav>
  );
}
