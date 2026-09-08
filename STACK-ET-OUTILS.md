# Stack, outils et concepts — Site Houel Plombier

> Document de référence pour comprendre **quoi** on utilise, **pourquoi**, et **comment**.
> À lire dans l'ordre ou à consulter par section. Mis à jour au fil du projet.

---

## Vue d'ensemble en une phrase

Un site web construit avec **Next.js** (framework React), hébergé sur **Vercel**, avec un
back-end qui parle à une base de données **PostgreSQL** — en local via **Docker** pendant le
développement, puis hébergée (**Supabase**) en production.

---

## 1. Le socle : langages et exécution

### JavaScript / TypeScript
- **JavaScript** : le langage du web, exécuté par les navigateurs.
- **TypeScript** : du JavaScript + un système de **types**. On écrit `age: number` et l'éditeur
  refuse `age = "trente"` avant même de lancer le code. Ça attrape une grande partie des bugs
  à l'écriture. Les fichiers `.ts` / `.tsx` sont convertis en `.js` pour tourner.
- Config dans `tsconfig.json`.

### Node.js
- Un moteur qui exécute du JavaScript **en dehors du navigateur** (sur un serveur, sur ta
  machine). C'est ce qui fait tourner Next.js, les scripts, les outils.
- Version utilisée : **24.x** (Next 16 exige au minimum Node 20.9).
- Installé à l'époque via `winget`.

### npm
- Le **gestionnaire de paquets** de Node. `npm install` lit `package.json`, télécharge les
  bibliothèques (dans `node_modules/`) et fige les versions exactes dans `package-lock.json`.
- Commandes du projet (définies dans `package.json` → `scripts`) :
  - `npm run dev` — serveur de développement (rechargement à chaud)
  - `npm run build` — construit la version optimisée pour la production
  - `npm run start` — sert la version construite
  - `npm run lint` — vérifie le style / les erreurs du code

---

## 2. Le front-end (ce que voit le visiteur)

### React 19
- Bibliothèque pour construire des interfaces à partir de **composants** : des briques
  réutilisables (`<Header />`, `<ContactForm />`) qui décrivent un morceau d'écran.
- On décrit **ce qu'on veut afficher** selon les données ; React se charge de mettre à jour
  le DOM (la page réelle) quand les données changent.

### Next.js 16 (framework)
- Une couche au-dessus de React qui apporte tout ce qui manque pour un vrai site :
  - **Routing par fichiers** : `src/app/contact/page.tsx` → la page `/contact`. Pas de config.
  - **Server Components** : par défaut, les composants s'exécutent **sur le serveur**, le
    navigateur ne reçoit que du HTML. Plus rapide, meilleur SEO, et on peut parler
    directement à la base de données depuis un composant.
  - **Client Components** : les fichiers marqués `"use client"` s'exécutent aussi dans le
    navigateur (nécessaire dès qu'il y a de l'interactivité : clic, saisie, état).
  - **Route Handlers** : `src/app/api/.../route.ts` → des points d'entrée HTTP (notre
    `/api/contact` par exemple). L'équivalent d'une mini-API.
  - **Server Actions** : des fonctions serveur appelées directement depuis un formulaire,
    sans écrire d'API à la main. C'est ce qu'on utilisera pour les écrans d'admin.
  - **Optimisations automatiques** : images, polices, découpage du JavaScript, cache.
- ⚠️ **Cette version (16) a des changements cassants** par rapport aux versions connues. Le
  fichier `AGENTS.md` impose de lire les guides dans `node_modules/next/dist/docs/` avant
  d'écrire du code. Points notables de la v16 :
  - `cookies()`, `headers()`, `params` sont désormais **asynchrones** (`await`).
  - Le fichier `middleware.ts` est renommé **`proxy.ts`**.
  - **Turbopack** (compilateur rapide) est activé par défaut.

### Tailwind CSS v4
- Une façon d'écrire le style directement dans le HTML avec des petites classes utilitaires :
  `class="flex items-center gap-4 text-lg font-semibold"` au lieu d'un fichier CSS séparé.
- Rapide à écrire, cohérent, et le CSS final ne contient que ce qui est réellement utilisé.
- Config : `postcss.config.mjs` + le dossier `design-system/`.

### lucide-react
- Une collection d'**icônes** sous forme de composants React (`<Phone />`, `<Wrench />`).

### react-hook-form + @hookform/resolvers
- Gestion des **formulaires** côté navigateur : suivi des champs, validation, messages
  d'erreur, état d'envoi. Le `resolver` fait le pont avec Zod pour valider avec le même
  schéma que le serveur.

---

## 3. Le back-end (la logique serveur et les données)

### Zod
- Bibliothèque de **validation de données**. On décrit la forme attendue
  (`{ email: z.string().email(), message: z.string().min(10) }`) et Zod vérifie à l'exécution
  que les données reçues correspondent. Utilisé pour valider ce que le visiteur envoie.
- Bonus : le type TypeScript est déduit automatiquement du schéma.

### Resend
- Service d'**envoi d'e-mails** transactionnels (confirmation, notification…). Utilisé
  aujourd'hui pour envoyer la demande de contact par mail au plombier.
- En développement : expéditeur de test `onboarding@resend.dev` (n'envoie qu'au titulaire du
  compte). En production : il faudra vérifier un vrai domaine.
- Clé secrète dans `.env.local` (`RESEND_API_KEY`).

### PostgreSQL 17 (« Postgres »)
- La **base de données** : elle stocke durablement les demandes, clients, devis, factures…
- Base **relationnelle** : les données sont organisées en tables liées entre elles
  (un devis appartient à un client, une facture découle d'un devis…). Langage : SQL.
- Choisie parce qu'elle est robuste, standard, et hébergeable partout à l'identique.

### Drizzle ORM
- Un **ORM** = une couche qui permet de manipuler la base en écrivant du TypeScript plutôt
  que du SQL brut : `db.select().from(clients)` au lieu de `SELECT * FROM clients`.
- Avantages : c'est typé (l'éditeur connaît les colonnes), et `drizzle-kit` génère les
  **migrations** — des fichiers SQL versionnés qui font évoluer la structure de la base de
  façon reproductible (en dev comme en prod).

### postgres (postgres.js)
- Le **driver** : la petite bibliothèque bas niveau qui ouvre la connexion réseau à Postgres.
  Drizzle s'appuie dessus.

### jose
- Bibliothèque pour créer et vérifier des **JWT** (jetons signés). Gère la **session** de
  connexion à l'espace d'administration : un cookie signé (`houel_session`) que le serveur
  vérifie à chaque requête, adossé à une table `sessions` pour pouvoir révoquer.

### bcryptjs
- Hachage des mots de passe (jamais stockés en clair). Utilisé au login et par le script
  `npm run admin:create`.

### @react-pdf/renderer
- Génère les PDF (devis, plus tard factures) **côté serveur**, à partir de composants React
  dédiés (`src/lib/pdf/`). Rendu fiable sans navigateur headless. Les PDF sont produits à la
  volée par des routes (`/admin/devis/[id]/pdf`, `/devis/[token]/pdf`).

### node:test + tsx
- Les fonctions de calcul pures (`src/lib/domain/`) sont testées avec le lanceur de tests
  intégré à Node, exécuté en TypeScript via `tsx`. Commande : `npm test`.

### Migrations Drizzle
- `npm run db:generate` compare le schéma (`src/lib/db/schema.ts`) à l'état précédent et
  écrit un fichier SQL dans `src/lib/db/migrations/`. `npm run db:migrate` applique les
  fichiers en attente. Ces fichiers sont versionnés dans Git : la structure de la base se
  reconstruit à l'identique partout.

---

## 4. Docker et WSL (l'environnement de la base en local)

### Le problème résolu
On veut une vraie base Postgres sur la machine de dev, **sans** l'installer en dur dans
Windows (service système, config éparpillée, désinstallation pénible). Solution : la faire
tourner dans un **conteneur** jetable.

### Docker
- Fait tourner un logiciel dans une **boîte isolée** (conteneur) qui embarque sa version, ses
  dépendances et sa config. Léger (contrairement à une machine virtuelle complète) car il
  partage le noyau du système hôte.
- **Docker Desktop** = l'application Windows (icône baleine) qui pilote tout ça et fournit la
  commande `docker` dans le terminal.
- **Image** = le modèle figé (`postgres:17-alpine`). **Conteneur** = une instance qui tourne.
  **Volume** = un espace de stockage qui survit à l'arrêt du conteneur (nos données y sont).

### Pourquoi WSL est nécessaire
Les conteneurs Docker sont une **technologie Linux** : ils utilisent des mécanismes du noyau
Linux qui n'existent pas dans Windows. Il faut donc un noyau Linux quelque part.
**WSL2** (*Windows Subsystem for Linux 2*) fournit exactement ça : un noyau Linux léger que
Windows fait tourner à côté de lui.

```
Windows
  └─ WSL2                      (fournit le noyau Linux)
       └─ Docker Engine        (le vrai moteur, dans une distro "docker-desktop")
            └─ conteneur postgres:17-alpine   (notre base "houel_db")
```

Docker Desktop refusait de démarrer (« WSL not installed ») tant qu'il n'avait pas ce noyau.

### Ce qui a été installé
| Étape | Commande / action | Rôle |
|---|---|---|
| 1 | `winget install Docker.DockerDesktop` | L'appli Docker + la CLI |
| 2 | `wsl --install --no-distribution` *(PowerShell admin)* | Le noyau Linux. `--no-distribution` : pas d'Ubuntu, Docker crée sa propre mini-distro |
| 3 | Redémarrage du PC | WSL active des fonctionnalités Windows (Virtual Machine Platform) |
| 4 | Lancer Docker Desktop | Démarre le moteur → « Engine running » |
| 5 | `docker compose up -d` | Crée et démarre le conteneur Postgres |

### Fichiers du projet liés à Docker
- **`compose.yaml`** — la recette du conteneur : image `postgres:17-alpine`, identifiants
  (`houel` / `houel_dev_pwd`, base `houel_dev`), port `5432`, volume `houel_pgdata`,
  healthcheck.
- **`.env.local`** (non versionné) / **`.env.example`** — la variable
  `DATABASE_URL=postgresql://houel:houel_dev_pwd@localhost:5432/houel_dev` : l'adresse que
  l'application utilise pour joindre la base.

### Commandes du quotidien
```bash
docker compose up -d      # démarrer la base (début de session de dev)
docker compose ps         # vérifier qu'elle tourne
docker compose down       # arrêter (les données restent dans le volume)
docker compose down -v    # arrêter ET tout effacer (repartir de zéro)
docker compose logs -f db # voir les logs de la base
```

### Le passage à la prod
Ce Postgres local ne sert qu'au développement. En production la base sera hébergée
(**Supabase**, région Europe). Le basculement = **changer `DATABASE_URL`**, rien d'autre :
c'est le même Postgres des deux côtés.

---

## 5. Hébergement et déploiement

### Vercel
- La plateforme d'hébergement, faite par les créateurs de Next.js. Un `git push` déclenche
  un build et une mise en ligne automatiques. Gère les URLs, le HTTPS, le CDN, les fonctions
  serveur.

### Supabase *(prévu pour la prod)*
- Un « Postgres hébergé, avec des extras » : base de données + authentification + stockage de
  fichiers (PDF, photos) + API, dans une seule offre. Généreux en gratuit. Région Europe pour
  le RGPD.

---

## 6. Outils de développement

### Git + GitHub
- **Git** : historique de versions du code, en local. On travaille sur des **branches**
  (`nouveau-visu`, `master`…) puis on fusionne.
- **GitHub** : la copie du dépôt en ligne (`github.com/Macsime14/plombierhouel`),
  sauvegarde + collaboration + point de départ des déploiements Vercel.
- Préférence du projet : **pas de commit/push automatique** — uniquement sur demande.

### ESLint
- Analyse le code pour repérer erreurs probables et incohérences de style. Config :
  `eslint.config.mjs` (format « flat config », nouveau standard).

### winget
- Le gestionnaire de paquets **de Windows** (comme un app store en ligne de commande). Utilisé
  pour installer Node.js, Docker Desktop, etc.

### VS Code / éditeur + Claude Code
- L'éditeur de code. **Claude Code** = l'assistant IA en ligne de commande utilisé pour
  développer ce projet (avec le journal dans `JOURNAL-PROJET.md`).

---

## 7. Les fichiers de configuration à la racine

| Fichier | Rôle |
|---|---|
| `package.json` | Dépendances + scripts npm |
| `package-lock.json` | Versions exactes figées |
| `tsconfig.json` | Config TypeScript |
| `next.config.ts` | Config Next.js |
| `postcss.config.mjs` | Config Tailwind / PostCSS |
| `eslint.config.mjs` | Config ESLint |
| `compose.yaml` | Config du conteneur Postgres (Docker) |
| `drizzle.config.ts` | Config des migrations Drizzle |
| `src/proxy.ts` | Redirection des routes `/admin` non authentifiées (ex-`middleware`) |
| `scripts/create-admin.ts` | Création du compte administrateur (`npm run admin:create`) |
| `.env.local` | Secrets locaux (**jamais** committé) |
| `.env.example` | Modèle des variables d'environnement (committé, sans valeurs secrètes) |
| `.gitignore` | Ce que Git doit ignorer (`node_modules`, `.next`, `.env*`…) |
| `AGENTS.md` / `CLAUDE.md` | Instructions pour les assistants IA |
| `JOURNAL-PROJET.md` | Historique des décisions du projet |
| `ARCHITECTURE-BACKEND.md` | Plan d'architecture du back-end |
| `STACK-ET-OUTILS.md` | Ce document |

---

## 8. Comment tout s'emboîte (le trajet d'une donnée)

Exemple : un visiteur remplit le formulaire de contact.

1. **Navigateur** : `ContactForm` (Client Component) — `react-hook-form` suit la saisie,
   **Zod** valide côté client.
2. Envoi HTTP vers **`/api/contact/route.ts`** (Route Handler, côté serveur Next.js).
3. Le serveur **revalide avec Zod** (ne jamais faire confiance au navigateur).
4. *(phase 0)* Écriture dans la table `demandes` de **PostgreSQL**, via **Drizzle**.
5. Envoi d'un e-mail de notification via **Resend**.
6. Réponse au navigateur → message de confirmation.
7. Plus tard, Antoine se connecte à **`/admin`** (session **jose**), voit la demande, la
   qualifie, en fait un devis, etc.

En développement, l'étape 4 tape sur le **Postgres dans Docker** ; en production, sur le
**Postgres de Supabase**. Le code est le même.

---

## 9. Glossaire express

- **Framework** : boîte à outils structurante (Next.js) ; **bibliothèque** : outil ponctuel (Zod).
- **Front-end** : ce qui tourne côté navigateur. **Back-end** : ce qui tourne côté serveur.
- **Serveur** : programme qui répond aux requêtes ; ici, du code Next.js sur Vercel.
- **API / endpoint** : une adresse que le code appelle pour lire/écrire des données.
- **ORM** : traducteur entre le code (objets) et la base (tables SQL).
- **Migration** : fichier qui décrit un changement de structure de la base, rejouable.
- **Conteneur** : logiciel empaqueté et isolé, exécuté par Docker.
- **Image** : le modèle figé dont on instancie un conteneur.
- **Volume** : stockage persistant d'un conteneur.
- **Variable d'environnement** : réglage/secret fourni au programme au lancement (`.env`).
- **JWT** : jeton signé prouvant une identité/session sans requête base à chaque fois.
- **Build** : transformation du code source en version optimisée prête à servir.
- **Déploiement** : mise en ligne d'une version.
- **SEO** : optimisation pour le référencement dans les moteurs de recherche.
- **RGPD** : réglementation européenne sur les données personnelles.
