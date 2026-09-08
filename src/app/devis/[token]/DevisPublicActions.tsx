"use client";

import { useActionState } from "react";

import {
  accepterDevis,
  refuserDevis,
  type ReponseDevisState,
} from "@/lib/devis/public-actions";

export function DevisPublicActions({
  token,
  statut,
  expire,
  accepteParNom,
}: {
  token: string;
  statut: string;
  expire: boolean;
  accepteParNom: string | null;
}) {
  const [accState, accAction, accPending] = useActionState<ReponseDevisState, FormData>(
    accepterDevis,
    undefined,
  );
  const [refState, refAction, refPending] = useActionState<ReponseDevisState, FormData>(
    refuserDevis,
    undefined,
  );

  const accepte = statut === "accepte" || accState?.ok === "accepte";
  const refuse = statut === "refuse" || refState?.ok === "refuse";

  if (accepte) {
    return (
      <div className="rounded-lg border border-green-300 bg-green-50 p-4 text-sm text-green-900">
        <p className="font-medium">Devis accepté. Merci !</p>
        <p className="mt-1">
          {accepteParNom ? `Accepté par ${accepteParNom}. ` : ""}
          Nous revenons vers vous pour la suite.
        </p>
      </div>
    );
  }

  if (refuse) {
    return (
      <div className="rounded-lg border border-border bg-surface p-4 text-sm">
        <p className="font-medium">Devis refusé.</p>
        <p className="mt-1 text-text-muted">
          N’hésitez pas à nous contacter si vous souhaitez en discuter.
        </p>
      </div>
    );
  }

  if (expire) {
    return (
      <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
        Ce devis a dépassé sa date de validité. Contactez-nous pour une nouvelle proposition.
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <p className="text-sm font-medium">Votre réponse</p>
      <form action={accAction} className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-end">
        <input type="hidden" name="token" value={token} />
        <div className="flex flex-1 flex-col gap-1">
          <label htmlFor="nom" className="text-xs text-text-muted">
            Nom et prénom (vaut signature « bon pour accord »)
          </label>
          <input
            id="nom"
            name="nom"
            required
            className="rounded-md border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          />
        </div>
        <button
          type="submit"
          disabled={accPending}
          className="cursor-pointer rounded-md bg-accent px-4 py-2 text-sm font-medium text-on-accent hover:opacity-90 disabled:opacity-60"
        >
          {accPending ? "…" : "Accepter le devis"}
        </button>
      </form>
      {accState?.error ? (
        <p className="mt-2 text-sm text-red-600">{accState.error}</p>
      ) : null}

      <form action={refAction} className="mt-3">
        <input type="hidden" name="token" value={token} />
        <button
          type="submit"
          disabled={refPending}
          className="cursor-pointer text-xs text-text-muted underline-offset-2 hover:text-text hover:underline"
        >
          Refuser ce devis
        </button>
      </form>
      {refState?.error ? <p className="mt-2 text-sm text-red-600">{refState.error}</p> : null}
    </div>
  );
}
