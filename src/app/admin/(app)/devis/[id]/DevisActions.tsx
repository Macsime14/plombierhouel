"use client";

import { useActionState } from "react";

import { envoyerDevis, type EnvoiState } from "@/lib/admin/devis-actions";

export function DevisActions({ id, clientEmail }: { id: string; clientEmail: string | null }) {
  const [state, action, pending] = useActionState<EnvoiState, FormData>(envoyerDevis, undefined);

  return (
    <div className="flex flex-col gap-2">
      <a
        href={`/admin/devis/${id}/pdf`}
        target="_blank"
        rel="noopener"
        className="rounded-md border border-border px-3 py-1.5 text-center text-sm hover:border-accent"
      >
        Voir le PDF
      </a>

      <form action={action}>
        <input type="hidden" name="id" value={id} />
        <button
          type="submit"
          disabled={pending || !clientEmail}
          className="w-full cursor-pointer rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-on-accent hover:opacity-90 disabled:opacity-50"
          title={clientEmail ? undefined : "Le client n'a pas d'adresse email"}
        >
          {pending ? "Envoi…" : "Envoyer au client"}
        </button>
      </form>

      {state?.ok ? <p className="text-xs text-green-700">Devis envoyé à {clientEmail}.</p> : null}
      {state?.error ? (
        <p className="text-xs text-red-600" role="alert">
          {state.error}
        </p>
      ) : null}
      {!clientEmail ? (
        <p className="text-xs text-text-muted">Ajoutez un email au client pour pouvoir envoyer.</p>
      ) : null}
    </div>
  );
}
