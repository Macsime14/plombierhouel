import { z } from "zod";

import { verifierSession } from "@/lib/auth/dal";
import { genererDevisPdf } from "@/lib/pdf/devis";

export async function GET(_req: Request, ctx: RouteContext<"/admin/devis/[id]/pdf">) {
  await verifierSession();

  const { id } = await ctx.params;
  if (!z.string().uuid().safeParse(id).success) {
    return new Response("Devis introuvable", { status: 404 });
  }

  const res = await genererDevisPdf(id);
  if (!res) return new Response("Devis introuvable", { status: 404 });

  return new Response(new Uint8Array(res.buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="Devis-${res.numero}.pdf"`,
    },
  });
}
