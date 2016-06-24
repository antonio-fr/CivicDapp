  Civic Dapp
===========

Civic Dapp is a voting system based on Bitcoin and ColoredCoin protocols.

Une version française des instructions est présente après celle en anglais.

## Get Civic Dapp

You can get a zip packed file in "release" section:
https://github.com/antonio-fr/CivicDapp/releases

Civic Dapp is embedding the following javascript libraries:
* colu-client
* qrcode

## Initialization

To use Civic Dapp, you need an API key for Colu system. https://dashboard.colu.co/#/settings

In case you don't have any account yet: 
https://dashboard.colu.co/register 

Without an API key, the Civic system will use testnet. Nevertheless, there's no smartphone wallet available for testnet.

The Colu API key needs to be entered in the first lines in setup/main.js file.

`var apikey = "YOUR-API-KEY";`

You can eventually setup a RegEx for phone numbers. In the present code, this matches French telephone numbers.

## Vote Setup

Load in a web browser from local files or with a web server the file setup/index.html. You don't need a web server to run Civic Dapp, it can run directly in a web browser.

Enter the information concerning :
* Vote name
* Organizer name
* All the possible choices
* The voters (name and address or phone number)

Important notice : The phone numbers shall be input using international format (i.e. +1....).

If you already performed a vote, you can import configuration files using drag-and-drop in the dedicated zone.

`vote-setup.json` saves the needed info for the vote.

`voters.json` saves the voters list and their address (or phone).
 
For a manual edition or from a generation script, vote-setup.json syntax is :
```
var choiceadr = {"choices":[
 {"Name":"Choice1","Address":"mXXXXXX"},
 {"Name":"Choice2","Address":"mXXXXXX"},
 {"Name":"Choice3","Address":"mXXXXXX"}
]
, "Token":[
 {"Name":"Vote Bidule",
 "ID":"LXXXXXXXXX",
 "Organizer":"NomOrga"}
]}
```

For a manual edition or from a generation script, voters.json syntax is :
```
var voters = [
 {"name":"Votant1","address":"mXXXXXX"},
 {"name":"votant2","address":"mXXXXXX"},
 {"name":"Votant3","address":"mXXXXXX"},
 {"name":"Votant4","address":"mXXXXXX"}
]
```

or instead of the address : ```"phone":"+1xxxxx"```

Click on "Generate the election"
Civic Dapp is then performing the following tasks:
* Creation of the indivisible vote tokens (as many as voters)
* Tokens sending to every single voter
* Config file creation for future data importation

Get and save "vote-setup.json" file in the "panel" directory.

You can also save "voters.json" file for a future fast loading of the voters list.

## Start the vote

Once the data for the vote are generated, the vote can actually happen. Each voter did normally receive a vote token during the setup stage. This token allows the voter to choose a proposal. 

After saving the setup-vote.json file in panel directory (file downloaded at the end of the setup stage), load in a web browser from local files or with a web server the file panel/votes.html. 

The web page displays a QRcode for every possible choice. Every voter can send its token to his choice. The page displays the number of vote in real time (updated every 15 seconds).

At the end of the vote session, the organizer can claim "winning choice" the address which received the most tokens.


  Civic Dapp (utilisation en français)
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
* Les votants(nom et adresses ou numéro de téléphone)

Attention : Les numéros de téléphones sont à saisir en format international (i.e. +336...).

Si vous avez déjà effectué un vote, vous pouvez importer les fichiers de configuration en glisser-déposer dans la zone dédiée.

`vote-setup.json` qui contient les informations nécessaires pour le vote.

`voters.json` qui contient la liste des votants et leur adresse.
 
Pour une édition manuelle ou à travers un script de génération, la syntaxe de vote-setup.json est :
```
var choiceadr = {"choices":[
 {"Name":"Choice1","Address":"mXXXXXX"},
 {"Name":"Choice2","Address":"mXXXXXX"},
 {"Name":"Choice3","Address":"mXXXXXX"}
]
, "Token":[
 {"Name":"Vote Bidule",
 "ID":"LXXXXXXXXX",
 "Organizer":"NomOrga"}
]}
```

Pour une édition manuelle ou à travers un script de génération, la syntaxe de voters.json est:
```
var voters = [
 {"name":"Votant1","address":"mXXXXXX"},
 {"name":"votant2","address":"mXXXXXX"},
 {"name":"Votant3","address":"mXXXXXX"},
 {"name":"Votant4","address":"mXXXXXX"}
]
```

ou bien ````"phone":"+336xxxx"```

Cliquer sur "Generate the election"
Civic Dapp va alors effectuer les tâches suivantes:
* Création d'un token de vote indivisible (autant que de votants)
* Envoie des tokens de vote à chaque votant
* Création de fichiers de config pour import ultérieur des datas.

Sauvegarder le fichier vote-setup.json dans le dossier "panel".

Sauvegarder éventuellement le fichier "voters.json" pour recharger ultérieurement la liste des votants. 

## Démarrer le vote

Une fois les données du vote générés, le vote en lui-même peut se dérouler. Chacun des votant a normalement reçu lors de la mise en place un token de vote pour choisir une réponse au vote.

Après avoir posé le fichier setup-vote.json dans le répertoire panel (fichier téléchargé lors de la phase de préparation), charger dans un navigateur web, à partir des fichiers locaux ou d'un serveur web le fichier panel/votes.html.

La page affiche alors un QRCode par choix possible. Chaque votant peut envoyer son token de vote à son choix. Chaque choix affiche le nombre de votes en temps réel (mise à jour toutes les 15 secondes).

A la fin de la session de vote, l'organisateur peut proclamer "choix vainqueur" l'adresse qui a reçue le plus de tokens de vote.


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
