"use client";

import { useActionState } from "react";

import { enregistrerNotesDemande, type NotesState } from "@/lib/admin/demandes-actions";

export function NotesForm({ id, notes }: { id: string; notes: string | null }) {
  const [state, action, pending] = useActionState<NotesState, FormData>(
    enregistrerNotesDemande,
    undefined,
  );

  return (
    <form action={action} className="flex flex-col gap-2">
      <input type="hidden" name="id" value={id} />
      <label htmlFor="notes" className="text-sm font-medium">
        Notes internes
      </label>
      <textarea
        id="notes"
        name="notes"
        rows={4}
        defaultValue={notes ?? ""}
        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      />
      <div className="flex items-center gap-3">
        <button
          type="submit"
          className="cursor-pointer rounded-md border border-border px-3 py-1.5 text-sm hover:border-accent disabled:opacity-60"
          disabled={pending}
        >
          {pending ? "Enregistrement…" : "Enregistrer les notes"}
        </button>
        {state?.ok ? <span className="text-sm text-green-700">Enregistré.</span> : null}
        {state?.error ? <span className="text-sm text-red-600">{state.error}</span> : null}
      </div>
    </form>
  );
}
