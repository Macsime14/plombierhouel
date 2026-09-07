# REFONTE DU SITE — DIRECTION ARTISTIQUE & UX

## Objectif

Refondre visuellement le site existant pour lui donner une identité :

* artisanale
* humaine
* locale
* professionnelle
* rassurante
* moderne
* élégante
* authentique

Le résultat ne doit surtout PAS donner l'impression d'un site généré automatiquement par une IA ou construit à partir d'un template générique.

Le site doit donner immédiatement l'impression qu'il existe une vraie entreprise derrière.

---

# 1. RÉFÉRENCE VISUELLE

Le site de référence est :

https://www.goya-plomberie-bordeaux.com/

IMPORTANT :

Ne pas copier le site de Goya.

S'en inspirer uniquement pour comprendre son approche humaine et artisanale.

Le site de référence fonctionne notamment parce qu'il présente :

* le dirigeant / artisan
* son expérience
* l'entreprise
* sa zone d'intervention
* ses spécialités
* sa façon de travailler
* des valeurs concrètes
* des coordonnées facilement accessibles

L'objectif est de reprendre cette philosophie mais avec un design nettement plus moderne.

---

# 2. PRINCIPLE DIRECTEUR

Le site doit donner cette impression :

> "Je sais exactement à qui je vais avoir affaire."

et non :

> "Ceci est un site de plombier généré à partir d'un template."

Le visiteur doit sentir :

* une vraie personne
* une vraie entreprise
* une vraie expérience
* de vrais chantiers
* une vraie implantation locale

---

# 3. INTERDICTIONS

Éviter absolument :

* les énormes textes marketing génériques
* les slogans artificiels
* les sections répétitives
* les cartes identiques avec une icône au-dessus
* les 3 colonnes systématiques
* les icônes provenant de bibliothèques génériques partout
* les emojis
* les gradients modernes artificiels
* les effets glassmorphism
* les ombres excessives
* les boutons surdimensionnés
* les animations partout
* les titres du type "Votre confort, notre priorité"
* les formulations génériques comme :

  * "Une expertise au service de vos projets"
  * "Des solutions adaptées à vos besoins"
  * "Votre satisfaction est notre priorité"
  * "Un savoir-faire unique"
  * "Une équipe à votre écoute"

Ces formulations peuvent être utilisées uniquement lorsqu'elles correspondent réellement à l'entreprise et qu'elles sont reformulées de manière naturelle.

---

# 4. DIRECTION ARTISTIQUE

Créer un design inspiré des entreprises artisanales haut de gamme.

Références stylistiques :

* architecture
* atelier
* matériaux
* chantier propre
* photographie documentaire
* maisons contemporaines
* artisanat français

Le design doit être sobre.

Il doit privilégier :

* espaces blancs
* grandes photographies
* typographie élégante
* détails subtils
* lignes fines
* contrastes modérés
* compositions asymétriques
* beaucoup de respiration

Ne pas chercher à remplir chaque espace.

---

# 5. SYSTÈME DE THÈME — MODE CLASSIQUE + MODE SOMBRE

Le site doit proposer **deux apparences complètes** :

1. Mode classique / clair
2. Mode sombre / dark

Le changement de thème doit être accessible directement depuis le header.

Créer un bouton discret permettant de passer de l'un à l'autre.

Exemple visuel :

☼ / ☾

ou un bouton avec une icône soleil/lune.

IMPORTANT :

Le dark mode ne doit PAS être une simple inversion automatique des couleurs.

Les deux thèmes doivent avoir été conçus comme deux variantes cohérentes de la même identité graphique.

---

## 5.1 MODE CLASSIQUE

Le mode classique doit être la référence principale.

Ambiance :

* claire
* chaleureuse
* artisanale
* premium
* naturelle

Privilégier :

* blanc cassé
* ivoire
* beige très léger
* gris chaud
* anthracite pour les textes
* couleur d'accent sobre

Éviter le blanc #FFFFFF omniprésent.

Préférer des fonds légèrement cassés afin d'obtenir un rendu plus chaleureux.

---

## 5.2 MODE SOMBRE

Le mode sombre doit avoir une vraie personnalité.

Ambiance :

* élégante
* premium
* contemporaine
* architecturale
* chaleureuse

Éviter le noir absolu partout.

Ne pas utiliser uniquement :

#000000

Préférer plusieurs niveaux de surfaces sombres :

* fond principal : presque noir / anthracite profond
* sections secondaires : légèrement plus claires
* cartes : contraste très subtil
* texte principal : blanc cassé
* texte secondaire : gris chaud

Exemple de hiérarchie :

Fond :
#111111

Surface :
#181818

Surface secondaire :
#202020

Texte principal :
#F2F0EA

Texte secondaire :
#B8B5AE

Les valeurs exactes peuvent être adaptées au design global.

---

## 5.3 COULEUR D'ACCENT

La couleur d'accent doit fonctionner dans les deux thèmes.

Elle peut être légèrement ajustée entre le mode clair et le mode sombre afin de conserver un contraste suffisant.

Éviter les couleurs trop saturées.

Privilégier une couleur qui rappelle éventuellement :

* cuivre
* bronze
* sable
* terre
* pierre
* métal

La couleur d'accent doit rester subtile.

Elle sert principalement à :

* CTA
* liens importants
* détails graphiques
* états actifs
* petits éléments de navigation

---

## 5.4 COMPORTEMENT DU SWITCH

Le changement de thème doit être :

* instantané
* fluide
* discret

Ajouter éventuellement une transition très courte sur :

* background
* color
* border-color
* box-shadow

Ne pas animer toute la page.

Éviter les transitions longues ou spectaculaires.

---

## 5.5 PRÉFÉRENCE UTILISATEUR

Le site doit idéalement :

1. détecter la préférence système lors de la première visite ;
2. utiliser `prefers-color-scheme` comme valeur initiale ;
3. permettre ensuite à l'utilisateur de choisir manuellement son thème ;
4. mémoriser son choix avec `localStorage`.

Si l'utilisateur choisit manuellement un thème, ce choix doit avoir priorité sur la préférence système.

---

## 5.6 ACCESSIBILITÉ DU DARK MODE

Vérifier le contraste des textes dans les deux modes.

Le dark mode doit rester parfaitement lisible.

Vérifier notamment :

* textes
* liens
* boutons
* formulaires
* placeholders
* bordures
* états hover
* états focus
* navigation
* footer

Ne pas utiliser du gris trop sombre pour les textes importants.

---

# 6. COULEURS

Créer un système de variables CSS / design tokens afin que les deux thèmes soient faciles à maintenir.

Exemple conceptuel :

```css
:root {
  --background: ...;
  --surface: ...;
  --surface-muted: ...;
  --text: ...;
  --text-muted: ...;
  --border: ...;
  --accent: ...;
}

[data-theme="dark"] {
  --background: ...;
  --surface: ...;
  --surface-muted: ...;
  --text: ...;
  --text-muted: ...;
  --border: ...;
  --accent: ...;
}
```

Ne pas disperser les couleurs en dur dans les composants.

L'ensemble du design doit utiliser les variables du système.

---

# 7. TYPOGRAPHIE

Utiliser maximum deux familles typographiques.

Une police principale très lisible pour les textes.

Une seconde police éventuellement plus distinctive pour les grands titres.

Les titres doivent être élégants mais pas extravagants.

Éviter les typographies trop "startup".

Le rendu doit davantage évoquer :

* architecture
* artisanat
* maison
* qualité

que :

* SaaS
* startup
* agence digitale.

La typographie doit rester cohérente dans les deux thèmes.

---

# 8. HEADER

Créer un header très simple.

À gauche :

LOGO / NOM DE L'ENTREPRISE

Au centre ou à droite :

* Accueil
* L'entreprise
* Services
* Réalisations
* Contact

À droite :

numéro de téléphone

bouton "Demander un devis"

et

switch clair / sombre.

Le téléphone doit rester facilement accessible.

Sur mobile :

* logo
* bouton téléphone
* switch thème
* menu hamburger

Ne pas créer un header gigantesque.

---

# 9. HERO

Le hero doit être beaucoup plus humain qu'un hero classique de site de plomberie.

Éviter :

"Votre expert plomberie et chauffage à Caen"

énorme titre + photo stock + bouton.

Préférer une vraie accroche basée sur l'entreprise.

Structure :

PETITE SURTITRE

"Plomberie & chauffage — [VILLE / SECTEUR]"

GRAND TITRE

Une phrase courte, humaine et spécifique à l'entreprise.

Exemple de structure :

"Un travail propre, des conseils clairs et un chantier bien mené."

Puis :

2 lignes maximum expliquant l'activité.

CTA principal :

"Demander un devis"

CTA secondaire :

"Appeler"

À côté :

UNE VRAIE PHOTO.

Priorité absolue aux photos réelles :

* artisan
* chantier
* véhicule
* installation
* salle de bains
* chaudière
* outils
* détails de réalisation

Ne pas utiliser de photo stock si une vraie photo est disponible.

Le hero doit être magnifique dans les deux thèmes.

---

# 10. BANDEAU DE RÉASSURANCE

Juste après le hero.

Créer une petite zone très sobre avec 3 ou 4 éléments maximum.

Exemple :

[XX ans]
d'expérience

[Zone]
Caen & alentours

[Devis]
gratuit

[Entreprise]
locale

Ne pas transformer cela en cartes avec grosses icônes.

---

# 11. PRÉSENTATION DE L'ENTREPRISE

Créer une vraie section humaine.

Titre possible :

"Une entreprise de terrain"

ou une formulation plus personnelle.

Composition :

IMAGE À GAUCHE

TEXTE À DROITE

Le texte doit raconter :

* qui dirige l'entreprise
* son parcours
* son expérience
* pourquoi l'entreprise existe
* sa façon de travailler

Cette partie est essentielle.

Le visiteur doit pouvoir comprendre en 20 secondes :

"Qui est cette personne ?"

---

# 12. SERVICES

Ne pas utiliser automatiquement une grille de 3 cartes identiques.

Présenter les services de manière plus éditoriale.

Exemple :

01
PLOMBERIE

Installation, rénovation, remplacement et réparation.

02
CHAUFFAGE

Installation, entretien et remplacement.

03
SALLE DE BAINS

Création et rénovation.

Chaque service peut être accompagné d'une vraie photographie.

Utiliser des compositions légèrement différentes entre les blocs.

Éviter l'impression de répétition automatique.

---

# 13. RÉALISATIONS

Cette section doit être très importante.

Créer une galerie de vrais chantiers.

Chaque réalisation doit contenir :

* photo
* type de chantier
* ville
* courte description

Exemple :

RÉNOVATION

Salle de bains complète

Caen

"Transformation complète d'une salle de bains avec remplacement de la douche, modification des réseaux et pose des équipements."

La photo doit être l'élément principal.

Ne pas mettre 12 informations autour de chaque projet.

---

# 14. "COMMENT NOUS TRAVAILLONS"

Créer une section expliquant le fonctionnement réel de l'entreprise.

Exemple :

01 — Premier échange

Nous échangeons sur votre besoin et vos contraintes.

02 — Visite / diagnostic

Nous regardons précisément l'installation et le chantier.

03 — Proposition

Vous recevez une proposition claire et détaillée.

04 — Intervention

Les travaux sont réalisés avec soin et le chantier est laissé propre.

IMPORTANT :

Ne pas utiliser de grosses icônes.

Utiliser simplement :

numéro + titre + texte.

---

# 15. VALEURS

S'inspirer directement de ce qui fonctionne chez Goya :

* proximité
* propreté du chantier
* professionnalisme
* respect des délais
* disponibilité

Mais ne pas recopier les textes.

Transformer ces valeurs en preuves concrètes.

Exemple :

PROPRETÉ

"Nous protégeons les zones de passage et nous laissons le chantier propre après notre intervention."

C'est beaucoup plus crédible qu'un simple :

"Nous sommes très professionnels."

---

# 16. AVIS CLIENTS

Les avis doivent sembler authentiques.

Éviter :

3 grosses cartes identiques avec étoiles jaunes.

Préférer :

un ou deux avis mis en avant.

Avec éventuellement :

Prénom

Ville

Type de chantier

Si les vrais avis Google sont disponibles, utiliser les formulations réelles.

Ne jamais inventer d'avis.

Adapter le rendu aux deux thèmes.

---

# 17. ZONE D'INTERVENTION

Créer une section locale.

Exemple :

"Nous intervenons à Caen et dans les communes alentours."

Puis afficher quelques communes pertinentes.

Ne pas créer un énorme nuage de villes uniquement pour le SEO.

La localisation doit sembler utile à l'utilisateur.

---

# 18. CTA FINAL

Le dernier CTA doit être simple.

Exemple :

"Vous avez un projet ? Parlons-en."

Puis :

"Expliquez-nous votre besoin, nous vous répondrons rapidement."

Boutons :

"Demander un devis"

"Appeler"

Ne pas mettre 5 boutons différents.

Créer un rendu particulièrement élégant dans le dark mode.

---

# 19. FOOTER

Footer très sobre.

Contenir :

* logo / nom
* activité
* zone d'intervention
* téléphone
* email
* adresse si pertinente
* horaires
* liens principaux
* mentions légales
* politique de confidentialité

Éviter les énormes footers avec 8 colonnes.

Le footer doit également être parfaitement adapté aux deux thèmes.

---

# 20. PHOTOGRAPHIES

C'est un point PRIORITAIRE.

Les photographies doivent participer à l'identité du site.

Priorité :

1. photos réelles de l'entreprise
2. photos réelles des chantiers
3. photos de l'artisan
4. photos des installations
5. éventuellement photos professionnelles complémentaires

Éviter les photos stock évidentes :

* plombier souriant avec casque
* personne devant un lavabo
* technicien posant avec une clé
* famille souriant dans une salle de bains générique

Le site doit sembler documenter une vraie activité.

Les photographies doivent fonctionner aussi bien sur fond clair que sombre.

Ne pas appliquer automatiquement un filtre sombre sur toutes les images en dark mode.

---

# 21. MICRO-DÉTAILS QUI DONNENT UN RENDU PREMIUM

Ajouter subtilement :

* petits labels
* numéros de sections
* lignes fines
* séparateurs
* légères variations de mise en page
* grandes images recadrées
* titres courts
* espaces généreux

Mais sans surcharger.

Les détails doivent fonctionner dans les deux thèmes.

---

# 22. ANIMATIONS

Très peu d'animations.

Utiliser uniquement :

* apparition légère au scroll
* déplacement très léger des images
* hover discret sur les boutons
* transition douce des liens
* transition très courte lors du changement de thème

Éviter :

* animations permanentes
* textes qui volent partout
* compteurs animés inutiles
* gros effets de parallaxe
* éléments qui rebondissent

Le site doit être calme.

---

# 23. RESPONSIVE

Le mobile est prioritaire.

Sur mobile :

* téléphone toujours accessible
* CTA facilement cliquable
* textes courts
* images bien recadrées
* aucun débordement horizontal
* sections suffisamment espacées
* menu simple
* formulaire court
* switch de thème facilement accessible

Éviter de simplement empiler toutes les sections desktop.

Certaines compositions doivent être repensées spécifiquement pour mobile.

Tester les deux thèmes sur mobile.

---

# 24. SEO

Le design ne doit pas dégrader le SEO.

Conserver une architecture claire :

Accueil
Entreprise
Services
Réalisations
Contact

Créer des pages spécifiques pour les services importants lorsque cela est pertinent.

Utiliser naturellement :

* plomberie
* chauffage
* rénovation
* salle de bains
* dépannage si réellement proposé
* ville
* communes d'intervention

Ne pas bourrer les textes de mots-clés.

Le contenu doit d'abord être écrit pour un humain.

---

# 25. PERFORMANCE

Le site doit rester rapide.

Priorités :

* images optimisées
* formats WebP/AVIF lorsque possible
* lazy loading
* peu de JavaScript
* peu de bibliothèques inutiles
* polices optimisées
* animations légères

Le changement de thème doit également être performant.

Éviter un "flash" blanc ou sombre au chargement de la page lorsque le thème utilisateur est déjà mémorisé.

---

# 26. ACCESSIBILITÉ

Respecter les bonnes pratiques d'accessibilité.

Notamment :

* contraste suffisant dans les deux thèmes
* focus visible
* navigation clavier
* labels des formulaires
* textes alternatifs des images
* boutons clairement identifiables
* taille de texte confortable

Le switch de thème doit avoir un vrai label accessible.

Exemple :

"Activer le mode sombre"

ou

"Activer le mode clair"

---

# 27. RÈGLE FONDAMENTALE : AUTHENTICITÉ

À chaque fois qu'une décision de design est prise, poser cette question :

> "Est-ce que cela pourrait apparaître sur 500 autres sites d'artisans générés avec une IA ?"

Si oui :

→ chercher une alternative plus personnelle.

Le site doit avoir quelques imperfections maîtrisées et des choix graphiques spécifiques.

Il ne doit pas être parfaitement uniforme.

---

# 28. RÈGLE FONDAMENTALE : NE PAS TOUT REFAIRE

Avant de modifier le code :

1. analyser le projet existant
2. identifier la stack
3. identifier les composants existants
4. identifier les contenus déjà disponibles
5. identifier les fonctionnalités existantes
6. conserver ce qui fonctionne
7. modifier uniquement ce qui doit l'être

Ne pas réécrire toute l'application sans raison.

---

# 29. PROCESSUS DE TRAVAIL

Étape 1 :

Analyser l'intégralité du projet existant.

Étape 2 :

Identifier :

* framework
* composants
* styles
* assets
* pages
* responsive
* système de navigation

Étape 3 :

Créer une proposition de nouvelle direction visuelle.

Étape 4 :

Mettre en place le système de design avec variables :

* couleurs
* typographie
* espacements
* bordures
* surfaces
* états

Étape 5 :

Implémenter les deux thèmes :

* classique
* sombre

Étape 6 :

Refondre d'abord :

* header
* hero
* section entreprise
* services
* réalisations
* CTA
* footer

Étape 7 :

Adapter le responsive.

Étape 8 :

Vérifier la cohérence de toutes les pages.

Étape 9 :

Tester chaque composant dans les deux thèmes.

Étape 10 :

Supprimer les éléments génériques / répétitifs.

Étape 11 :

Optimiser performances et accessibilité.

---

# 30. TEST OBLIGATOIRE DES DEUX THÈMES

Avant de considérer le travail terminé, vérifier chaque page en :

### MODE CLASSIQUE

Vérifier :

* lisibilité
* contraste
* cohérence des fonds
* CTA
* images
* navigation
* formulaires

### MODE SOMBRE

Vérifier :

* lisibilité
* contraste
* hiérarchie visuelle
* bordures
* cartes
* boutons
* images
* formulaires
* footer

Le dark mode doit sembler avoir été conçu volontairement.

Il ne doit jamais donner l'impression d'être :

> "le même site avec un filtre noir."

---

# 31. CRITÈRE DE RÉUSSITE

À la fin, une personne qui arrive sur le site doit pouvoir comprendre en moins de 10 secondes :

1. Quelle entreprise est-ce ?
2. Où intervient-elle ?
3. Que fait-elle ?
4. Pourquoi lui faire confiance ?
5. Comment la contacter ?

Et surtout elle doit avoir l'impression :

> "C'est une vraie entreprise locale qui connaît son métier."

et non :

> "C'est un template de site de plombier."

Le mode sombre doit donner en plus cette impression :

> "Le site est vraiment bien conçu."

et non :

> "Ils ont simplement ajouté un dark mode."

---

# 32. IMPORTANT POUR CODEX / CLAUDE

Ne pas générer immédiatement du code.

Commencer par analyser le projet existant.

Puis fournir un court compte-rendu :

* architecture actuelle
* problèmes UX
* problèmes visuels
* éléments à conserver
* éléments à modifier
* proposition de nouvelle structure
* proposition du système clair/sombre

Ensuite seulement commencer les modifications.

Lors des modifications :

* conserver les fonctionnalités existantes
* éviter les dépendances inutiles
* respecter la stack actuelle
* écrire du code propre
* privilégier la simplicité
* ne pas créer de composants artificiellement complexes

Le résultat doit être production-ready.

---

# 33. INSPIRATION GÉNÉRALE

S'inspirer de Goya pour :

* l'aspect humain
* la présentation de l'artisan
* l'ancrage local
* les valeurs concrètes
* la simplicité
* la confiance

Mais moderniser fortement :

* la typographie
* les espaces
* les photographies
* la hiérarchie visuelle
* les CTA
* les réalisations
* le responsive
* la navigation
* le système de thème clair/sombre

Objectif final :

> **Un site d'artisan moderne en 2026, avec deux expériences visuelles cohérentes : une version classique chaleureuse et une version sombre premium.**

Pas un site SaaS.
Pas un template WordPress.
Pas un site "IA".
Pas une landing page marketing agressive.

Un vrai site d'entreprise.
