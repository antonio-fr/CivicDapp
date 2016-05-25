// Civic Dapp
// Copyright (C) 2016 Antoine FERRON & Alexandre DAVID 
// Vote with ColoredCoin and Bitcoin protocol
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, version 3 of the License.
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>

function testrcv(choix){
	var receivedok=false;
	var xrhttp = new XMLHttpRequest();
	xrhttp.onreadystatechange = function() {
		if (xrhttp.readyState == 4){
			if (xrhttp.status == 200) {
				result = JSON.parse(xrhttp.responseText);
				if(result.assets.length>0){
					if (result.assets[0].assetId === adrchoix.Token[0].ID){ 
						fundinaddr = result.assets[0].received;
					}else{
						fundinaddr = 0;}
				}else{
					fundinaddr = 0; }
				console.log(fundinaddr);
				nomvote = " vote"
				if (fundinaddr>1)
					nomvote += "s"
				document.getElementById("Choix"+choix.Nom).innerHTML = fundinaddr+nomvote;	
			}
			else {
				console.log("Error");
			}
			setTimeout(testrcv, 15000, choix);
		}
	};
	xrhttp.onerror =  function(e){
		console.log("Error");
		setTimeout(testrcv, 15000, choix);
	};
	xrhttp.open("GET", "https://explorer.coloredcoins.org/api/GetAddressInfo?address="+choix.Addresse, true);
	xrhttp.setRequestHeader("Cache-Control", "no-cache,no-store");
	xrhttp.setRequestHeader("Pragma", "no-cache");
	xrhttp.setRequestHeader("Expires", -1);
	xrhttp.send();
};
window.onload = function () {
	console.log(adrchoix)
	document.getElementById("votename").innerHTML = adrchoix.Token[0].Name;
	document.getElementById("organizer").innerHTML = "Organis&eacute; par "+adrchoix.Token[0].Organizer;
	adrchoix.choix.forEach(function(choix) {
		var divchoix = document.createElement('div');
		divchoix.id = "DivChoix"+choix.Nom;
		divchoix.classList.add('chosen');
		var nomchoix = document.createElement('h3');
		nomchoix.innerHTML = choix.Nom;
		var elemDiv = document.createElement('p');
		elemDiv.id = "Choix"+choix.Nom;
		divchoix.appendChild(nomchoix);
		document.body.appendChild(divchoix);
		var qrcode = new QRCode(divchoix.id, {width:202,height: 202, correctLevel : QRCode.CorrectLevel.M});
		qrcode.makeCode("bitcoin:"+choix.Addresse);
		divchoix.appendChild(elemDiv);
		var address = choix.Addresse;
		setTimeout(testrcv, 500, choix);
		var divchoix = document.getElementById('Organizer').appendChild(divchoix);
	})
}