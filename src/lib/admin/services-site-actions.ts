"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { and, asc, count, desc, eq, gt, lt, ne } from "drizzle-orm";
import { z } from "zod";

import { verifierSession } from "@/lib/auth/dal";
import { db } from "@/lib/db";
import { servicesSite } from "@/lib/db/schema";
import { slugify } from "@/lib/domain/slug";
import { SERVICES_SITE_DEFAUT } from "@/lib/domain/services-site";

const texteOptionnel = z
  .string()
  .trim()
  .transform((v) => (v.length === 0 ? null : v))
  .nullable();

const schema = z.object({
  titre: z.string().trim().min(2, "Le titre est requis."),
  description: z.string().trim().min(1, "La description est requise."),
  photoUrl: texteOptionnel,
  photoAlt: texteOptionnel,
  actif: z.union([z.literal("on"), z.null(), z.undefined()]).transform((v) => v === "on"),
});

export type ServiceState = { error?: string } | undefined;

/** Slug unique dérivé du titre (suffixe -2, -3… en cas de collision). */
async function slugUnique(titre: string, saufId?: string): Promise<string> {
  const racine = slugify(titre);
  for (let i = 0; i < 50; i++) {
    const candidat = i === 0 ? racine : `${racine}-${i + 1}`;
    const [existe] = await db
      .select({ id: servicesSite.id })
      .from(servicesSite)
      .where(
        saufId
          ? and(eq(servicesSite.slug, candidat), ne(servicesSite.id, saufId))
          : eq(servicesSite.slug, candidat),
      )
      .limit(1);
    if (!existe) return candidat;
  }
  return `${racine}-${Date.now().toString(36)}`;
}

function lire(formData: FormData) {
  return schema.safeParse({
    titre: formData.get("titre"),
    description: formData.get("description") ?? "",
    photoUrl: formData.get("photoUrl") ?? "",
    photoAlt: formData.get("photoAlt") ?? "",
    actif: formData.get("actif"),
  });
}

export async function creerService(_state: ServiceState, formData: FormData): Promise<ServiceState> {
  await verifierSession();
  const parsed = lire(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Champs invalides." };

  const [{ n } = { n: 0 }] = await db.select({ n: count() }).from(servicesSite);

  await db.insert(servicesSite).values({
    slug: await slugUnique(parsed.data.titre),
    titre: parsed.data.titre,
    description: parsed.data.description,
    photoUrl: parsed.data.photoUrl,
    photoAlt: parsed.data.photoAlt,
    actif: parsed.data.actif,
    ordre: n,
  });

  revalidatePath("/", "layout");
  revalidatePath("/admin/site/services");
  redirect("/admin/site/services");
}

export async function modifierService(
  _state: ServiceState,
  formData: FormData,
): Promise<ServiceState> {
  await verifierSession();
  const id = z.string().uuid().safeParse(formData.get("id"));
  if (!id.success) return { error: "Service introuvable." };

  const parsed = lire(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Champs invalides." };

  await db
    .update(servicesSite)
    .set({
      slug: await slugUnique(parsed.data.titre, id.data),
      titre: parsed.data.titre,
      description: parsed.data.description,
      photoUrl: parsed.data.photoUrl,
      photoAlt: parsed.data.photoAlt,
      actif: parsed.data.actif,
      majLe: new Date(),
    })
    .where(eq(servicesSite.id, id.data));

  revalidatePath("/", "layout");
  revalidatePath("/admin/site/services");
  redirect("/admin/site/services");
}

export async function supprimerService(formData: FormData): Promise<void> {
  await verifierSession();
  const id = z.string().uuid().safeParse(formData.get("id"));
  if (!id.success) return;

  await db.delete(servicesSite).where(eq(servicesSite.id, id.data));
  revalidatePath("/", "layout");
  revalidatePath("/admin/site/services");
}

export async function deplacerService(formData: FormData): Promise<void> {
  await verifierSession();
  const id = z.string().uuid().safeParse(formData.get("id"));
  const sens = z.enum(["haut", "bas"]).safeParse(formData.get("sens"));
  if (!id.success || !sens.success) return;

  const [courant] = await db
    .select({ ordre: servicesSite.ordre })
    .from(servicesSite)
    .where(eq(servicesSite.id, id.data))
    .limit(1);
  if (!courant) return;

  const [voisin] = await db
    .select({ id: servicesSite.id, ordre: servicesSite.ordre })
    .from(servicesSite)
    .where(
      sens.data === "haut"
        ? lt(servicesSite.ordre, courant.ordre)
        : gt(servicesSite.ordre, courant.ordre),
    )
    .orderBy(sens.data === "haut" ? desc(servicesSite.ordre) : asc(servicesSite.ordre))
    .limit(1);
  if (!voisin) return;

  await db.transaction(async (tx) => {
    await tx
      .update(servicesSite)
      .set({ ordre: voisin.ordre })
      .where(eq(servicesSite.id, id.data));
    await tx
      .update(servicesSite)
      .set({ ordre: courant.ordre })
      .where(eq(servicesSite.id, voisin.id));
  });

  revalidatePath("/", "layout");
  revalidatePath("/admin/site/services");
}

export async function importerServicesDefaut(): Promise<void> {
  await verifierSession();

  const [{ n } = { n: 0 }] = await db.select({ n: count() }).from(servicesSite);
  if (n > 0) return; // ne rien écraser

  await db.insert(servicesSite).values(
    SERVICES_SITE_DEFAUT.map((s, i) => ({
      slug: s.slug,
      titre: s.titre,
      description: s.description,
      photoUrl: s.photoUrl,
      photoAlt: s.photoAlt,
      ordre: i,
      actif: true,
    })),
  );

  revalidatePath("/", "layout");
  revalidatePath("/admin/site/services");
}
