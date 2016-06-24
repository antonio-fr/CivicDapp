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

function testrcv(choices){
	var receivedok=false;
	var xrhttp = new XMLHttpRequest();
	xrhttp.onreadystatechange = function() {
		if (xrhttp.readyState == 4){
			if (xrhttp.status == 200) {
				result = JSON.parse(xrhttp.responseText);
				if(result.assets.length>0){
					if (result.assets[0].assetId === choiceadr.Token[0].ID){ 
						fundinaddr = result.assets[0].received;
					}else{
						fundinaddr = 0;}
				}else{
					fundinaddr = 0; }
				console.log(fundinaddr);
				nomvote = " vote"
				if (fundinaddr>1)
					nomvote += "s"
				document.getElementById("Choice"+choices.Name).innerHTML = fundinaddr+nomvote;	
			}
			else {
				console.log("Error");
			}
			setTimeout(testrcv, 15000, choices);
		}
	};
	xrhttp.onerror =  function(e){
		console.log("Error");
		setTimeout(testrcv, 15000, choices);
	};
	xrhttp.open("GET", "https://explorer.coloredcoins.org/api/GetAddressInfo?address="+choices.Address, true);
	xrhttp.setRequestHeader("Cache-Control", "no-cache,no-store");
	xrhttp.setRequestHeader("Pragma", "no-cache");
	xrhttp.setRequestHeader("Expires", -1);
	xrhttp.send();
};
window.onload = function () {
	console.log(choiceadr)
	document.getElementById("votename").innerHTML = choiceadr.Token[0].Name;
	document.getElementById("organizer").innerHTML = "Organized by "+choiceadr.Token[0].Organizer;
	choiceadr.choices.forEach(function(choices) {
		var divchoices = document.createElement('div');
		divchoices.id = "DivChoice"+choices.Name;
		divchoices.classList.add('chosen');
		var nomchoices = document.createElement('h3');
		nomchoices.innerHTML = choices.Name;
		var elemDiv = document.createElement('p');
		elemDiv.id = "Choice"+choices.Name;
		divchoices.appendChild(nomchoices);
		document.body.appendChild(divchoices);
		var qrcode = new QRCode(divchoices.id, {width:202,height: 202, correctLevel : QRCode.CorrectLevel.M});
		qrcode.makeCode("bitcoin:"+choices.Address);
		divchoices.appendChild(elemDiv);
		var address = choices.Address;
		setTimeout(testrcv, 500, choices);
		var divchoices = document.getElementById('Organizer').appendChild(divchoices);
	})
}