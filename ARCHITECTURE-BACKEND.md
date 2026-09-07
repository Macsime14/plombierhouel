# Architecture back-end — Houel Plombier

> Plan de conception. Rien n'est encore codé. Document à faire évoluer au fil des phases.

## 1. Cadrage

| Sujet | Décision | Statut |
|---|---|---|
| Modules | Demandes (light) → Devis → Planning → Facturation | validé |
| Outil existant chez Antoine | aucun | validé |
| Utilisateurs du back-office | Antoine seul | validé |
| Régime TVA d'Antoine | **à confirmer avec lui** — schéma paramétrable pour gérer franchise en base *et* assujetti | ouvert |
| Approche facturation | **complète maison**, avec format Factur-X et branchement PDP prévu pour la réforme B2B | validé |
| Planning sur mobile | export `.ics` par intervention (pas de synchro Google) | validé |
| Catalogue de prestations | dès la phase 1 | validé |
| Infra | Supabase (UE) + Next.js/Vercel — voir §3 | proposé |

Coordonnées entreprise encore manquantes (`site-config.ts`) : téléphone, email, adresse exacte, SIRET, forme juridique, n° TVA intracom, assurance décennale (assureur + n° contrat + zone). **Bloquant pour émettre un vrai devis ou une vraie facture.**

## 2. Facturation : contraintes légales (France, bâtiment)

Comme on part sur une solution **complète maison**, ces règles sont à implémenter, pas à contourner :

- **Numérotation** séquentielle, chronologique, sans rupture. Séquence unique (séries distinctes possibles : `F2026-0001`, `AV2026-0001`).
- **Immutabilité** : une facture émise ne se modifie ni ne se supprime. Correction = **avoir**. → table `avoirs` obligatoire.
- **Mentions obligatoires** (devis *et* factures) : identité + forme juridique + SIRET, adresse, n° TVA intracom, date, numéro, désignation / quantité / unité / PU HT par ligne, taux et montant de TVA par taux, totaux HT / TVA / TTC, conditions et date de règlement, taux des pénalités de retard, indemnité forfaitaire de recouvrement 40 € (client pro), **assurance décennale : nom de l'assureur, coordonnées, couverture géographique**.
- **Devis** : ajouter durée de validité, mention « devis reçu avant exécution des travaux », et pour un particulier démarché le droit de rétractation.
- **Régime TVA** :
  - franchise en base → aucune TVA, mention « TVA non applicable, art. 293 B du CGI » ;
  - assujetti → multi-taux (10 % rénovation logement > 2 ans / 20 % / 5,5 % rénovation énergétique selon cas), et **attestation TVA simplifiée** à joindre côté client pour les taux réduits.
  - Stocké dans `parametres_entreprise.regime_tva`, toute la logique de calcul en dépend.
- **Réforme facturation électronique B2B** (calendrier 2026–2027, à revérifier) : les échanges B2B passent par une **Plateforme de Dématérialisation Partenaire (PDP)**. Conséquence concrète :
  - on génère dès maintenant les factures au format **Factur-X** (PDF/A-3 lisible + XML CII embarqué) → factures déjà conformes au format cible ;
  - l'**envoi via PDP** se fera plus tard par l'API d'un prestataire PDP homologué (service payant) — on ne devient pas PDF soi-même. Module facture isolé pour brancher ce connecteur sans tout réécrire ;
  - le B2C n'est pas concerné par la PDP (mais l'e-reporting des données de transaction, si).
- **Loi anti-fraude TVA 2018** : logiciel « inaltérable, sécurisé, conservé, archivé », justifié par une **attestation éditeur** (qu'on produira nous-mêmes en tant qu'éditeur du logiciel utilisé par Antoine). Prévoir : journal d'événements non modifiable sur les factures, archivage horodaté des PDF.
- **Conservation** : factures 10 ans.

**Garde-fou** : le modèle de facture PDF + le paramétrage TVA doivent être **relus et validés par l'expert-comptable d'Antoine avant la première facture réelle.**

## 3. Infra

**Supabase (région UE) + Next.js sur Vercel.**

| Besoin | Choix | Pourquoi |
|---|---|---|
| Base de données | Postgres managé (Supabase) | relationnel adapté à devis/lignes/factures/paiements/avoirs |
| Accès BDD | Drizzle ORM + drizzle-kit (migrations) | typé, migrations SQL lisibles et versionnées |
| Auth | Supabase Auth, lien magique, allowlist = e-mail d'Antoine uniquement | aucun mot de passe à gérer |
| Fichiers (PDF, photos chantier) | Supabase Storage, buckets **privés**, URL signées | inclus |
| Emails | Resend (déjà en place) | envoi devis / factures / relances |
| PDF | `@react-pdf/renderer` puis surcouche Factur-X (injection XML CII dans le PDF/A-3) | rendu serverless fiable, pas de Chrome headless |
| Signature devis | page publique + acceptation horodatée (nom saisi + IP + timestamp + user-agent, journalisée) | suffisant pour un « bon pour accord » |
| Agenda mobile | génération de fichiers `.ics` par intervention | zéro dépendance externe |

Coût : offres gratuites au démarrage. Alternative sans lock-in Supabase : Neon + Auth.js + Vercel Blob (plus de câblage).

Toutes les données personnelles (clients) restent hébergées dans l'UE → conformité RGPD facilitée. Prévoir une page « politique de confidentialité » et une base légale pour la conservation.

## 4. Modèle de données

```
parametres_entreprise
  raison_sociale, forme_juridique, siret, tva_intracom,
  adresse, iban, bic,
  regime_tva            enum(franchise_base | reel)
  assurance_decennale   { assureur, contrat, zone }
  mentions_devis, mentions_facture, penalites_taux,
  compteur_devis, compteur_facture, compteur_avoir   -- séquences

clients
  id, type enum(particulier | pro),
  nom, email, telephone,
  adresse_facturation, adresse_chantier,
  siret?, tva_intracom?, notes, cree_le

demandes                         -- issu du formulaire de contact
  id, client_id?, nom, email, telephone, type_besoin, message,
  statut enum(nouveau | a_rappeler | devis_envoye | gagne | perdu),
  notes, source, cree_le

prestations                      -- catalogue réutilisable (phase 1)
  id, libelle, description?, unite, prix_unitaire_ht, taux_tva, actif

devis
  id, numero, client_id, demande_id?,
  date, validite_jours,
  statut enum(brouillon | envoye | vu | accepte | refuse | expire),
  total_ht, total_tva, total_ttc, tva_par_taux (jsonb),
  conditions, mentions_figees (jsonb),
  token_public, envoye_le, vu_le, accepte_le, accepte_par (jsonb), refuse_le
devis_lignes
  id, devis_id, ordre, prestation_id?,
  designation, quantite, unite, pu_ht, taux_tva, remise_pct?,
  total_ligne_ht

interventions                    -- planning
  id, client_id, devis_id?,
  debut, fin, adresse,
  statut enum(planifie | en_cours | termine | annule),
  titre, notes, cree_le

factures
  id, numero,                    -- séquentiel strict
  devis_id?, client_id,
  date_emission, date_echeance,
  statut enum(brouillon | emise | payee_partiel | payee | annulee),
  total_ht, total_tva, total_ttc, tva_par_taux (jsonb),
  lignes_figees (jsonb), mentions_figees (jsonb),  -- snapshot au moment de l'émission
  pdf_path, facturx_path, emise_le
facture_lignes                   -- copie figée (pas de FK vers prestations)
  id, facture_id, ordre, designation, quantite, unite, pu_ht, taux_tva, total_ligne_ht

avoirs
  id, numero, facture_id, date, montant_ht, montant_ttc, motif, pdf_path

paiements
  id, facture_id, date, montant, moyen enum(virement | cheque | especes | cb | autre), reference?

facture_journal                  -- append-only, pour l'inaltérabilité
  id, facture_id, evenement, payload (jsonb), horodatage, hash_precedent, hash
```

Règles :
- une **facture émise** fige ses lignes et ses mentions (copie JSON), plus rien ne bouge ;
- toute action sur une facture émise écrit une ligne dans `facture_journal` (chaînage par hash) ;
- la numérotation passe par une fonction qui incrémente `compteur_*` de façon atomique (transaction / `SELECT ... FOR UPDATE`).

## 5. Phases

| Phase | Contenu | Critère de fin |
|---|---|---|
| **0 — Socle** | Supabase + Drizzle + migrations ; auth admin (lien magique, allowlist) ; layout `/admin` responsive ; `parametres_entreprise` (formulaire) ; CRUD `clients` ; `POST /api/contact` écrit dans `demandes` **et** garde l'email ; liste des demandes avec changement de statut + notes | Antoine se connecte, configure son entreprise, voit et qualifie ses demandes |
| **1 — Devis** | Catalogue `prestations` (CRUD) ; création devis (lignes libres ou depuis catalogue) ; moteur de calcul TVA (les deux régimes) isolé et testé ; PDF devis ; envoi Resend ; page publique `/devis/[token]` (voir + accepter/refuser, horodatage) ; passage auto en `expire` | Un devis complet du brouillon à l'accepté, PDF conforme aux mentions |
| **2 — Planning** | Agenda vue semaine + jour ; créer une intervention depuis un devis accepté ou une demande ; statuts ; export `.ics` par intervention et par semaine | Antoine gère ses RDV et les ajoute à son téléphone |
| **3 — Facturation** | Facture depuis devis accepté (report des lignes) ; numérotation séquentielle atomique ; émission = fige + journalise ; PDF **Factur-X** ; suivi des paiements (partiel/total) ; avoirs ; **export comptable** (CSV puis FEC) ; attestation éditeur (doc) | Cycle complet devis → facture → encaissement, validé par le comptable |
| **4 — Confort** | Tableau de bord (CA encaissé/à venir, devis en attente, impayés + relances) ; relances e-mail automatiques (devis sans réponse, facture échue) ; recherche globale ; connecteur PDP (quand prestataire choisi) | — |

## 6. Arborescence

```
src/
  app/
    admin/
      layout.tsx                 ← garde d'auth
      page.tsx                   ← tableau de bord
      demandes/  clients/  prestations/  devis/  planning/  factures/  parametres/
    devis/[token]/page.tsx       ← page publique d'acceptation
    api/
      contact/route.ts           ← modifié (DB + email)
      ics/[interventionId]/route.ts
      cron/relances/route.ts     ← Vercel Cron (phase 4)
  lib/
    db/
      client.ts  schema.ts  migrations/
    auth/
      guard.ts  session.ts
    domain/                      ← pur, testé unitairement
      tva.ts  numerotation.ts  devis.ts  facture.ts
    pdf/
      DevisDocument.tsx  FactureDocument.tsx  facturx.ts
    email/
      sendContactEmail.ts  sendDevis.ts  sendFacture.ts  sendRelance.ts
    data/                        ← inchangé (contenu statique du site vitrine)
```

## 7. Questions encore ouvertes

1. **Régime TVA d'Antoine** — franchise en base ou réel ? (à confirmer avec lui / son comptable)
2. **Coordonnées légales complètes** — SIRET, forme juridique, TVA intracom, assurance décennale (assureur + contrat + zone), IBAN.
3. **Prestataire PDP** — à choisir plus tard pour la réforme B2B (aucun impact sur les phases 0–3 si on produit du Factur-X dès la phase 3).
4. **Domaine + comptes** — le domaine définitif, le compte Vercel, le projet Supabase : qui les crée (toi) et quand.
5. **Sauvegardes / RGPD** — politique de confidentialité à ajouter au site, durée de conservation des données clients, procédure d'export/suppression sur demande.
