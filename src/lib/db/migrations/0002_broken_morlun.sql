CREATE TABLE "contenu_site" (
	"id" integer PRIMARY KEY DEFAULT 1 NOT NULL,
	"nom_affiche" text,
	"slogan" text,
	"zone_texte" text,
	"horaires" text,
	"url_publique" text,
	"about_intro" text,
	"about_paragraphes" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"about_tags" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"hero_photo_url" text,
	"hero_photo_alt" text,
	"about_photo_url" text,
	"about_photo_alt" text,
	"maj_le" timestamp with time zone DEFAULT now() NOT NULL
);
