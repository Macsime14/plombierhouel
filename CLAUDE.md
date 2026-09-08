@AGENTS.md

## Stack

- **Next.js 16** (App Router) + **TypeScript**
- **PostgreSQL** via **Drizzle ORM** (`src/lib/db/`, migrations versionnées dans
  `src/lib/db/migrations/`). Pas de Prisma.
- **Tailwind CSS v4** — tokens de design dans `src/app/globals.css` (`:root` + `.dark` +
  bloc `@theme inline`).
- Auth admin : email + mot de passe, session cookie signé (`jose`) + table `sessions`.
- PDF : `@react-pdf/renderer`. Emails : `resend`. Validation : `zod`.
- **Dev** : PostgreSQL dans Docker (`docker compose up -d`, voir `compose.yaml`).
- **Prod prévue** : Supabase (base, région UE) + Vercel. Le passage se fait en changeant
  `DATABASE_URL`.
- Tests : `npm test` (node:test via `tsx`), pour les fonctions pures de `src/lib/domain/`.

Docs de référence : `ARCHITECTURE-BACKEND.md`, `STACK-ET-OUTILS.md`, `JOURNAL-PROJET.md`.

## Design

Toujours suivre le brief de design du projet avant de créer ou modifier une page / un
composant visuel :

@docs/brief-design-site-plombier.md

Points clés : éviter le rendu "template IA", palette ancrée dans le métier (eau / cuivre /
inox) et non un choix SaaS, une seule audace visuelle par écran, motion sobre et déclenchée
par l'action.

## Conventions de code

- Composants réutilisables (boutons, cartes, champs de formulaire) définis une seule fois
  (`src/components/`) et réutilisés — voir section 7 du brief.
- Les tokens du brief (couleurs, typo) doivent être implémentés dans `globals.css`, jamais
  en valeurs codées en dur dans les composants.
- Montants stockés en **centimes entiers**, taux de TVA en `numeric(5,2)`, horodatages en
  `timestamptz` (conversions heure de Paris dans `src/lib/domain/dates.ts`).
- Server Actions pour les mutations admin (`src/lib/admin/*-actions.ts`), toujours avec
  `verifierSession()` en tête.
- Accessibilité : focus clavier visible, contrastes suffisants, mobile-first.
- Ne pas commit / push sans demande explicite de l'utilisateur.
