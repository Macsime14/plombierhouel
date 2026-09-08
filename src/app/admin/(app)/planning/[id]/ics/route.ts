import { z } from "zod";

import { verifierSession } from "@/lib/auth/dal";
import { chargerIntervention } from "@/lib/admin/interventions-data";
import { genererIcs } from "@/lib/ics";

export async function GET(_req: Request, ctx: RouteContext<"/admin/planning/[id]/ics">) {
  await verifierSession();

  const { id } = await ctx.params;
  if (!z.string().uuid().safeParse(id).success) {
    return new Response("Introuvable", { status: 404 });
  }

  const data = await chargerIntervention(id);
  if (!data) return new Response("Introuvable", { status: 404 });

  const { intervention: i, client } = data;
  const ics = genererIcs([
    {
      uid: `intervention-${i.id}@houel-plombier`,
      debut: i.debut,
      fin: i.fin,
      titre: i.titre,
      lieu: i.adresse,
      description: [client ? `Client : ${client.nom}` : null, i.notes].filter(Boolean).join("\n") || null,
    },
  ]);

  return new Response(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="intervention-${i.id}.ics"`,
    },
  });
}
