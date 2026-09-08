import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

import { formaterEuros } from "@/lib/domain/montants";
import type { Parametres } from "@/lib/domain/parametres";

export type DevisPdfLigne = {
  designation: string;
  quantite: number;
  unite: string;
  puCents: number;
  tauxTva: number;
  remisePct: number;
  totalHtCents: number;
};

export type DevisPdfData = {
  numero: string;
  dateEmission: Date;
  dateValidite: Date;
  entreprise: Parametres;
  client: {
    nom: string;
    adresse: string | null;
    codePostal: string | null;
    ville: string | null;
    siret: string | null;
  };
  lignes: DevisPdfLigne[];
  totaux: {
    totalHtCents: number;
    totalTvaCents: number;
    totalTtcCents: number;
    parTaux: { taux: number; tvaCents: number; baseHtCents: number }[];
  };
  conditions: string | null;
  franchise: boolean;
};

const dateFmt = new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" });

const styles = StyleSheet.create({
  page: { paddingHorizontal: 40, paddingVertical: 44, fontSize: 9, color: "#211d18", fontFamily: "Helvetica" },
  header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 24 },
  entrepriseNom: { fontSize: 14, fontFamily: "Helvetica-Bold" },
  muted: { color: "#6b6459" },
  titreBloc: { alignItems: "flex-end" },
  titre: { fontSize: 18, fontFamily: "Helvetica-Bold" },
  section: { marginBottom: 16 },
  label: { fontSize: 8, color: "#6b6459", marginBottom: 2, textTransform: "uppercase" },
  ligneInfos: { flexDirection: "row", justifyContent: "space-between" },
  colInfos: { width: "48%" },
  tableHead: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#211d18",
    paddingBottom: 4,
    fontFamily: "Helvetica-Bold",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderColor: "#e2dbcd",
    paddingVertical: 4,
  },
  cDesignation: { width: "46%" },
  cQte: { width: "12%", textAlign: "right" },
  cPu: { width: "14%", textAlign: "right" },
  cTva: { width: "12%", textAlign: "right" },
  cTotal: { width: "16%", textAlign: "right" },
  totaux: { marginTop: 12, marginLeft: "auto", width: "45%" },
  totalRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 2 },
  totalTtc: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    marginTop: 2,
    borderTopWidth: 1,
    borderColor: "#211d18",
    fontFamily: "Helvetica-Bold",
    fontSize: 11,
  },
  mentions: { marginTop: 24, fontSize: 7.5, color: "#6b6459", lineHeight: 1.5 },
  conditions: { marginTop: 16, fontSize: 8.5, lineHeight: 1.5 },
});

function ligneAdresse(parts: (string | null)[]) {
  return parts.filter(Boolean).join(" · ");
}

export function DevisDocument({ data }: { data: DevisPdfData }) {
  const e = data.entreprise;
  const c = data.client;

  return (
    <Document title={`Devis ${data.numero}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.entrepriseNom}>{e.raisonSociale ?? "Houel Plombier"}</Text>
            {e.formeJuridique ? <Text style={styles.muted}>{e.formeJuridique}</Text> : null}
            <Text style={styles.muted}>{ligneAdresse([e.adresse, e.codePostal, e.ville])}</Text>
            {e.telephone ? <Text style={styles.muted}>Tél. {e.telephone}</Text> : null}
            {e.email ? <Text style={styles.muted}>{e.email}</Text> : null}
            {e.siret ? <Text style={styles.muted}>SIRET {e.siret}</Text> : null}
            {e.tvaIntracom ? <Text style={styles.muted}>TVA {e.tvaIntracom}</Text> : null}
          </View>
          <View style={styles.titreBloc}>
            <Text style={styles.titre}>DEVIS</Text>
            <Text>{data.numero}</Text>
            <Text style={styles.muted}>Émis le {dateFmt.format(data.dateEmission)}</Text>
            <Text style={styles.muted}>Valable jusqu’au {dateFmt.format(data.dateValidite)}</Text>
          </View>
        </View>

        <View style={[styles.section, styles.ligneInfos]}>
          <View style={styles.colInfos}>
            <Text style={styles.label}>Client</Text>
            <Text>{c.nom}</Text>
            {c.adresse ? <Text>{c.adresse}</Text> : null}
            <Text>{ligneAdresse([c.codePostal, c.ville])}</Text>
            {c.siret ? <Text style={styles.muted}>SIRET {c.siret}</Text> : null}
          </View>
        </View>

        <View style={styles.tableHead}>
          <Text style={styles.cDesignation}>Désignation</Text>
          <Text style={styles.cQte}>Qté</Text>
          <Text style={styles.cPu}>PU HT</Text>
          {!data.franchise ? <Text style={styles.cTva}>TVA</Text> : null}
          <Text style={styles.cTotal}>Total HT</Text>
        </View>
        {data.lignes.map((l, i) => (
          <View key={i} style={styles.tableRow}>
            <Text style={styles.cDesignation}>
              {l.designation}
              {l.remisePct > 0 ? ` (remise ${l.remisePct} %)` : ""}
            </Text>
            <Text style={styles.cQte}>
              {l.quantite} {l.unite}
            </Text>
            <Text style={styles.cPu}>{formaterEuros(l.puCents)}</Text>
            {!data.franchise ? <Text style={styles.cTva}>{l.tauxTva} %</Text> : null}
            <Text style={styles.cTotal}>{formaterEuros(l.totalHtCents)}</Text>
          </View>
        ))}

        <View style={styles.totaux}>
          <View style={styles.totalRow}>
            <Text style={styles.muted}>Total HT</Text>
            <Text>{formaterEuros(data.totaux.totalHtCents)}</Text>
          </View>
          {data.franchise ? (
            <Text style={[styles.muted, { paddingVertical: 2 }]}>
              TVA non applicable, art. 293 B du CGI
            </Text>
          ) : (
            data.totaux.parTaux.map((t) => (
              <View key={t.taux} style={styles.totalRow}>
                <Text style={styles.muted}>TVA {t.taux} %</Text>
                <Text>{formaterEuros(t.tvaCents)}</Text>
              </View>
            ))
          )}
          <View style={styles.totalTtc}>
            <Text>Total TTC</Text>
            <Text>{formaterEuros(data.totaux.totalTtcCents)}</Text>
          </View>
        </View>

        {data.conditions ? (
          <View style={styles.conditions}>
            <Text style={styles.label}>Conditions</Text>
            <Text>{data.conditions}</Text>
          </View>
        ) : null}

        <View style={styles.mentions}>
          <Text>
            Devis reçu avant l’exécution des travaux. Bon pour accord à retourner daté et signé,
            avec la mention « Bon pour accord ».
          </Text>
          {e.mentionsDevis ? <Text>{e.mentionsDevis}</Text> : null}
          {e.penalitesRetardTaux ? (
            <Text>Pénalités de retard : {e.penalitesRetardTaux} %. Indemnité forfaitaire de recouvrement : 40 € (client professionnel).</Text>
          ) : null}
          {e.assuranceDecennaleAssureur ? (
            <Text>
              Assurance décennale : {e.assuranceDecennaleAssureur}
              {e.assuranceDecennaleContrat ? ` (contrat ${e.assuranceDecennaleContrat})` : ""}
              {e.assuranceDecennaleZone ? ` — ${e.assuranceDecennaleZone}` : ""}.
            </Text>
          ) : null}
        </View>
      </Page>
    </Document>
  );
}
