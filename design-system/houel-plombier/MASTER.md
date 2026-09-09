# Design system — Houel Plombier (v2)

> Direction visuelle **« Zinc & laiton »**, en place depuis la refonte v2 (branche
> `v2-changement-dashboard`). Elle remplace la direction « artisan premium » (crème + bronze
> + Playfair Display) qui reproduisait le rendu générique décrit dans
> [`docs/brief-design-site-plombier.md`](../../docs/brief-design-site-plombier.md).
>
> Implémentation : `src/app/globals.css` (`:root` + `.dark` + bloc `@theme inline`).
> Toute couleur ou police vient d'un token ; rien n'est codé en dur dans les composants.

---

## 1. Intention

Ancrer l'identité dans les **matières du métier** — le zinc des toitures et de la
tuyauterie, le laiton des raccords — plutôt que dans un choix de template. Ton visé :
**fiable / rassurant + artisanal / soigné**. Une seule audace visuelle par écran, le reste
sobre.

---

## 2. Couleurs

### Rôles structurants

| Rôle | Token | Clair | Sombre |
|---|---|---|---|
| Fond | `--background` | `#f5f6f7` | `#14181c` |
| Surface (sections alternées, tableaux) | `--surface` | `#ecedf0` | `#1b2127` |
| Surface secondaire | `--surface-muted` | `#e3e5e9` | `#232a31` |
| Texte principal | `--text` | `#1f2933` | `#e6eaec` |
| Texte secondaire | `--text-muted` | `#5a6773` | `#98a4ad` |
| Filet / bordure | `--border` | `#dbdfe3` | `#2d363d` |

### Accents

| Rôle | Token | Clair | Sombre | Usage |
|---|---|---|---|---|
| **Zinc** (structurant) | `--accent` / `--accent-hover` / `--on-accent` | `#3e4c59` | `#8b99a6` | Liens, focus, états actifs, navigation, boutons secondaires |
| **Laiton** (chaud) | `--accent-warm` / `--accent-warm-hover` / `--on-accent-warm` | `#8a6a1c` | `#c6a653` | Bouton primaire, montants clés (ex. encaissé du mois), marqueurs d'urgence |

Le laiton est **assombri** par rapport au laiton pur (`#a8842c`) pour tenir le contraste
AA du texte blanc sur le bouton. En sombre, le bouton laiton s'éclaircit et le texte
devient sombre (`--on-accent-warm`).

### Sémantiques génériques

`--success` (`#40745a` / `#6fae86`), `--danger` (`#a83a2e` / `#d98878`). Pour du texte
d'état simple (message d'erreur, validation).

---

## 3. Tons de statut

Cinq tons pour les pastilles de statut (devis, factures, demandes, interventions),
**distincts des accents** (règle du brief). Chaque ton = une paire bg / fg déclinée
clair + sombre : `--tone-<ton>-bg` / `--tone-<ton>-fg`.

| Ton | Sens | Exemples de statut |
|---|---|---|
| `neutre` | Sans enjeu | Brouillon |
| `info` | En cours, en attente | Envoyé, Vu, Émise, Planifiée, Nouveau |
| `attention` | Action attendue / échéance | À rappeler, Expiré, Payée en partie, En cours |
| `positif` | Abouti | Accepté, Payée, Gagné, Terminée |
| `negatif` | Refus / annulation | Refusé, Annulée, Perdu |

Le mapping statut → ton vit dans `src/lib/admin/*-statuts.ts` (`*_STATUT_TONE`).
Rendu par le composant `<Statut tone="…">` (`src/components/admin/ui.tsx`).

---

## 4. Typographie

- **Titres** : **Bricolage Grotesque** (`--font-display` / classe `font-heading`).
  Grotesque contemporain aux détails singuliers — porte la personnalité.
- **Texte et données** : **Public Sans** (`--font-sans`). Très lisible, neutre, sans
  passif « startup ». Utiliser `tabular-nums` pour les colonnes de chiffres
  (montants, dates, quantités).
- Chargées via `next/font/google` dans `src/app/layout.tsx`. Deux familles, pas plus.

**Interdits** (rappel du brief) : eyebrow décoratif au-dessus des titres, labels en
capitales par défaut, un seul mot accentué dans un titre.

---

## 5. Formes

- **Rayons** : `rounded-sm` (2 px) sur les boutons, pastilles, champs. Pas de
  `rounded-lg` / `rounded-full` sur les gros éléments — le style tient sur les filets.
- **Ombres** : quasi absentes. Une bordure `1px` (`--border`) remplace la carte-ombre.
- **Cartes** : évitées par défaut. Regroupement = bordure fine, ou liste `divide-y` /
  `border-t`. Pas de grille de cartes identiques.
- **Liseré de sévérité** : bordure gauche 2 px colorée sur les lignes « à traiter » du
  tableau de bord (`border-[var(--tone-…-fg)]`).

---

## 6. Composants de référence

| Composant | Fichier | Rôle |
|---|---|---|
| `Button` | `src/components/ui/Button.tsx` | Bouton du site public. `primary` = laiton, `secondary` = filet. |
| `Bouton` | `src/components/admin/ui.tsx` | Équivalent admin (lien ou `<a>` fichier). `primary` / `ghost`. |
| `Statut` | `src/components/admin/ui.tsx` | Pastille de statut à ton sémantique. |
| `PageTitre` | `src/components/admin/ui.tsx` | En-tête de page admin (titre + description + action). |
| `SectionTitle` | `src/components/ui/SectionTitle.tsx` | Titre de section du site (titre + description, sans eyebrow ni trait). |
| `LignesEditor` | `src/components/admin/LignesEditor.tsx` | Éditeur de lignes partagé devis / factures. |
| `Field` / `SelectField` / `TextAreaField` / `CheckboxField` / `SubmitButton` | `src/components/admin/form.tsx` | Champs de formulaire admin, une seule définition. |

---

## 7. Motion

- Pas d'animation d'apparition au scroll (le composant `Reveal` a été supprimé).
- Le mouvement répond à une action : `hover` sur les liens et cartes cliquables
  (transition `colors` 150 ms), léger zoom sur les photos au survol.
- `prefers-reduced-motion` respecté (`motion-safe:` sur les zooms).

---

## 8. Checklist avant de valider un écran

- [ ] Aucune valeur de couleur / police en dur — tout passe par un token.
- [ ] Contraste texte ≥ 4.5:1 dans les deux thèmes (vérifié, pas supposé).
- [ ] Focus clavier visible partout (`focus-visible:ring-2 ring-accent`).
- [ ] `cursor-pointer` sur tout ce qui est cliquable.
- [ ] Un seul élément porte l'audace visuelle, le reste reste sobre.
- [ ] Numérotation (01/02) seulement si c'est une vraie séquence (ex. « Comment je travaille »).
- [ ] Statut encodé en forme **et** en couleur (pastille `<Statut>`), pas juste un mot.
- [ ] Responsive testé à 375 / 768 / 1024 px, pas de scroll horizontal, zones tactiles ≥ 44 px.

---

*À mettre à jour au fil des décisions. Le brief (`docs/brief-design-site-plombier.md`)
reste la référence de principe ; ce document décrit l'implémentation.*
