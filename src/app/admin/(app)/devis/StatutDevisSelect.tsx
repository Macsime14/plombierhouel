"use client";

import { changerStatutDevis } from "@/lib/admin/devis-actions";
import { DEVIS_STATUT_LABELS } from "@/lib/admin/devis-statuts";

const OPTIONS = ["brouillon", "envoye", "accepte", "refuse", "expire"] as const;

export function StatutDevisSelect({ id, statut }: { id: string; statut: string }) {
  return (
    <form action={changerStatutDevis}>
      <input type="hidden" name="id" value={id} />
      <select
        name="statut"
        defaultValue={OPTIONS.includes(statut as (typeof OPTIONS)[number]) ? statut : "brouillon"}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        className="w-full rounded-md border border-border bg-background px-2 py-1.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        aria-label="Statut du devis"
      >
        {OPTIONS.map((s) => (
          <option key={s} value={s}>
            {DEVIS_STATUT_LABELS[s]}
          </option>
        ))}
      </select>
    </form>
  );
}
