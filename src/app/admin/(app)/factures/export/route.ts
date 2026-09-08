import { asc, eq, sum } from "drizzle-orm";

import { verifierSession } from "@/lib/auth/dal";
import { db } from "@/lib/db";
import { clients, factures, paiements } from "@/lib/db/schema";
import { aujourdhuiParis } from "@/lib/domain/dates";

const dateFmt = new Intl.DateTimeFormat("fr-FR", { dateStyle: "short", timeZone: "Europe/Paris" });
const euros = (cents: number) => (cents / 100).toFixed(2).replace(".", ",");

function champ(v: string | null | undefined): string {
  const s = v ?? "";
  return /[";\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export async function GET() {
  await verifierSession();

  const rows = await db
    .select({
      numero: factures.numero,
      dateEmission: factures.dateEmission,
      dateEcheance: factures.dateEcheance,
      statut: factures.statut,
      totalHtCents: factures.totalHtCents,
      totalTvaCents: factures.totalTvaCents,
      totalTtcCents: factures.totalTtcCents,
      clientNom: clients.nom,
      clientSiret: clients.siret,
      encaisse: sum(paiements.montantCents),
    })
    .from(factures)
    .leftJoin(clients, eq(factures.clientId, clients.id))
    .leftJoin(paiements, eq(paiements.factureId, factures.id))
    .groupBy(factures.id, clients.nom, clients.siret)
    .orderBy(asc(factures.numero));

  const entete = [
    "Numéro",
    "Date",
    "Échéance",
    "Client",
    "SIRET client",
    "Total HT",
    "Total TVA",
    "Total TTC",
    "Encaissé",
    "Reste",
    "Statut",
  ].join(";");

  const lignes = rows
    .filter((r) => r.numero)
    .map((r) => {
      const encaisse = Number(r.encaisse ?? 0);
      return [
        champ(r.numero),
        dateFmt.format(r.dateEmission),
        r.dateEcheance ? dateFmt.format(r.dateEcheance) : "",
        champ(r.clientNom),
        champ(r.clientSiret),
        euros(r.totalHtCents),
        euros(r.totalTvaCents),
        euros(r.totalTtcCents),
        euros(encaisse),
        euros(Math.max(0, r.totalTtcCents - encaisse)),
        r.statut,
      ].join(";");
    });

  const csv = "﻿" + [entete, ...lignes].join("\r\n") + "\r\n";

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="factures-${aujourdhuiParis()}.csv"`,
    },
  });
}
