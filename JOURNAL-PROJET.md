# Journal du projet — Site vitrine Houel Plombier

Ce document résume, dans l'ordre chronologique, l'ensemble des échanges et décisions prises avec Claude Code pour la création de ce site. Ce n'est pas une transcription mot-à-mot de la conversation (Claude Code ne permet pas d'exporter le fil brut), mais un compte-rendu détaillé de chaque étape, pour que tu puisses t'y retrouver ou reprendre le fil plus tard.

---

## 1. Lancement du projet

Demande initiale : créer un site vitrine pour un plombier (le cousin de l'utilisateur), avec une possible évolution future vers la gestion de devis/planning/facturation.

**Décisions prises (via questions à choix multiples) :**
- Stack : **Next.js (App Router) + Vercel**, choisi pour pouvoir ajouter facilement plus tard des API routes, une base de données, de l'authentification.
- Hébergement/domaine : rien d'existant, à créer de zéro.
- Contenu V1 : niveau « essentiel » — accueil, services, zone d'intervention, contact.
- Identité visuelle : aucune existante au départ → design générique bleu/blanc à personnaliser ensuite.

**Réalisé :**
- Installation de Node.js (absent de la machine) via winget.
- Scaffold du projet avec `create-next-app` (TypeScript, Tailwind CSS v4, App Router, `--src-dir`).
- Dépendances ajoutées : `lucide-react`, `resend`, `zod`, `react-hook-form`, `@hookform/resolvers`.
- Structure : pages Accueil / Services / Zone d'intervention / Contact, composants Header/Footer, formulaire de contact avec API route `/api/contact` (envoi d'email via Resend), SEO de base (sitemap, robots, JSON-LD).

---

## 2. Test en local et débogage réseau

- Test du site en local (`npm run dev`).
- Problème : `localhost` inaccessible sur certains navigateurs mais l'IP locale fonctionnait → diagnostic HSTS (le navigateur forçait `https://localhost` à cause d'un ancien projet).
- Mise en place d'un **tunnel Cloudflare** (`cloudflared tunnel --url http://localhost:3000`) pour accéder au site depuis l'extérieur (notamment iPhone), avec relances régulières au fil des sessions (les tunnels gratuits expirent/changent d'URL à chaque redémarrage).

---

## 3. Informations réelles du client

Au fil des échanges, l'utilisateur a transmis les vraies informations :
- Nom : **Houel Antoine**, plombier chauffagiste, basé à **Noyers-Bocage (14210)**.
- Expérience : chef de chantier puis conducteur de travaux chez **Celfy** (Caen), ~8 ans, avant de reprendre l'entreprise familiale fondée par son père **Olivier Houel**.
- Passion personnelle : course à pied / ultra-trail.
- Zone d'intervention étendue : Noyers-Bocage, Villers-Bocage, Aunay-sur-Odon, Caen.
- Nom final de l'entreprise : **« Houel Plombier »** (pas « Houel Antoine Plomberie »).
- Ajout des services **pompe à chaleur** et **climatisation** en plus de la plomberie/chauffage.

Ces informations ont été intégrées dans `site-config.ts`, la section « À propos », et les métadonnées SEO. Téléphone, email et SIRET définitifs restent en attente (« À renseigner »).

---

## 4. Identité visuelle et design

- Première refonte : palette teal (#0f766e) + orange chaud (#f97316) sur fond ivoire, typographie Plus Jakarta Sans (titres) + Inter (texte), pour sortir du bleu générique initial.
- Logo fourni par l'utilisateur (image clé à molette + goutte d'eau) : détecté comme un fichier WebP renommé en `.png` avec fond blanc plein. Détouré en fond transparent via **ImageMagick** (installé pour l'occasion), intégré au header/footer, et décliné en version blanche pour le mode sombre + favicon adaptatif (fond teal, visible en clair comme en sombre).

---

## 5. Fonctionnalités ajoutées

- Section **« Qui suis-je ? »** racontant le parcours d'Antoine (à la première personne, sur demande explicite de l'utilisateur — pas de discours à la troisième personne).
- Section **« 4 étapes d'une intervention »** puis reformulée plusieurs fois.
- Section **Qualifications** (CAP, attestation fluides frigorigènes, RGE, assurance décennale — exemples génériques marqués comme à confirmer avec Antoine).
- **Mode sombre** : bouton bascule clair/sombre, persistance via `localStorage`, respect de la préférence système, palette adaptée. Un bug de conception a été identifié et corrigé en cours de route (les couleurs personnalisées Tailwind étaient figées au build plutôt que dynamiques — corrigé en passant par des variables CSS indirectes).
- Passe d'accessibilité : anneaux de focus clavier visibles, transitions de couleur, curseurs corrects sur les boutons (absents jusque-là).

---

## 6. Débogage « le bouton ne marche pas »

Investigation en plusieurs étapes :
1. D'abord soupçon d'un bug CSS (résolu).
2. Puis un souci HMR (rechargement à chaud) lié à l'accès via IP locale plutôt que `localhost` → ajout d'`allowedDevOrigins` dans `next.config.ts`.
3. Finalement identifié comme un problème **spécifique à Safari mobile (iPhone) en mode développement** — le mode `next dev` charge de nombreux fichiers JS non optimisés, fragiles sur connexion mobile via tunnel. Solution : basculer sur un **build de production** (`npm run build` + `npm run start`) pour les tests mobiles, bien plus robuste.

---

## 7. Retour en arrière sur les outils

- L'utilisateur a demandé d'arrêter les commits/push automatiques après chaque petite modification (mémorisé comme préférence durable) — désormais, je ne commit/push que sur demande explicite.
- Tentative d'installer un skill externe non reconnu (`ui-ux-pro-max` via un mauvais canal de plugin) → résolu en trouvant que le skill était en réalité déjà disponible nativement.

---

## 8. Passe « moins générique / IA », première itération

Utilisation du skill `ui-ux-pro-max` pour une revue UX, en conservant la palette déjà validée (pas de refonte couleur). Améliorations : focus clavier, transitions, effet de survol léger sur les cartes, micro-interaction sur les liens.

Puis retour utilisateur : *« je n'aime pas trop le visuel, ça fait trop généré par IA, je veux sortir du lot »*. Casse du motif répétitif « carte blanche + icône dans un badge » présent partout (Services, Étapes, Qualifications, À propos) :
- Étapes → gros numéros éditoriaux en filigrane, sans cartes.
- Qualifications → bande unique avec séparateurs, sans cartes.
- À propos → aplat de couleur décalé derrière la photo, highlights bordés d'un trait.
- Cartes Services → icône intégrée au titre plutôt qu'en badge flottant sur la photo.

## 9. Itérations sur le Hero

Plusieurs allers-retours sur la section d'accueil (Hero), chacun suite à un retour direct de l'utilisateur :
1. Version initiale : photo plein cadre + overlay dégradé + texte (jugée trop « template »).
2. Suppression de la photo, fond teal avec formes décoratives (logo en filigrane) → jugé pas assez accrocheur, demande de remettre la photo.
3. Version « split écran » (texte à gauche sur panneau teal, photo à droite, badge flottant « Devis gratuit ») → demande de retirer cette dernière modification.
4. Retour à la version photo plein cadre + overlay.
5. Nouvelle version éditoriale (texte à gauche sur fond clair, photo à droite, sans overlay) → jugée déséquilibrée.
6. Ajustements (hauteur fixe, fond teinté, ratio asymétrique) → toujours pas convaincant, notamment sur mobile.
7. Corrections mobile (padding réduit, titre plus petit, boutons pleine largeur empilés, ratio photo adaptatif) → l'utilisateur n'aime toujours pas le principe « texte à gauche / photo à droite » et laisse carte blanche.
8. **Version actuelle** : structure entièrement différente, empilée (photo pleine largeur en haut façon reportage terrain, bandeau de texte + CTA en dessous sur fond ivoire) — plus simple, plus robuste nativement sur mobile car pas de grille qui bascule entre breakpoints.

## 10. Cahier des charges « moins IA » détaillé

L'utilisateur a fourni un document (`ameliorations_site_moins_IA.md`) très détaillé avec des principes directeurs (« faire moins startup/template/IA, plus artisan sérieux et humain ») et des recommandations précises section par section. Mis en œuvre (priorité 1 et grande partie de la priorité 2) :

- **Services** : remplacement de la grille de cartes par une **liste éditoriale numérotée** (01 — Dépannage, 02 — Chauffage, etc.), composant `ServicesList` créé, `ServiceCard`/`ServicesGrid` supprimés (devenus inutiles).
- **« Notre méthode »** reformulée en langage humain et personnel (« Vous m'appelez. » / « Je viens voir. » / « Je vous explique. » / « On intervient. ») sans cartes ni icônes.
- **Qualifications** simplifiées en liste sobre sans icônes ni cartes.
- **Zone d'intervention** : simple liste texte séparée par des points médians, plutôt que des badges pill colorés.
- **Réalisations** : mise en page asymétrique (une grande photo + petites) plutôt qu'une grille uniforme.
- **Boutons** : coins moins arrondis (`rounded-md` plutôt que `rounded-full`), pour un rendu plus « interface professionnelle » que « bouton pill de landing page ».
- Passage en revue des textes pour retirer les formulations marketing génériques (« expertise », « solutions adaptées », etc.).

**Ce qui reste à faire, dépendant du contenu réel du client (pas réalisable par Claude seul) :**
- Remplacer les photos Unsplash (stock) par de vraies photos de chantiers et d'Antoine.
- Ajouter une phrase personnelle authentique (pas inventée par l'IA) sous le hero.
- Rédiger de vraies descriptions de réalisations/projets terminés.
- Confirmer les qualifications exactes (CAP, RGE, attestation fluides frigorigènes, assurance décennale) et les coordonnées définitives (téléphone, email, SIRET).

---

## 11. Démarrage du back-end (branche `nouveau-visu`)

Décision de construire un back-end : gestion des demandes, devis, planning et facturation, avec un espace d'administration protégé pour Antoine. Trois documents de cadrage ont été créés à la racine : `ARCHITECTURE-BACKEND.md` (plan général, modèle de données, contraintes légales de la facturation), `STACK-ET-OUTILS.md` (référence des technologies), et ce journal.

**Choix validés avec l'utilisateur :**
- Stack : Drizzle ORM + PostgreSQL, sur Next.js/Vercel. En développement, Postgres tourne dans un conteneur **Docker** (installation de Docker Desktop + WSL2 documentée dans `STACK-ET-OUTILS.md`). En production : Supabase (région Europe).
- Connexion à l'admin : **email + mot de passe** (pas de lien magique), un seul compte.
- Tableau de bord d'abord **minimal**, à enrichir plus tard.
- Facturation : solution **maison complète**, factures au format Factur-X, à faire valider par le comptable d'Antoine avant la première facture réelle.
- Régime de TVA d'Antoine : **à confirmer** — le schéma gère les deux cas (franchise en base / réel), paramétrable.
- Le SIRET fourni (39030599300029) est celui du **père** (Olivier Houel, entreprise individuelle) : Antoine aura le sien propre quand il reprendra l'activité.

### Phase 0 réalisée (socle)

- Base de données : 14 tables couvrant les phases 0 à 3, migrations versionnées (`src/lib/db`).
- Authentification : hachage bcrypt, session en base + cookie JWT signé (jose), `proxy.ts` pour la redirection, DAL de vérification. Script `npm run admin:create`.
- Site public déplacé sous le groupe de routes `(site)` pour que l'admin n'hérite pas de son header/footer.
- Espace `/admin` : tableau de bord minimal, écran Paramètres entreprise, CRUD Clients.
- Le formulaire de contact enregistre désormais la demande en base (puis envoie l'email) ; liste `/admin/demandes` avec suivi de statut et notes, création d'un client depuis une demande.

### Phase 1 réalisée (devis)

- **Moteur de calcul** (`src/lib/domain/tva.ts`, `montants.ts`) : HT/TVA/TTC en centimes, TVA arrondie par taux sur base cumulée, gère franchise en base et régime réel. Couvert par des tests (`npm test`, node:test).
- **Numérotation** (`numerotation.ts`) : réservation atomique en transaction, format `D-2026-001`, remise à zéro annuelle des compteurs.
- **Catalogue de prestations** : CRUD `/admin/prestations` (lignes réutilisables).
- **Devis** : éditeur de lignes dynamique (ligne libre ou depuis le catalogue), aperçu live des totaux, recalcul serveur autoritaire, statuts, verrouillage à l'acceptation.
- **PDF** (`@react-pdf/renderer`) : gabarit de devis avec mentions légales (assurance décennale, 293 B / TVA, pénalités), servi par une route authentifiée.
- **Envoi par email** (Resend) avec le PDF en pièce jointe — nécessite un `RESEND_API_KEY` valide (non configuré en dev).
- **Page publique** `/devis/[token]` : le client consulte, télécharge le PDF, accepte (nom + horodatage + IP enregistrés) ou refuse.

### Phase 2 réalisée (planning)

- **Gestion des horaires** (`src/lib/domain/dates.ts`) : conversions entre l'heure « murale » de Paris (saisie/affichage) et l'instant UTC stocké en base, avec prise en compte du passage heure d'été / heure d'hiver. Tests inclus.
- **Interventions** : CRUD, statuts (planifiée / en cours / terminée / annulée), lien optionnel vers un client et un devis.
- **Vue planning** `/admin/planning` : semaine à 7 colonnes, navigation semaine précédente/suivante, jour courant mis en avant.
- **Export `.ics`** (`src/lib/ics.ts`) : téléchargement par intervention (« Ajouter à mon agenda ») et par semaine, pour récupérer les RDV sur le téléphone. Pas de synchronisation bidirectionnelle (choix validé).
- Bouton « Planifier une intervention » depuis un devis ; tableau de bord enrichi.

**Reste pour la mise en production du back-end :** coordonnées légales complètes d'Antoine (SIRET, assurance décennale, IBAN), régime de TVA confirmé, clé Resend + domaine vérifié, domaine + comptes Vercel/Supabase. **Phase 3 (facturation) à venir.**

---

## 12. État actuel du dépôt

- Dépôt GitHub : https://github.com/Macsime14/plombierhouel
- Refonte visuelle **et** back-end en cours sur la branche **`nouveau-visu`** (non fusionnée dans `master`). Le visuel n'est pas encore validé par Antoine.
- `master` reste sur `18a2b2f`.

---

*Document généré automatiquement par Claude Code pour servir de référence. À mettre à jour au fil des prochaines sessions si besoin.*
