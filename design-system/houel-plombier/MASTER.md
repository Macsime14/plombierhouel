# Design System — Houel Plombier

> Généré avec l'aide du skill `ui-ux-pro-max`, puis corrigé manuellement : la recherche automatique
> a d'abord renvoyé une palette bleu corporate + une police "artisanat fait main" (Amatic SC) qui ne
> correspondent pas au brief (architecture/artisan premium, sobre, chaleureux). Une recherche plus
> ciblée sur "architecture/interior" et "editorial premium" a donné de bien meilleurs résultats,
> repris ci-dessous. Les règles UX universelles (contraste, focus, spacing, checklist) viennent du
> skill et s'appliquent telles quelles.

---

## Couleurs

### Mode clair (référence principale)

| Rôle | Hex | Variable |
|------|-----|----------|
| Fond | `#FBF9F6` | `--background` |
| Surface (sections alternées) | `#F3EFE8` | `--surface` |
| Surface secondaire | `#EDE7DD` | `--surface-muted` |
| Texte principal | `#211D18` | `--text` |
| Texte secondaire | `#6B6459` | `--text-muted` |
| Bordure | `#E2DBCD` | `--border` |
| Accent (cuivre/bronze) | `#96601F` | `--accent` |
| Sur accent | `#FFFFFF` | `--on-accent` |

### Mode sombre (vraie variante, pas juste une inversion)

| Rôle | Hex | Variable |
|------|-----|----------|
| Fond | `#111111` | `--background` |
| Surface | `#181818` | `--surface` |
| Surface secondaire | `#202020` | `--surface-muted` |
| Texte principal | `#F2F0EA` | `--text` |
| Texte secondaire | `#B8B5AE` | `--text-muted` |
| Bordure | `#2C2C2C` | `--border` |
| Accent (bronze éclairci pour le contraste) | `#D4A045` | `--accent` |
| Sur accent | `#111111` | `--on-accent` |

**Pourquoi ce choix :** issu du résultat "Architecture/Interior" du skill (anthracite + accent doré/bronze,
`#A16207` ajusté), qui correspond bien plus au brief "artisanat haut de gamme, architecture, matériaux"
que la palette bleu générique proposée par défaut. L'accent est éclairci en mode sombre (règle du skill :
*"Dark mode uses desaturated/lighter tonal variants, not inverted colors"*).

---

## Typographie

- **Titres :** Playfair Display (serif éditorial, élégant, évoque l'architecture/le premium sans être "startup")
- **Texte courant :** Inter (déjà en place, très lisible, neutre)
- Deux familles maximum, conforme au brief.

**Pourquoi ce choix :** résultat "Classic Elegant" du skill (Playfair Display + Inter), taggé
"editorial, magazines, high-end" — beaucoup plus proche du brief que la paire "Amatic SC / Cabin"
(indie/fait main) proposée par défaut, qui aurait donné un rendu artisanal enfantin plutôt que premium.

### Échelle de tailles

`14 / 16 / 18 / 20 / 24 / 32 / 40 / 56` px — cohérente sur tout le site, pas de tailles arbitraires.

---

## Espacements

`4 / 8 / 16 / 24 / 32 / 48 / 64 / 96` px — rythme éditorial : sections importantes = beaucoup
d'espace, éléments liés = rapprochés (déjà la logique Tailwind par défaut qu'on utilise).

---

## Bordures et rayons

Rayons minimaux (`2px` à `4px` maximum) — pas de `rounded-2xl`/`rounded-full` sur les gros éléments.
Le style repose sur des **lignes fines** et des bordures plutôt que sur l'arrondi ou l'ombre.

## Ombres

Quasi absentes. Une bordure fine (`1px`, `--border`) remplace la carte-avec-ombre par défaut.
Ombre très subtile réservée aux éléments réellement flottants (ex. menu mobile ouvert).

---

## Composants

- **Boutons :** rectangulaires (rayon minimal), texte en petites majuscules espacées, pas de gros
  padding ni d'ombre. Primaire = fond accent ; secondaire = bordure fine + texte accent.
- **Cartes :** évitées par défaut (le brief interdit les grilles de cartes identiques). Quand un
  regroupement est nécessaire, bordure fine plutôt que fond + ombre.
- **Inputs :** bordure fine, focus = anneau 2px couleur accent, `outline-offset: 2px`.
- **États focus :** visibles partout (anneau 2px, contraste ≥ 3:1 — règle WCAG 2.2 AAA du skill).
- **Icônes :** Lucide, usage minimal et seulement quand elles apportent un vrai sens (pas d'icône
  décorative systématique à côté de chaque titre).

---

## Checklist qualité (issue du skill, à valider avant livraison)

- [ ] Aucun emoji comme icône
- [ ] `cursor-pointer` sur tous les éléments cliquables
- [ ] Transitions douces (150–300ms) sur les états hover
- [ ] Contraste texte ≥ 4.5:1 dans les deux thèmes (vérifié séparément, pas supposé)
- [ ] États focus visibles au clavier partout
- [ ] `prefers-reduced-motion` respecté
- [ ] Responsive testé à 375 / 768 / 1024 / 1440px
- [ ] Zones tactiles ≥ 44×44px sur mobile
- [ ] Pas de contenu masqué sous le header sticky
- [ ] Pas de scroll horizontal sur mobile

## Anti-patterns à éviter explicitement

Grilles de 3 cartes identiques avec icône au-dessus · dégradés décoratifs · glassmorphism ·
ombres excessives · boutons surdimensionnés · animations permanentes · même composant répété sans
variation entre les sections.
