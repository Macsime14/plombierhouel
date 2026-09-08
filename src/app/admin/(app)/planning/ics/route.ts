import { verifierSession } from "@/lib/auth/dal";
import { interventionsDansPeriode } from "@/lib/admin/interventions-data";
import {
  ajouterJours,
  aujourdhuiParis,
  jourParisVersDate,
  lundiDeLaSemaine,
} from "@/lib/domain/dates";
import { genererIcs } from "@/lib/ics";

const JOUR = /^\d{4}-\d{2}-\d{2}$/;

export async function GET(req: Request) {
  await verifierSession();

  const param = new URL(req.url).searchParams.get("semaine");
  const lundi = lundiDeLaSemaine(param && JOUR.test(param) ? param : aujourdhuiParis());

  const du = jourParisVersDate(lundi);
  const au = jourParisVersDate(ajouterJours(lundi, 7));
  const items = await interventionsDansPeriode(du, au);

  const ics = genererIcs(
    items.map((it) => ({
      uid: `intervention-${it.id}@houel-plombier`,
      debut: it.debut,
      fin: it.fin,
      titre: it.titre,
      lieu: it.adresse,
      description: it.clientNom ? `Client : ${it.clientNom}` : null,
    })),
    { nomCalendrier: `Houel Plombier — semaine du ${lundi}` },
  );

  return new Response(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="planning-${lundi}.ics"`,
    },
  });
}
