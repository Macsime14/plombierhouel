# Brief de design — Site Houel Plombier

> À compléter/affiner au fil du projet. Ce document sert de référence à chaque nouvelle page
> ou composant à designer, pour garder une identité cohérente et éviter un rendu "template IA".
>
> Les entrées marquées **(à valider)** sont des propositions à confirmer avec l'utilisateur / Antoine.

---

## 1. Identité du sujet

- **Client** : **Houel Antoine**, plombier chauffagiste, basé à **Noyers-Bocage (14210)**.
  Parcours : chef de chantier puis conducteur de travaux chez Celfy (Caen), ~8 ans, avant de
  reprendre l'entreprise familiale fondée par son père Olivier Houel. Passion : course à pied /
  ultra-trail.
- **Spécialités** : dépannage plomberie, chauffage, pompe à chaleur, climatisation, sanitaires,
  rénovation (salle de bain).
- **Zone d'intervention** : Noyers-Bocage, Villers-Bocage, Aunay-sur-Odon, Caen.
- **Ton recherché** *(à valider)* : **fiable et rassurant** + **artisanal et soigné**.
  Cohérent avec une reprise d'entreprise familiale et un profil "conducteur de travaux" :
  rigueur, suivi, travail propre. Éviter le registre "startup" ou "plombier pas cher".
- **Public cible** :
  - particuliers en situation d'urgence (fuite, panne) → aller vite au contact ;
  - propriétaires en projet de rénovation / installation → crédibilité, exemples de chantiers.
- **Ce que le design doit transmettre en premier coup d'œil** *(à valider — 2 à 3 max)* :
  1. **Savoir-faire / qualité du travail** (chantier bien mené, fini propre)
  2. **Confiance** (entreprise établie, reprise familiale, assurance décennale, qualifications)
  3. **Réactivité** (contact rapide, intervention sur le secteur)

---

## 2. Palette

**État actuel à remplacer** : le site tourne aujourd'hui sur `#fbf9f6` (crème chaud) +
`#96601f` (accent cuivre/terracotta) + Playfair/Inter — c'est exactement le combo listé
ci-dessous comme "à éviter". La refonte v2 change ça.

**À éviter explicitement** (tics visuels IA génériques) :
- Crème chaud + accent terracotta (#F4F1EA / #D97757)
- Noir quasi pur + un seul accent vert acide ou vermillon
- Dégradés décoratifs gratuits

**Piste de départ, ancrée dans le métier** *(à valider/ajuster)* :

| Rôle | Couleur | Hex (exemple à ajuster) |
|---|---|---|
| Base / fond | Blanc cassé neutre | `#FAFAF8` |
| Texte principal | Bleu-gris très foncé (pas noir pur) | `#1C2B33` |
| Accent principal | Bleu profond (eau, tuyauterie, confiance) | `#1E5F74` |
| Accent secondaire | Cuivre/terracotta chaud (matériau réel de plomberie) | `#B5651D` |
| Succès / validation | Vert sourd, pas fluo | `#4A7856` |
| Alerte / urgence | Rouge brique, pas rouge vif générique | `#B23A2E` |

*Objectif : que la palette évoque le métier (eau, cuivre, inox) plutôt qu'un choix de
template SaaS.*

*Note d'implémentation : garder une déclinaison mode sombre cohérente (l'admin l'utilise).
Le bleu profond passe bien en sombre ; ré-évaluer le cuivre secondaire pour le contraste.*

---

## 3. Typographie

- **Nombre de familles** : 1 ou 2 max, clairement distinctes si 2.
- **À éviter** : Inter, Geist, ou toute police "safe" par défaut sans intention.
- **Piste** : une typo à caractère pour les titres (personnalité, lisible en grand) + une typo
  sobre et très lisible pour le contenu et les données (devis, tableaux).
- **Hiérarchie à maintenir strictement** :
  - Titres (H1/H2) — impact, taille contrastée
  - Sous-titres — transition claire sans franchir dans le "label"
  - Contenu / paragraphes — ligne < 80 caractères, line-height confortable
  - Labels (formulaires, filtres) — discrets, jamais en majuscules systématiques
  - Données (montants, dates, statuts de devis/factures) — lisibilité numérique, alignement
    cohérent (chiffres tabulaires)
  - Éléments secondaires (mentions légales, notes) — clairement subordonnés

**Interdits** :
- Un seul mot accentué en gras/italique/couleur dans un titre
- Labels tout en majuscules par défaut
- "Eyebrow" (petit label au-dessus d'un titre) sauf s'il sert vraiment la navigation

---

## 4. Layout

- **Alignement** : à décider par page (ex : hero centré vs contenu aligné à gauche).
- **Éviter** : le kit "cartes SaaS" — cartes identiques, même arrondi, même ombre grise
  partout, quelle que soit la hiérarchie du contenu.
- **Numérotation (01/02/03)** : uniquement si le contenu est une vraie séquence (étapes d'une
  intervention, étapes d'une demande de devis) — jamais en décoration.
- **Hero (accueil)** : ouvrir sur l'élément le plus caractéristique du métier — pas le combo
  "gros chiffre + stats + dégradé" par défaut. Vraie photo de chantier / d'Antoine en action
  plutôt qu'une illustration générique.

---

## 5. Motion

- Une seule séquence marquante au chargement (pas de fade-slide-up systématique sur chaque
  section).
- Le mouvement répond à une action utilisateur (ouverture d'un devis, validation d'un
  formulaire) plutôt que de décorer au scroll.
- Respect de `prefers-reduced-motion`.

---

## 6. Ton rédactionnel (copie / UX writing)

- Voix active : "Demander un devis", pas "Soumettre une demande".
- Vocabulaire utilisateur, pas vocabulaire interne : "Vos devis" pas "Gestion des devis" côté
  client.
- Un bouton garde le même nom tout au long du parcours ("Envoyer" → confirmation "Envoyé",
  pas "Transmis").
- Pas de tirets cadratins stylisés ni de points médians dans les métadonnées.
- Messages d'erreur / vide : expliquer ce qui s'est passé et quoi faire, sans excuse, sans
  flou.

---

## 7. Contraintes de code (qualité)

- Composants réutilisables (boutons, cartes, champs de formulaire) définis une seule fois,
  réutilisés partout.
- Cohérence stricte entre les tokens de ce document (couleurs, typo, espacements) et leur
  implémentation : variables CSS dans `src/app/globals.css` + `@theme` Tailwind v4.
- Accessibilité : focus clavier visible, contrastes suffisants, responsive mobile-first
  (usage terrain fréquent).

---

## 8. Anti-check-list avant de valider un écran

- [ ] Est-ce que je reconnais un des 5 tics IA génériques (palette crème/terracotta,
      noir + accent unique, layout broadsheet, cartes SaaS identiques, chrome template type
      eyebrow / tirets / monospace) ?
- [ ] Est-ce que la palette / typo pourrait s'appliquer à n'importe quel autre métier sans
      rien changer ?
- [ ] Est-ce que chaque élément décoratif sert une info réelle (hiérarchie, statut,
      séquence) ?
- [ ] Est-ce qu'un seul élément porte l'audace visuelle, le reste restant sobre ?

---

*Document à mettre à jour au fil des retours et décisions prises pendant le projet.*
