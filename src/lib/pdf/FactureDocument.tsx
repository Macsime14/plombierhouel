import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

import { formaterEuros } from "@/lib/domain/montants";

/** Mentions figées au moment de l'émission (colonne mentions_figees). */
export type MentionsFigees = {
  entreprise: {
    raisonSociale: string | null;
    formeJuridique: string | null;
    siret: string | null;
    tvaIntracom: string | null;
    adresse: string | null;
    codePostal: string | null;
    ville: string | null;
    iban: string | null;
    bic: string | null;
    regimeTva: "franchise_base" | "reel";
    assuranceDecennale: { assureur: string | null; contrat: string | null; zone: string | null };
    mentionsFacture: string | null;
    penalitesRetardTaux: string | null;
  };
  client: {
    nom: string;
    adresse: string | null;
    codePostal: string | null;
    ville: string | null;
    siret: string | null;
  };
};

export type LigneFigee = {
  designation: string;
  quantite: number;
  unite: string;
  puCents: number;
  tauxTva: number;
  totalHtCents: number;
};

export type FacturePdfData = {
  numero: string;
  dateEmission: Date;
  dateEcheance: Date | null;
  mentions: MentionsFigees;
  lignes: LigneFigee[];
  totalHtCents: number;
  totalTvaCents: number;
  totalTtcCents: number;
  parTaux: { taux: number; tvaCents: number; baseHtCents: number }[];
};

const dateFmt = new Intl.DateTimeFormat("fr-FR", { dateStyle: "long", timeZone: "Europe/Paris" });

const s = StyleSheet.create({
  page: { paddingHorizontal: 40, paddingVertical: 44, fontSize: 9, color: "#211d18", fontFamily: "Helvetica" },
  header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 24 },
  nom: { fontSize: 14, fontFamily: "Helvetica-Bold" },
  muted: { color: "#6b6459" },
  right: { alignItems: "flex-end" },
  titre: { fontSize: 18, fontFamily: "Helvetica-Bold" },
  section: { marginBottom: 16 },
  label: { fontSize: 8, color: "#6b6459", marginBottom: 2, textTransform: "uppercase" },
  head: { flexDirection: "row", borderBottomWidth: 1, borderColor: "#211d18", paddingBottom: 4, fontFamily: "Helvetica-Bold" },
  row: { flexDirection: "row", borderBottomWidth: 0.5, borderColor: "#e2dbcd", paddingVertical: 4 },
  cD: { width: "46%" },
  cQ: { width: "12%", textAlign: "right" },
  cP: { width: "14%", textAlign: "right" },
  cT: { width: "12%", textAlign: "right" },
  cX: { width: "16%", textAlign: "right" },
  totaux: { marginTop: 12, marginLeft: "auto", width: "45%" },
  tr: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 2 },
  ttc: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 4, marginTop: 2, borderTopWidth: 1, borderColor: "#211d18", fontFamily: "Helvetica-Bold", fontSize: 11 },
  mentions: { marginTop: 24, fontSize: 7.5, color: "#6b6459", lineHeight: 1.5 },
});

const joindre = (parts: (string | null)[]) => parts.filter(Boolean).join(" · ");

export function FactureDocument({ data }: { data: FacturePdfData }) {
  const e = data.mentions.entreprise;
  const c = data.mentions.client;
  const franchise = e.regimeTva === "franchise_base";

  return (
    <Document title={`Facture ${data.numero}`}>
      <Page size="A4" style={s.page}>
        <View style={s.header}>
          <View>
            <Text style={s.nom}>{e.raisonSociale ?? "Houel Plombier"}</Text>
            {e.formeJuridique ? <Text style={s.muted}>{e.formeJuridique}</Text> : null}
            <Text style={s.muted}>{joindre([e.adresse, e.codePostal, e.ville])}</Text>
            {e.siret ? <Text style={s.muted}>SIRET {e.siret}</Text> : null}
            {e.tvaIntracom ? <Text style={s.muted}>TVA {e.tvaIntracom}</Text> : null}
          </View>
          <View style={s.right}>
            <Text style={s.titre}>FACTURE</Text>
            <Text>{data.numero}</Text>
            <Text style={s.muted}>Date : {dateFmt.format(data.dateEmission)}</Text>
            {data.dateEcheance ? (
              <Text style={s.muted}>Échéance : {dateFmt.format(data.dateEcheance)}</Text>
            ) : null}
          </View>
        </View>

        <View style={s.section}>
          <Text style={s.label}>Client</Text>
          <Text>{c.nom}</Text>
          {c.adresse ? <Text>{c.adresse}</Text> : null}
          <Text>{joindre([c.codePostal, c.ville])}</Text>
          {c.siret ? <Text style={s.muted}>SIRET {c.siret}</Text> : null}
        </View>

        <View style={s.head}>
          <Text style={s.cD}>Désignation</Text>
          <Text style={s.cQ}>Qté</Text>
          <Text style={s.cP}>PU HT</Text>
          {!franchise ? <Text style={s.cT}>TVA</Text> : null}
          <Text style={s.cX}>Total HT</Text>
        </View>
        {data.lignes.map((l, i) => (
          <View key={i} style={s.row}>
            <Text style={s.cD}>{l.designation}</Text>
            <Text style={s.cQ}>
              {l.quantite} {l.unite}
            </Text>
            <Text style={s.cP}>{formaterEuros(l.puCents)}</Text>
            {!franchise ? <Text style={s.cT}>{l.tauxTva} %</Text> : null}
            <Text style={s.cX}>{formaterEuros(l.totalHtCents)}</Text>
          </View>
        ))}

        <View style={s.totaux}>
          <View style={s.tr}>
            <Text style={s.muted}>Total HT</Text>
            <Text>{formaterEuros(data.totalHtCents)}</Text>
          </View>
          {franchise ? (
            <Text style={[s.muted, { paddingVertical: 2 }]}>TVA non applicable, art. 293 B du CGI</Text>
          ) : (
            data.parTaux.map((t) => (
              <View key={t.taux} style={s.tr}>
                <Text style={s.muted}>TVA {t.taux} %</Text>
                <Text>{formaterEuros(t.tvaCents)}</Text>
              </View>
            ))
          )}
          <View style={s.ttc}>
            <Text>Total TTC</Text>
            <Text>{formaterEuros(data.totalTtcCents)}</Text>
          </View>
        </View>

        <View style={s.mentions}>
          {e.iban ? (
            <Text>
              Règlement par virement — IBAN {e.iban}
              {e.bic ? ` / BIC ${e.bic}` : ""}.
            </Text>
          ) : null}
          <Text>
            En cas de retard de paiement, application de pénalités au taux
            {e.penalitesRetardTaux ? ` de ${e.penalitesRetardTaux} %` : " légal"} et d’une
            indemnité forfaitaire pour frais de recouvrement de 40 € (client professionnel).
            Pas d’escompte pour paiement anticipé.
          </Text>
          {e.mentionsFacture ? <Text>{e.mentionsFacture}</Text> : null}
          {e.assuranceDecennale.assureur ? (
            <Text>
              Assurance décennale : {e.assuranceDecennale.assureur}
              {e.assuranceDecennale.contrat ? ` (contrat ${e.assuranceDecennale.contrat})` : ""}
              {e.assuranceDecennale.zone ? ` — ${e.assuranceDecennale.zone}` : ""}.
            </Text>
          ) : null}
        </View>
      </Page>
    </Document>
  );
}
