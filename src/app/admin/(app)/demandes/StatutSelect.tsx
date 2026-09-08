"use client";

import { changerStatutDemande } from "@/lib/admin/demandes-actions";
import { DEMANDE_STATUTS, DEMANDE_STATUT_LABELS } from "@/lib/admin/demande-statuts";

export function StatutSelect({ id, statut }: { id: string; statut: string }) {
  return (
    <form action={changerStatutDemande}>
      <input type="hidden" name="id" value={id} />
      <select
        name="statut"
        defaultValue={statut}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        className="rounded-md border border-border bg-background px-2 py-1 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        aria-label="Statut de la demande"
      >
        {DEMANDE_STATUTS.map((s) => (
          <option key={s} value={s}>
            {DEMANDE_STATUT_LABELS[s]}
          </option>
        ))}
      </select>
    </form>
  );
}
