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

//null for testnet
var apikey = null;
//var apikey = "YOUR-API-KEY";

if (apikey != null)
	var settings = {
		"network": "mainnet",
		"privateSeed" : null,
		"apiKey" : apikey
	}
else
	var settings = {
		"network": "testnet",
		"privateSeed" : null
	}
	
window.onload = function () {
	colu = new Colu(settings);
	colu.init();
	document.getElementById("addc").onclick = function(){
		AddChoix(this.parentNode);
	};
	document.getElementById("addv").onclick = function(){
		AddVotant(this.parentNode);
	};
	document.getElementById("rmv1").onclick = function(){
		removevot(this.parentNode);
	};
	document.getElementById("rmv2").onclick = function(){
		removevot(this.parentNode);
	};
	document.getElementById("gogen").onclick = function(){
		Generate();
	};
	var dropZone = document.getElementById('drop_zone');
	dropZone.addEventListener('dragover', handleDragOver, false);
	dropZone.addEventListener('dragleave', function( event ) {
		dropZone.style.fontSize="20px";
	}, false);
	dropZone.addEventListener('drop', handleFileSelect, false);
	node = document.getElementById("listevotants").childNodes; 
	for(child in node){
		if (node[child].nodeName === "#text"){
			node[child].remove();
		}
	};
}

function sendtokens(args){
	console.log("Sending");
		colu.sendAsset(args, function (err, body) {
			if (err) {
				var evalRespond = {};
				evalRespond.type = 'error';
				evalRespond.response = err;
				console.log(evalRespond.response);
				document.getElementById("loading").innerHTML = 'ERREUR<br>'+evalRespond.response.error;
				return;
			}
			var evalRespond = {};
			evalRespond.type = 'message';
			evalRespond.response = body;
			var txid = evalRespond.response.txid;
			console.log(txid);
			document.getElementById("loading").remove();
			var overlay = document.getElementById("overlay");
			overlay.classList.remove("toggle");
		});
}
function AddChoix(dom){
	var pid = dom;
	var addbtn = document.getElementById("addc");
	var addbtnrmv = pid.removeChild(addbtn);
	var par = document.createElement("P");
	var inputc = document.createElement("input");
	inputc.type = "text";
	inputc.value = "Choix";
	par.appendChild(inputc);
	par.appendChild(addbtnrmv);
	document.getElementById("listechoix").appendChild(par); 
};
function AddVotant(dom){
	var pid = dom;
	var addbtn = document.getElementById("addv");
	var addbtnrmv = pid.removeChild(addbtn);
	var par = document.createElement("P");
	var inputv = document.createElement("input");
	inputv.type = "text";
	inputv.value = "Nom Votant";
	var inputva = document.createElement("input");
	inputva.type = "text";
	inputva.value = "Adresse Votant";
	var delbtn = document.createElement("input");
	delbtn.type = "button";
	delbtn.value = "X";
	par.appendChild(inputv);
	par.appendChild(inputva);
	par.appendChild(delbtn);
	par.appendChild(addbtnrmv);
	delbtn.onclick = function(){
		removevot(this.parentNode);
	};
	document.getElementById("listevotants").appendChild(par);
};
function removevot(dom){
	var nvot = dom.parentNode.childElementCount;
	if (nvot > 2) {
		if (dom.lastChild.value==="+"){
			var addbtnrmv = dom.removeChild(dom.lastChild);
			dom.parentNode.childNodes[nvot-1].appendChild(addbtnrmv);
		}
		dom.remove();
	}
	else
		console.log("Il faut au moins 2 votants!");
};
function GoProcess(choix, votants) { 
	var overlay = document.getElementById("overlay");
	overlay.classList.add("toggle");
	document.getElementById("loading").innerHTML = 'Patientez...';
	var privateSeed = colu.hdwallet.getPrivateSeed();
	var mainadr = colu.hdwallet.getAddress();
	address = mainadr;
	console.log(address);
	adrchoix = {"choix":[],"Token":[]};
	choix.forEach(function(entry) {
		adrchoix.choix.push({"Nom":entry,"Adresse":colu.hdwallet.getAddress()});
	});
	nbrvotants = votants.length;
	console.log(address);
	console.log(document.getElementById('textname').value);
	var asset = {
		"amount": nbrvotants,
		"divisibility": 0,
		"reissueable": false,
		"transfer": [{
			"amount": nbrvotants,
		}],
		"metadata": {
			"assetName": document.getElementById('textname').value,
			"issuer": document.getElementById('textorga').value,
			"description": "Token de vote"
		}
	};
	//create n token
	colu.issueAsset(asset, function (err, body) {
		if (err) {
			evalRespond = {};
			evalRespond.type = 'error';
			evalRespond.response = err;
			console.log("Erreur");
			document.getElementById("loading").innerHTML = 'ERREUR';
			return;
		}
		console.log(body);
		var assetId = body.assetId;
		var args = 	{
			"from": [body.issueAddress],
			"to": [],
		};
		console.log(adrchoix);
		adrchoix.Token.push({"Name":asset.metadata.assetName,"ID":body.assetId, "Organizer":asset.metadata.issuer});
		var data = new Blob(["var adrchoix = "+JSON.stringify(adrchoix)], {type: 'text/plain'});
		textFile = window.URL.createObjectURL(data);
		document.getElementById('linkch').href = textFile;
		document.getElementById('downloadlink').style.display = 'block';
		var datav = new Blob(["var votants = "+JSON.stringify(votants)], {type: 'text/plain'});
		textFile = window.URL.createObjectURL(datav);
		document.getElementById('linkvotants').href = textFile;
		document.getElementById('downloadvotants').style.display = 'block';
		document.getElementById('howtodet').style.display = 'none';
		votants.forEach(function(item) {
			if (item.phone != undefined)
				args.to.push({
					"phoneNumber": item.phone,
					"assetId": assetId,
					"amount": 1 });
			if (item.adresse != undefined)
				args.to.push({
					"address": item.adresse,
					"assetId": assetId,
					"amount": 1 });
		});
		setTimeout(sendtokens, 4000, args);
	});
};
function Generate(){
	if (document.getElementById('textname').value.length > 0 ){
		var choix = [];
		var nodearray = Array.from(document.getElementById("listechoix").childNodes);
		nodearray.forEach(function(entry) {
			if (typeof entry.childNodes[0] !== "undefined"){
				choix.push(entry.childNodes[0].value);
			}
		});
		var votants = [];
		var nodearray = Array.from(document.getElementById("listevotants").childNodes);
		nodearray.forEach(function(entry) {
			if (typeof entry.childNodes[0] !== "undefined"){
				votants.push({"nom": entry.childNodes[0].value, "adresse":entry.childNodes[1].value});
			}
		});
		console.log(JSON.stringify(votants));
		setTimeout(GoProcess, 200, choix,votants);
	}
};
function handleFileSelect(evt) {
    evt.stopPropagation();
    evt.preventDefault();
	document.getElementById("drop_zone").style.fontSize="20px";
    var files = evt.dataTransfer.files;
	var reader = new FileReader();
	if (files[0].name==="vote-setup.json"){
		reader.onload = function(event) {
			var code = event.target.result;
			eval(code);
			loadchoixfromfile(adrchoix);
		};
	};
	if (files[0].name==="votants.json"){
		reader.onload = function(event) {
			var code = event.target.result;
			eval(code);
			loadvotantsfromfile(votants);
		};
	};
	reader.readAsText(files[0]);
}
function handleDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy';
	document.getElementById("drop_zone").style.fontSize="30px";
}
function loadchoixfromfile(filecontent){
	document.getElementById("textname").value = filecontent.Token[0].Name;
	document.getElementById("textorga").value = filecontent.Token[0].Organizer;
	var domchoix = document.getElementById("listechoix");
	while (domchoix.hasChildNodes()) {
		domchoix.removeChild(domchoix.lastChild);
	}
	console.log("Chargement des choix");
	filecontent.choix.forEach(function(entry) {
		var pid = document.getElementById("listechoix");
		var par = document.createElement("P");
		var inputc = document.createElement("input");
		inputc.type = "text";
		inputc.value = entry.Nom;
		par.appendChild(inputc);
		pid.appendChild(par); 
	});
	var addchbtn = document.createElement("input");
	addchbtn.type = "button";
	addchbtn.value = "+";
	addchbtn.name="Addc";
	addchbtn.id="addc";
	document.getElementById("listechoix").lastChild.appendChild(addchbtn);
	addchbtn.onclick = function(){
		AddChoix(this.parentNode);
	};
}
function loadvotantsfromfile(filecontent){
	var domvotants = document.getElementById("listevotants");
	while (domvotants.hasChildNodes()) {
		domvotants.removeChild(domvotants.lastChild);
	}
	console.log("Chargement des votants");
	filecontent.forEach(function(entry) {
		var pid = document.getElementById("listechoix");
		var par = document.createElement("P");
		var inputv = document.createElement("input");
		inputv.type = "text";
		inputv.value = entry.nom;
		var inputva = document.createElement("input");
		inputva.type = "text";
		inputva.value = entry.adresse;
		var delbtn = document.createElement("input");
		delbtn.type = "button";
		delbtn.value = "X";
		par.appendChild(inputv);
		par.appendChild(inputva);
		par.appendChild(delbtn);
		document.getElementById("listevotants").appendChild(par);
		delbtn.onclick = function(){
			removevot(this.parentNode);
		};
	});
	var addvotbtn = document.createElement("input");
	addvotbtn.type = "button";
	addvotbtn.value = "+";
	addvotbtn.name="Addv";
	addvotbtn.id="addv";
	document.getElementById("listevotants").lastChild.appendChild(addvotbtn);
	addvotbtn.onclick = function(){
		AddVotant(this.parentNode);
	};
}