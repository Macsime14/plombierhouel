import { db } from "@/lib/db";
import { devis } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

import { genererDevisPdf } from "@/lib/pdf/devis";

export async function GET(_req: Request, ctx: RouteContext<"/devis/[token]/pdf">) {
  const { token } = await ctx.params;

  const [d] = await db
    .select({ id: devis.id, statut: devis.statut })
    .from(devis)
    .where(eq(devis.tokenPublic, token))
    .limit(1);

  if (!d || d.statut === "brouillon") {
    return new Response("Devis introuvable", { status: 404 });
  }

  const res = await genererDevisPdf(d.id);
  if (!res) return new Response("Devis introuvable", { status: 404 });

  return new Response(new Uint8Array(res.buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="Devis-${res.numero}.pdf"`,
    },
  });
}
