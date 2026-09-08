CREATE TYPE "public"."client_type" AS ENUM('particulier', 'pro');--> statement-breakpoint
CREATE TYPE "public"."demande_statut" AS ENUM('nouveau', 'a_rappeler', 'devis_envoye', 'gagne', 'perdu');--> statement-breakpoint
CREATE TYPE "public"."devis_statut" AS ENUM('brouillon', 'envoye', 'vu', 'accepte', 'refuse', 'expire');--> statement-breakpoint
CREATE TYPE "public"."facture_statut" AS ENUM('brouillon', 'emise', 'payee_partiel', 'payee', 'annulee');--> statement-breakpoint
CREATE TYPE "public"."intervention_statut" AS ENUM('planifie', 'en_cours', 'termine', 'annule');--> statement-breakpoint
CREATE TYPE "public"."paiement_moyen" AS ENUM('virement', 'cheque', 'especes', 'cb', 'autre');--> statement-breakpoint
CREATE TYPE "public"."regime_tva" AS ENUM('franchise_base', 'reel');--> statement-breakpoint
CREATE TABLE "avoirs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"numero" text NOT NULL,
	"facture_id" uuid NOT NULL,
	"date_emission" timestamp with time zone DEFAULT now() NOT NULL,
	"montant_ht_cents" bigint DEFAULT 0 NOT NULL,
	"montant_ttc_cents" bigint DEFAULT 0 NOT NULL,
	"motif" text,
	"pdf_path" text,
	"cree_le" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "clients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" "client_type" DEFAULT 'particulier' NOT NULL,
	"nom" text NOT NULL,
	"email" text,
	"telephone" text,
	"adresse_facturation" text,
	"code_postal_facturation" text,
	"ville_facturation" text,
	"adresse_chantier" text,
	"code_postal_chantier" text,
	"ville_chantier" text,
	"siret" text,
	"tva_intracom" text,
	"notes" text,
	"cree_le" timestamp with time zone DEFAULT now() NOT NULL,
	"maj_le" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "demandes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_id" uuid,
	"nom" text NOT NULL,
	"email" text NOT NULL,
	"telephone" text NOT NULL,
	"type_besoin" text NOT NULL,
	"message" text NOT NULL,
	"statut" "demande_statut" DEFAULT 'nouveau' NOT NULL,
	"notes" text,
	"source" text DEFAULT 'formulaire_site' NOT NULL,
	"cree_le" timestamp with time zone DEFAULT now() NOT NULL,
	"traitee_le" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "devis" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"numero" text NOT NULL,
	"client_id" uuid NOT NULL,
	"demande_id" uuid,
	"date_emission" timestamp with time zone DEFAULT now() NOT NULL,
	"validite_jours" integer DEFAULT 30 NOT NULL,
	"statut" "devis_statut" DEFAULT 'brouillon' NOT NULL,
	"total_ht_cents" bigint DEFAULT 0 NOT NULL,
	"total_tva_cents" bigint DEFAULT 0 NOT NULL,
	"total_ttc_cents" bigint DEFAULT 0 NOT NULL,
	"tva_par_taux" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"conditions" text,
	"notes_internes" text,
	"token_public" text NOT NULL,
	"envoye_le" timestamp with time zone,
	"vu_le" timestamp with time zone,
	"accepte_le" timestamp with time zone,
	"accepte_par_nom" text,
	"accepte_par_ip" text,
	"refuse_le" timestamp with time zone,
	"cree_le" timestamp with time zone DEFAULT now() NOT NULL,
	"maj_le" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "devis_lignes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"devis_id" uuid NOT NULL,
	"ordre" integer DEFAULT 0 NOT NULL,
	"prestation_id" uuid,
	"designation" text NOT NULL,
	"quantite" numeric(10, 3) DEFAULT '1.000' NOT NULL,
	"unite" text DEFAULT 'u' NOT NULL,
	"pu_cents" bigint DEFAULT 0 NOT NULL,
	"taux_tva" numeric(5, 2) DEFAULT '20.00' NOT NULL,
	"remise_pct" numeric(5, 2) DEFAULT '0.00' NOT NULL,
	"total_ht_cents" bigint DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "facture_journal" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"facture_id" uuid NOT NULL,
	"evenement" text NOT NULL,
	"payload" jsonb,
	"horodatage" timestamp with time zone DEFAULT now() NOT NULL,
	"hash_precedent" text,
	"hash" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "facture_lignes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"facture_id" uuid NOT NULL,
	"ordre" integer DEFAULT 0 NOT NULL,
	"designation" text NOT NULL,
	"quantite" numeric(10, 3) DEFAULT '1.000' NOT NULL,
	"unite" text DEFAULT 'u' NOT NULL,
	"pu_cents" bigint DEFAULT 0 NOT NULL,
	"taux_tva" numeric(5, 2) DEFAULT '20.00' NOT NULL,
	"total_ht_cents" bigint DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "factures" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"numero" text NOT NULL,
	"devis_id" uuid,
	"client_id" uuid NOT NULL,
	"date_emission" timestamp with time zone DEFAULT now() NOT NULL,
	"date_echeance" timestamp with time zone,
	"statut" "facture_statut" DEFAULT 'brouillon' NOT NULL,
	"total_ht_cents" bigint DEFAULT 0 NOT NULL,
	"total_tva_cents" bigint DEFAULT 0 NOT NULL,
	"total_ttc_cents" bigint DEFAULT 0 NOT NULL,
	"tva_par_taux" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"lignes_figees" jsonb,
	"mentions_figees" jsonb,
	"pdf_path" text,
	"facturx_path" text,
	"emise_le" timestamp with time zone,
	"cree_le" timestamp with time zone DEFAULT now() NOT NULL,
	"maj_le" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "interventions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_id" uuid,
	"devis_id" uuid,
	"titre" text NOT NULL,
	"debut" timestamp with time zone NOT NULL,
	"fin" timestamp with time zone NOT NULL,
	"adresse" text,
	"statut" "intervention_statut" DEFAULT 'planifie' NOT NULL,
	"notes" text,
	"cree_le" timestamp with time zone DEFAULT now() NOT NULL,
	"maj_le" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "paiements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"facture_id" uuid NOT NULL,
	"date" timestamp with time zone DEFAULT now() NOT NULL,
	"montant_cents" bigint NOT NULL,
	"moyen" "paiement_moyen" DEFAULT 'virement' NOT NULL,
	"reference" text,
	"cree_le" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "parametres_entreprise" (
	"id" integer PRIMARY KEY DEFAULT 1 NOT NULL,
	"raison_sociale" text,
	"forme_juridique" text,
	"siret" text,
	"tva_intracom" text,
	"adresse" text,
	"code_postal" text,
	"ville" text,
	"telephone" text,
	"email" text,
	"iban" text,
	"bic" text,
	"regime_tva" "regime_tva" DEFAULT 'reel' NOT NULL,
	"assurance_decennale_assureur" text,
	"assurance_decennale_contrat" text,
	"assurance_decennale_zone" text,
	"mentions_devis" text,
	"mentions_facture" text,
	"penalites_retard_taux" numeric(5, 2),
	"annee_compteurs" integer DEFAULT 0 NOT NULL,
	"compteur_devis" integer DEFAULT 0 NOT NULL,
	"compteur_facture" integer DEFAULT 0 NOT NULL,
	"compteur_avoir" integer DEFAULT 0 NOT NULL,
	"maj_le" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "prestations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"libelle" text NOT NULL,
	"description" text,
	"unite" text DEFAULT 'u' NOT NULL,
	"pu_cents" bigint DEFAULT 0 NOT NULL,
	"taux_tva" numeric(5, 2) DEFAULT '20.00' NOT NULL,
	"actif" boolean DEFAULT true NOT NULL,
	"cree_le" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"utilisateur_id" uuid NOT NULL,
	"expire_le" timestamp with time zone NOT NULL,
	"cree_le" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "utilisateurs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"mot_de_passe_hash" text NOT NULL,
	"nom" text,
	"cree_le" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "utilisateurs_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "avoirs" ADD CONSTRAINT "avoirs_facture_id_factures_id_fk" FOREIGN KEY ("facture_id") REFERENCES "public"."factures"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "demandes" ADD CONSTRAINT "demandes_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "devis" ADD CONSTRAINT "devis_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "devis" ADD CONSTRAINT "devis_demande_id_demandes_id_fk" FOREIGN KEY ("demande_id") REFERENCES "public"."demandes"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "devis_lignes" ADD CONSTRAINT "devis_lignes_devis_id_devis_id_fk" FOREIGN KEY ("devis_id") REFERENCES "public"."devis"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "devis_lignes" ADD CONSTRAINT "devis_lignes_prestation_id_prestations_id_fk" FOREIGN KEY ("prestation_id") REFERENCES "public"."prestations"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "facture_journal" ADD CONSTRAINT "facture_journal_facture_id_factures_id_fk" FOREIGN KEY ("facture_id") REFERENCES "public"."factures"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "facture_lignes" ADD CONSTRAINT "facture_lignes_facture_id_factures_id_fk" FOREIGN KEY ("facture_id") REFERENCES "public"."factures"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "factures" ADD CONSTRAINT "factures_devis_id_devis_id_fk" FOREIGN KEY ("devis_id") REFERENCES "public"."devis"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "factures" ADD CONSTRAINT "factures_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "interventions" ADD CONSTRAINT "interventions_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "interventions" ADD CONSTRAINT "interventions_devis_id_devis_id_fk" FOREIGN KEY ("devis_id") REFERENCES "public"."devis"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "paiements" ADD CONSTRAINT "paiements_facture_id_factures_id_fk" FOREIGN KEY ("facture_id") REFERENCES "public"."factures"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_utilisateur_id_utilisateurs_id_fk" FOREIGN KEY ("utilisateur_id") REFERENCES "public"."utilisateurs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "avoirs_numero_key" ON "avoirs" USING btree ("numero");--> statement-breakpoint
CREATE UNIQUE INDEX "devis_numero_key" ON "devis" USING btree ("numero");--> statement-breakpoint
CREATE UNIQUE INDEX "devis_token_public_key" ON "devis" USING btree ("token_public");--> statement-breakpoint
CREATE UNIQUE INDEX "factures_numero_key" ON "factures" USING btree ("numero");