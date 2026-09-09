import Link from "next/link";

import { getServicesSiteTous } from "@/lib/domain/services-site";
import {
  deplacerService,
  importerServicesDefaut,
  supprimerService,
} from "@/lib/admin/services-site-actions";
import { Bouton, PageTitre, Statut } from "@/components/admin/ui";

export const metadata = { title: "Services du site" };

export default async function ServicesSitePage() {
  const services = await getServicesSiteTous();

  return (
    <div className="max-w-3xl">
      <Link href="/admin/site" className="text-sm text-text-muted hover:underline">
        ← Contenu du site
      </Link>
      <PageTitre
        titre="Services du site"
        description="La liste affichée sur la page d’accueil et sur /services."
        action={<Bouton href="/admin/site/services/nouveau">+ Nouveau service</Bouton>}
      />

      {services.length === 0 ? (
        <div className="rounded-sm border border-border bg-surface p-4 text-sm">
          <p className="text-text-muted">
            Aucun service enregistré — le site affiche pour l’instant la liste par défaut
            (dépannage, chauffage, pompe à chaleur…).
          </p>
          <form action={importerServicesDefaut} className="mt-3">
            <button
              type="submit"
              className="cursor-pointer rounded-sm border border-border px-3 py-1.5 text-sm hover:border-accent"
            >
              Importer la liste par défaut pour la personnaliser
            </button>
          </form>
        </div>
      ) : (
        <ul className="divide-y divide-border rounded-sm border border-border">
          {services.map((s, i) => (
            <li key={s.id} className="flex items-start gap-3 p-3 text-sm">
              <div className="flex flex-col">
                <form action={deplacerService}>
                  <input type="hidden" name="id" value={s.id} />
                  <input type="hidden" name="sens" value="haut" />
                  <button
                    type="submit"
                    disabled={i === 0}
                    className="cursor-pointer px-1 text-text-muted hover:text-text disabled:opacity-30"
                    aria-label="Monter"
                  >
                    ↑
                  </button>
                </form>
                <form action={deplacerService}>
                  <input type="hidden" name="id" value={s.id} />
                  <input type="hidden" name="sens" value="bas" />
                  <button
                    type="submit"
                    disabled={i === services.length - 1}
                    className="cursor-pointer px-1 text-text-muted hover:text-text disabled:opacity-30"
                    aria-label="Descendre"
                  >
                    ↓
                  </button>
                </form>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/site/services/${s.id}`}
                    className="font-medium hover:underline"
                  >
                    {s.titre}
                  </Link>
                  {!s.actif ? <Statut tone="neutre">Masqué</Statut> : null}
                </div>
                <p className="mt-0.5 line-clamp-2 text-text-muted">{s.description}</p>
              </div>

              <form action={supprimerService}>
                <input type="hidden" name="id" value={s.id} />
                <button
                  type="submit"
                  className="cursor-pointer text-text-muted hover:text-danger"
                  aria-label="Supprimer"
                >
                  ✕
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
