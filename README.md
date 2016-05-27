  Civic Dapp
===========

Civic Dapp est un système de vote basé sur les protocoles ColoredCoin et Bitcoin.

## Récupérer Civic Dapp

Vous pouvez télécharger un paquet zip dans la section "release":
https://github.com/antonio-fr/CivicDapp/releases

Civic Dapp contient les librairies javascript :
* colu-client
* qrcode

## Initialisation

Pour utiliser Civic Dapp, il est nécessaire d'avoir une clé d'accès API au système Colu. https://dashboard.colu.co/#/settings

Si vous n'avez de compte: 
https://dashboard.colu.co/register 

Sans clé API, le système Civic utilise le testnet. Néanmoins, aucun wallet smartphone n'est disponible sur le testnet.

La clé API Colu est à saisir dans les premières lignes du fichier setup/main.js .

`var apikey = "YOUR-API-KEY";`

On peut éventuellement indiquer un RegEx pour les numéros de téléphones. Cela correspond à des numéros de portables français dans le code.

## Préparer le vote

Charger dans un navigateur web, à partir des fichiers locaux ou d'un serveur web le fichier setup/index.html. Vous n'avez pas réellement besoin d'un serveur web Civic Dapp peut fonctionner directement dans un navigateur.

Entrez les informations suivantes :
* Nom du vote
* Nom de l'organisateur
* Les différents choix possibles
* Les votants (nom et adresses ou numéro de téléphone)

Attention : Les numéros de téléphones sont à saisir en format international (i.e. +336...).

Si vous avez déjà effectué un vote, vous pouvez importer les fichiers de configuration en glisser-déposer dans la zone dédiée.

`vote-setup.json` qui contient les informations nécessaires pour le vote.

`votants.json` qui contient la liste des votants et leur adresse.
 
Pour une édition manuelle ou à travers un script de génération, la syntaxe de vote-setup.json est :
```
var adrchoix = {"choix":[
 {"Nom":"Choix1","Adresse":"mXXXXXX"},
 {"Nom":"Choix2","Adresse":"mXXXXXX"},
 {"Nom":"Choix3","Adresse":"mXXXXXX"}
]
, "Token":[
 {"Name":"Vote Bidule",
 "ID":"LXXXXXXXXX",
 "Organizer":"NomOrga"}
]}
```

Pour une édition manuelle ou à travers un script de génération, la syntaxe de votants.json est:
```
var votants = [
 {"nom":"Votant1","adresse":"mXXXXXX"},
 {"nom":"votant2","adresse":"mXXXXXX"},
 {"nom":"Votant3","adresse":"mXXXXXX"},
 {"nom":"Votant4","adresse":"mXXXXXX"}
]
```

Cliquer sur "Générer"
Civic Dapp va alors effectuer les tâches suivantes:
* Création d'un token de vote indivisible (autant que de votants)
* Envoie des tokens de vote à chaque votant
* Création de fichiers de config pour import ultérieur des datas.

Sauvegarder le fichier vote-setup.json dans le dossier "panel".

Sauvegarder éventuellement le fichier "votants.json" pour recharger ultérieurement la liste des votants. 

## Démarrer le vote

Une fois les données du vote générés, le vote en lui-même peut se dérouler. Chacun des votants a normalement reçu lors de la mise en place un token de vote pour choisir une réponse au vote.

Après avoir posé le fichier setup-vote.json dans le répertoire panel (fichier téléchargé lors de la phase de préparation), charger dans un navigateur web, à partir des fichiers locaux ou d'un serveur web le fichier panel/votes.html.

La page affche alors un QRCode par choix possible. Chaque votant peut envoyer son token de vote à son choix. Chaque choix affiche le nombre de votes en temps réel (mise à jour toutes les 15 secondes).

A la fin de la session de vote, l'organisateur peut proclamer "choix vainqueur" l'adresse qui a reçue le plus de tokens de vote.

## A faire
* Internationalisation, english language
* Amélioration du CSS web pour des pages plus "responsive" (selon la résolution)


License :
----------

Civic Dapp : Vote with ColoredCoin and Bitcoin protocol 
Copyright (C) 2016  Antoine FERRON & Alexandre DAVID

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, version 3 of the License.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
