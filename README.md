# AGRIBAC – Site internet de la ferme avicole

Site vitrine et de commande d'**AGRIBAC**, ferme avicole de poulets de chair à Brofodoumé (District d'Abidjan, Côte d'Ivoire).
*« Le goût naturel, de notre ferme à votre table. »*

## Pages

| Page | Fichier |
|---|---|
| Accueil | `index.html` |
| Notre Ferme | `ferme.html` |
| Nos Poulets | `poulets.html` |
| Nos Prix (avec estimateur) | `prix.html` |
| Commander (bon de commande → WhatsApp) | `commander.html` |
| Livraison | `livraison.html` |
| Professionnels / Grossistes (demande de devis) | `professionnels.html` |
| Contact (formulaire + carte) | `contact.html` |
| Page d'erreur | `404.html` |

Un bouton **« Commander sur WhatsApp »** est présent dans l'en-tête, dans chaque page et en bouton flottant.

## À faire avant la mise en ligne : `assets/js/config.js`

Tous les réglages sont dans **un seul fichier** : `assets/js/config.js`.

```js
whatsapp: "2250700000000",       // votre numéro WhatsApp, chiffres uniquement
telephone: "+225 07 00 00 00 00",
email: "contact@exemple.ci",
prixKg: 2500,                    // prix du kilo en FCFA, ou null = « sur demande »
prixMaj: "29 octobre 2026",
horaires: "Du lundi au samedi, 7h – 18h",
```

Tant que le numéro WhatsApp est vide, les boutons WhatsApp mènent à la page Contact
et le site affiche « Numéro bientôt disponible ».

## Fonctionnement des commandes

Il n'y a pas de serveur : les formulaires (commande, devis, contact) rédigent automatiquement
un message et ouvrent WhatsApp vers le numéro d'AGRIBAC. Le client n'a plus qu'à appuyer sur « Envoyer ».

## Mise en ligne

Site statique (HTML/CSS/JS, aucune installation) : il peut être hébergé gratuitement sur
GitHub Pages, Netlify ou chez n'importe quel hébergeur. Pour GitHub Pages :
*Settings → Pages → Deploy from a branch* et choisir la branche.

Une fois le nom de domaine connu, pensez à ajouter un `sitemap.xml` et des URL absolues
pour les images de partage (`og:image`).

## Structure

```
assets/css/style.css   styles (couleurs vert/or AGRIBAC)
assets/js/config.js    réglages (numéros, prix)
assets/js/main.js      menu mobile, WhatsApp, formulaires, estimateur
assets/img/            logo, photos de la ferme, des poulets et des emballages
```

## Images

- Logo, emballages et visuels de la ferme : fournis par AGRIBAC.
- `poulets-elevage.webp` et `poulets-chair.webp` : vérifiez que vous avez les droits d'utilisation
  (elles ressemblent à des photos de banques d'images). L'idéal est de les remplacer par de vraies
  photos de la ferme, en gardant le même nom de fichier.
