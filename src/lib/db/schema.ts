/**
 * Schéma de la base de données (Drizzle ORM).
 *
 * Conventions :
 * - Tous les montants sont stockés en **centimes entiers** (`bigint` mode number) pour éviter
 *   les erreurs d'arrondi des flottants. 1234 = 12,34 €.
 * - Les taux de TVA sont stockés en pourcentage : `numeric(5,2)` → 20.00, 10.00, 5.50.
 * - Les quantités peuvent être fractionnaires : `numeric(10,3)` → 2.500 h, 3.250 m.
 * - Horodatages en `timestamptz` (avec fuseau).
 * - `casing: "snake_case"` dans drizzle.config.ts → les colonnes camelCase deviennent snake_case en base.
 */
import {
  bigint,
  boolean,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

/* ------------------------------------------------------------------ */
/* Enums                                                               */
/* ------------------------------------------------------------------ */

export const regimeTvaEnum = pgEnum("regime_tva", ["franchise_base", "reel"]);
export const clientTypeEnum = pgEnum("client_type", ["particulier", "pro"]);
export const demandeStatutEnum = pgEnum("demande_statut", [
  "nouveau",
  "a_rappeler",
  "devis_envoye",
  "gagne",
  "perdu",
]);
export const devisStatutEnum = pgEnum("devis_statut", [
  "brouillon",
  "envoye",
  "vu",
  "accepte",
  "refuse",
  "expire",
]);
export const interventionStatutEnum = pgEnum("intervention_statut", [
  "planifie",
  "en_cours",
  "termine",
  "annule",
]);
export const factureStatutEnum = pgEnum("facture_statut", [
  "brouillon",
  "emise",
  "payee_partiel",
  "payee",
  "annulee",
]);
export const paiementMoyenEnum = pgEnum("paiement_moyen", [
  "virement",
  "cheque",
  "especes",
  "cb",
  "autre",
]);

/* ------------------------------------------------------------------ */
/* Authentification (phase 0)                                          */
/* ------------------------------------------------------------------ */

export const utilisateurs = pgTable("utilisateurs", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  motDePasseHash: text("mot_de_passe_hash").notNull(),
  nom: text("nom"),
  creeLe: timestamp("cree_le", { withTimezone: true }).notNull().defaultNow(),
});

export const sessions = pgTable("sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  utilisateurId: uuid("utilisateur_id")
    .notNull()
    .references(() => utilisateurs.id, { onDelete: "cascade" }),
  expireLe: timestamp("expire_le", { withTimezone: true }).notNull(),
  creeLe: timestamp("cree_le", { withTimezone: true }).notNull().defaultNow(),
});

/* ------------------------------------------------------------------ */
/* Paramètres de l'entreprise (phase 0) — table à une seule ligne      */
/* ------------------------------------------------------------------ */

export const parametresEntreprise = pgTable("parametres_entreprise", {
  id: integer("id").primaryKey().default(1),
  raisonSociale: text("raison_sociale"),
  formeJuridique: text("forme_juridique"),
  siret: text("siret"),
  tvaIntracom: text("tva_intracom"),
  adresse: text("adresse"),
  codePostal: text("code_postal"),
  ville: text("ville"),
  telephone: text("telephone"),
  email: text("email"),
  iban: text("iban"),
  bic: text("bic"),
  regimeTva: regimeTvaEnum("regime_tva").notNull().default("reel"),
  assuranceDecennaleAssureur: text("assurance_decennale_assureur"),
  assuranceDecennaleContrat: text("assurance_decennale_contrat"),
  assuranceDecennaleZone: text("assurance_decennale_zone"),
  mentionsDevis: text("mentions_devis"),
  mentionsFacture: text("mentions_facture"),
  penalitesRetardTaux: numeric("penalites_retard_taux", { precision: 5, scale: 2 }),
  // Compteurs de numérotation (remis à zéro chaque année civile).
  anneeCompteurs: integer("annee_compteurs").notNull().default(0),
  compteurDevis: integer("compteur_devis").notNull().default(0),
  compteurFacture: integer("compteur_facture").notNull().default(0),
  compteurAvoir: integer("compteur_avoir").notNull().default(0),
  majLe: timestamp("maj_le", { withTimezone: true }).notNull().defaultNow(),
});

/* ------------------------------------------------------------------ */
/* Clients (phase 0)                                                   */
/* ------------------------------------------------------------------ */

export const clients = pgTable("clients", {
  id: uuid("id").primaryKey().defaultRandom(),
  type: clientTypeEnum("type").notNull().default("particulier"),
  nom: text("nom").notNull(),
  email: text("email"),
  telephone: text("telephone"),
  adresseFacturation: text("adresse_facturation"),
  codePostalFacturation: text("code_postal_facturation"),
  villeFacturation: text("ville_facturation"),
  adresseChantier: text("adresse_chantier"),
  codePostalChantier: text("code_postal_chantier"),
  villeChantier: text("ville_chantier"),
  siret: text("siret"),
  tvaIntracom: text("tva_intracom"),
  notes: text("notes"),
  creeLe: timestamp("cree_le", { withTimezone: true }).notNull().defaultNow(),
  majLe: timestamp("maj_le", { withTimezone: true }).notNull().defaultNow(),
});

/* ------------------------------------------------------------------ */
/* Demandes de contact (phase 0)                                       */
/* ------------------------------------------------------------------ */

export const demandes = pgTable("demandes", {
  id: uuid("id").primaryKey().defaultRandom(),
  clientId: uuid("client_id").references(() => clients.id, { onDelete: "set null" }),
  nom: text("nom").notNull(),
  email: text("email").notNull(),
  telephone: text("telephone").notNull(),
  typeBesoin: text("type_besoin").notNull(),
  message: text("message").notNull(),
  statut: demandeStatutEnum("statut").notNull().default("nouveau"),
  notes: text("notes"),
  source: text("source").notNull().default("formulaire_site"),
  creeLe: timestamp("cree_le", { withTimezone: true }).notNull().defaultNow(),
  traiteeLe: timestamp("traitee_le", { withTimezone: true }),
});

/* ------------------------------------------------------------------ */
/* Catalogue de prestations (phase 1)                                  */
/* ------------------------------------------------------------------ */

export const prestations = pgTable("prestations", {
  id: uuid("id").primaryKey().defaultRandom(),
  libelle: text("libelle").notNull(),
  description: text("description"),
  unite: text("unite").notNull().default("u"),
  puCents: bigint("pu_cents", { mode: "number" }).notNull().default(0),
  tauxTva: numeric("taux_tva", { precision: 5, scale: 2 }).notNull().default("20.00"),
  actif: boolean("actif").notNull().default(true),
  creeLe: timestamp("cree_le", { withTimezone: true }).notNull().defaultNow(),
});

/* ------------------------------------------------------------------ */
/* Devis (phase 1)                                                     */
/* ------------------------------------------------------------------ */

export const devis = pgTable(
  "devis",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    numero: text("numero").notNull(),
    clientId: uuid("client_id")
      .notNull()
      .references(() => clients.id, { onDelete: "restrict" }),
    demandeId: uuid("demande_id").references(() => demandes.id, { onDelete: "set null" }),
    dateEmission: timestamp("date_emission", { withTimezone: true }).notNull().defaultNow(),
    validiteJours: integer("validite_jours").notNull().default(30),
    statut: devisStatutEnum("statut").notNull().default("brouillon"),
    totalHtCents: bigint("total_ht_cents", { mode: "number" }).notNull().default(0),
    totalTvaCents: bigint("total_tva_cents", { mode: "number" }).notNull().default(0),
    totalTtcCents: bigint("total_ttc_cents", { mode: "number" }).notNull().default(0),
    // { "20.00": { htCents, tvaCents }, "10.00": { ... } }
    tvaParTaux: jsonb("tva_par_taux").notNull().default({}),
    conditions: text("conditions"),
    notesInternes: text("notes_internes"),
    tokenPublic: text("token_public").notNull(),
    envoyeLe: timestamp("envoye_le", { withTimezone: true }),
    vuLe: timestamp("vu_le", { withTimezone: true }),
    accepteLe: timestamp("accepte_le", { withTimezone: true }),
    accepteParNom: text("accepte_par_nom"),
    accepteParIp: text("accepte_par_ip"),
    refuseLe: timestamp("refuse_le", { withTimezone: true }),
    creeLe: timestamp("cree_le", { withTimezone: true }).notNull().defaultNow(),
    majLe: timestamp("maj_le", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("devis_numero_key").on(t.numero),
    uniqueIndex("devis_token_public_key").on(t.tokenPublic),
  ],
);

export const devisLignes = pgTable("devis_lignes", {
  id: uuid("id").primaryKey().defaultRandom(),
  devisId: uuid("devis_id")
    .notNull()
    .references(() => devis.id, { onDelete: "cascade" }),
  ordre: integer("ordre").notNull().default(0),
  prestationId: uuid("prestation_id").references(() => prestations.id, { onDelete: "set null" }),
  designation: text("designation").notNull(),
  quantite: numeric("quantite", { precision: 10, scale: 3 }).notNull().default("1.000"),
  unite: text("unite").notNull().default("u"),
  puCents: bigint("pu_cents", { mode: "number" }).notNull().default(0),
  tauxTva: numeric("taux_tva", { precision: 5, scale: 2 }).notNull().default("20.00"),
  remisePct: numeric("remise_pct", { precision: 5, scale: 2 }).notNull().default("0.00"),
  totalHtCents: bigint("total_ht_cents", { mode: "number" }).notNull().default(0),
});

/* ------------------------------------------------------------------ */
/* Planning / interventions (phase 2)                                  */
/* ------------------------------------------------------------------ */

export const interventions = pgTable("interventions", {
  id: uuid("id").primaryKey().defaultRandom(),
  clientId: uuid("client_id").references(() => clients.id, { onDelete: "set null" }),
  devisId: uuid("devis_id").references(() => devis.id, { onDelete: "set null" }),
  titre: text("titre").notNull(),
  debut: timestamp("debut", { withTimezone: true }).notNull(),
  fin: timestamp("fin", { withTimezone: true }).notNull(),
  adresse: text("adresse"),
  statut: interventionStatutEnum("statut").notNull().default("planifie"),
  notes: text("notes"),
  creeLe: timestamp("cree_le", { withTimezone: true }).notNull().defaultNow(),
  majLe: timestamp("maj_le", { withTimezone: true }).notNull().defaultNow(),
});

/* ------------------------------------------------------------------ */
/* Facturation (phase 3)                                               */
/* ------------------------------------------------------------------ */

export const factures = pgTable(
  "factures",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    // NULL tant que la facture est un brouillon ; attribué définitivement à l'émission
    // (séquence continue sans rupture). Postgres autorise plusieurs NULL sous un index unique.
    numero: text("numero"),
    devisId: uuid("devis_id").references(() => devis.id, { onDelete: "set null" }),
    clientId: uuid("client_id")
      .notNull()
      .references(() => clients.id, { onDelete: "restrict" }),
    dateEmission: timestamp("date_emission", { withTimezone: true }).notNull().defaultNow(),
    dateEcheance: timestamp("date_echeance", { withTimezone: true }),
    statut: factureStatutEnum("statut").notNull().default("brouillon"),
    totalHtCents: bigint("total_ht_cents", { mode: "number" }).notNull().default(0),
    totalTvaCents: bigint("total_tva_cents", { mode: "number" }).notNull().default(0),
    totalTtcCents: bigint("total_ttc_cents", { mode: "number" }).notNull().default(0),
    tvaParTaux: jsonb("tva_par_taux").notNull().default({}),
    // Copie figée des lignes et des mentions au moment de l'émission (facture immuable).
    lignesFigees: jsonb("lignes_figees"),
    mentionsFigees: jsonb("mentions_figees"),
    pdfPath: text("pdf_path"),
    facturxPath: text("facturx_path"),
    emiseLe: timestamp("emise_le", { withTimezone: true }),
    creeLe: timestamp("cree_le", { withTimezone: true }).notNull().defaultNow(),
    majLe: timestamp("maj_le", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("factures_numero_key").on(t.numero)],
);

export const factureLignes = pgTable("facture_lignes", {
  id: uuid("id").primaryKey().defaultRandom(),
  factureId: uuid("facture_id")
    .notNull()
    .references(() => factures.id, { onDelete: "cascade" }),
  ordre: integer("ordre").notNull().default(0),
  designation: text("designation").notNull(),
  quantite: numeric("quantite", { precision: 10, scale: 3 }).notNull().default("1.000"),
  unite: text("unite").notNull().default("u"),
  puCents: bigint("pu_cents", { mode: "number" }).notNull().default(0),
  tauxTva: numeric("taux_tva", { precision: 5, scale: 2 }).notNull().default("20.00"),
  totalHtCents: bigint("total_ht_cents", { mode: "number" }).notNull().default(0),
});

export const avoirs = pgTable(
  "avoirs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    numero: text("numero").notNull(),
    factureId: uuid("facture_id")
      .notNull()
      .references(() => factures.id, { onDelete: "restrict" }),
    dateEmission: timestamp("date_emission", { withTimezone: true }).notNull().defaultNow(),
    montantHtCents: bigint("montant_ht_cents", { mode: "number" }).notNull().default(0),
    montantTtcCents: bigint("montant_ttc_cents", { mode: "number" }).notNull().default(0),
    motif: text("motif"),
    pdfPath: text("pdf_path"),
    creeLe: timestamp("cree_le", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("avoirs_numero_key").on(t.numero)],
);

export const paiements = pgTable("paiements", {
  id: uuid("id").primaryKey().defaultRandom(),
  factureId: uuid("facture_id")
    .notNull()
    .references(() => factures.id, { onDelete: "cascade" }),
  date: timestamp("date", { withTimezone: true }).notNull().defaultNow(),
  montantCents: bigint("montant_cents", { mode: "number" }).notNull(),
  moyen: paiementMoyenEnum("moyen").notNull().default("virement"),
  reference: text("reference"),
  creeLe: timestamp("cree_le", { withTimezone: true }).notNull().defaultNow(),
});

/**
 * Journal d'événements des factures — append-only, chaîné par hash.
 * Sert à démontrer l'inaltérabilité (loi anti-fraude TVA).
 */
export const factureJournal = pgTable("facture_journal", {
  id: uuid("id").primaryKey().defaultRandom(),
  factureId: uuid("facture_id")
    .notNull()
    .references(() => factures.id, { onDelete: "cascade" }),
  evenement: text("evenement").notNull(),
  payload: jsonb("payload"),
  horodatage: timestamp("horodatage", { withTimezone: true }).notNull().defaultNow(),
  hashPrecedent: text("hash_precedent"),
  hash: text("hash").notNull(),
});
