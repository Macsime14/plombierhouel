import { z } from "zod";

import { verifierSession } from "@/lib/auth/dal";
import { genererFacturePdf } from "@/lib/pdf/facture";

export async function GET(_req: Request, ctx: RouteContext<"/admin/factures/[id]/pdf">) {
  await verifierSession();

  const { id } = await ctx.params;
  if (!z.string().uuid().safeParse(id).success) {
    return new Response("Facture introuvable", { status: 404 });
  }

  const res = await genererFacturePdf(id);
  if (!res) return new Response("Facture non émise ou introuvable", { status: 404 });

  return new Response(new Uint8Array(res.buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="Facture-${res.numero}.pdf"`,
    },
  });
}
