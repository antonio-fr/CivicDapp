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

// Enter Mobile Phone RegEx of your country
var PhoneRegEx = /^[+]33[67][0-9]{8}$/;


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
		AddChoice(this.parentNode);
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
}

function sendtokens(args){
	console.log("Sending");
		colu.sendAsset(args, function (err, body) {
			if (err) {
				var evalRespond = {};
				evalRespond.type = 'error';
				evalRespond.response = err;
				console.log(evalRespond.response);
				document.getElementById("loading").innerHTML = 'ERROR<br>'+evalRespond.response.error;
				return;
			}
			var evalRespond = {};
			evalRespond.type = 'message';
			evalRespond.response = body;
			var txid = evalRespond.response.txid;
			document.getElementById("gogen").style.display = "none";
			console.log(txid);
			var domsuc = document.getElementById("Success");
			if (settings.network == "testnet")
				var urltx = "http://coloredcoins.org/explorer/testnet/tx/"+txid;
			if (settings.network == "mainnet")
				var urltx = "http://coloredcoins.org/explorer/tx/"+txid;
			document.getElementById('linktxid').href = urltx;
			domsuc.style.display = "block";
			document.getElementById("loading").remove();
			var overlay = document.getElementById("overlay");
			overlay.classList.remove("toggle");
			document.getElementById("textname").scrollIntoView();
		});
}
function AddChoice(dom){
	var pid = dom;
	var addbtn = document.getElementById("addc");
	var addbtnrmv = pid.removeChild(addbtn);
	var par = document.createElement("div");
	par.className = "fieldset";
	var inputc = document.createElement("input");
	inputc.type = "text";
	inputc.placeholder = "Choice";
	par.appendChild(inputc);
	par.appendChild(addbtnrmv);
	document.getElementById("choicelist").appendChild(par); 
};
function AddVotant(dom){
	var pid = dom;
	var addbtn = document.getElementById("addv");
	var addbtnrmv = pid.removeChild(addbtn);
	var par = document.createElement("div");
	par.className = "fieldset";
	var inputv = document.createElement("input");
	inputv.type = "text";
	inputv.placeholder = "Voter Name";
	var inputva = document.createElement("input");
	inputva.type = "text";
	inputva.placeholder = "Voter Address or Phone";
	var delbtn = document.createElement("input");
	delbtn.type = "button";
	delbtn.className = "rmvc";
	par.appendChild(inputv);
	par.appendChild(inputva);
	par.appendChild(delbtn);
	par.appendChild(addbtnrmv);
	delbtn.onclick = function(){
		removevot(this.parentNode);
	};
	document.getElementById("voterslist").appendChild(par);
};
function removevot(dom){
	var nvot = dom.parentNode.childElementCount;
	if (nvot > 2) {
		if (dom.lastChild.id === "addv"){
			var addbtnrmv = dom.removeChild(dom.lastChild);
			dom.parentNode.children[nvot-2].appendChild(addbtnrmv);
		}
		dom.remove();
	}
	else
		console.log("2 voters needed at least!");
};
function GoProcess(choices, voters) { 
	var overlay = document.getElementById("overlay");
	overlay.classList.add("toggle");
	document.getElementById("loading").innerHTML = 'Please Wait...';
	var privateSeed = colu.hdwallet.getPrivateSeed();
	var mainadr = colu.hdwallet.getAddress();
	address = mainadr;
	console.log(address);
	choiceadr = {"choices":[],"Token":[]};
	choices.forEach(function(entry) {
		choiceadr.choices.push({"Name":entry,"Address":colu.hdwallet.getAddress()});
	});
	numvoters = voters.length;
	console.log("Vote "+document.getElementById('textname').value+" setup in progress");
	var asset = {
		"amount": numvoters,
		"divisibility": 0,
		"reissueable": false,
		"transfer": [{
			"amount": numvoters,
		}],
		"metadata": {
			"assetName": document.getElementById('textname').value,
			"issuer": document.getElementById('textorga').value,
			"description": "Vote Token"
		}
	};
	//create n token
	colu.issueAsset(asset, function (err, body) {
		if (err) {
			evalRespond = {};
			evalRespond.type = 'error';
			evalRespond.response = err;
			console.log("Erreur");
			document.getElementById("loading").innerHTML = 'ERROR';
			return;
		}
		console.log(body);
		var assetId = body.assetId;
		var args = 	{
			"from": [body.issueAddress],
			"to": [],
		};
		choiceadr.Token.push({"Name":asset.metadata.assetName,"ID":body.assetId, "Organizer":asset.metadata.issuer});
		var data = new Blob(["var choiceadr = "+JSON.stringify(choiceadr)], {type: 'text/plain'});
		textFile = window.URL.createObjectURL(data);
		document.getElementById('linkch').href = textFile;
		document.getElementById('downloadlink').style.display = 'block';
		var datav = new Blob(["var voters = "+JSON.stringify(voters)], {type: 'text/plain'});
		textFile = window.URL.createObjectURL(datav);
		document.getElementById('linkvoters').href = textFile;
		document.getElementById('downloadvoters').style.display = 'block';
		document.getElementById('howtodet').style.display = 'none';
		voters.forEach(function(item) {
			if (item.phone != undefined)
				args.to.push({
					"phoneNumber": item.phone,
					"assetId": assetId,
					"amount": 1 });
			if (item.address != undefined)
				args.to.push({
					"address": item.address,
					"assetId": assetId,
					"amount": 1 });
		});
		setTimeout(sendtokens, 4000, args);
	});
};
function Generate(){
	if (document.getElementById('textname').value.length > 0 ){
		var choices = [];
		var nodearray = Array.from(document.getElementById("choicelist").children);
		nodearray.forEach(function(entry) {
			if (entry.className === "fieldset"){
				entry.childNodes.forEach(function(echild){
					if (echild.nodeName === "INPUT" && echild.id != "addc")
						choices.push(echild.value);
				});

			}
		});
		var voters = [];
		var nodearray = Array.from(document.getElementById("voterslist").children);
		nodearray.forEach(function(entry) {
			if (entry.children[0].nodeName === "INPUT"){
				var voteraddress = entry.children[1].value;
				if (settings.network==="mainnet"){
					if (PhoneRegEx.test(voteraddress)){
						voters.push({"name": entry.children[0].value, "phone":voteraddress});
					}
					var adrbtc = /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/;
					if (adrbtc.test(voteraddress)){
						voters.push({"name": entry.children[0].value, "address":voteraddress});
					}
				}
				if (settings.network==="testnet"){
					var adrbtcn = /^[2mn][1-9A-HJ-NP-Za-km-z]{25,34}$/;
					if (adrbtcn.test(voteraddress)){
						voters.push({"name": entry.children[0].value, "address":voteraddress});
					}
				}
			}
		});
		console.log(JSON.stringify(voters));
		console.log(JSON.stringify(choices));
		setTimeout(GoProcess, 200, choices,voters);
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
			loadchoicesfromfile(choiceadr);
		};
	};
	if (files[0].name==="voters.json"){
		reader.onload = function(event) {
			var code = event.target.result;
			eval(code);
			loadvotersfromfile(voters);
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
function loadchoicesfromfile(filecontent){
	document.getElementById("textname").value = filecontent.Token[0].Name;
	document.getElementById("textorga").value = filecontent.Token[0].Organizer;
	var domchoices = document.getElementById("choicelist");
	while (domchoices.hasChildNodes()) {
		domchoices.removeChild(domchoices.lastChild);
	}
	console.log("Loading of the choices");
	filecontent.choices.forEach(function(entry) {
		var pid = document.getElementById("choicelist");
		var par = document.createElement("div");
		par.className = "fieldset";
		var inputc = document.createElement("input");
		inputc.type = "text";
		inputc.value = entry.Name;
		par.appendChild(inputc);
		pid.appendChild(par); 
	});
	var addchbtn = document.createElement("input");
	addchbtn.type = "button";
	addchbtn.name="Addc";
	addchbtn.id="addc";
	document.getElementById("choicelist").lastChild.appendChild(addchbtn);
	addchbtn.onclick = function(){
		AddChoice(this.parentNode);
	};
}
function loadvotersfromfile(filecontent){
	var domvoters = document.getElementById("voterslist");
	while (domvoters.hasChildNodes()) {
		domvoters.removeChild(domvoters.lastChild);
	}
	console.log("Loading of the voters");
	filecontent.forEach(function(entry) {
		var pid = document.getElementById("choicelist");
		var par = document.createElement("div");
		par.className = "fieldset";
		var inputv = document.createElement("input");
		inputv.type = "text";
		inputv.value = entry.name;
		var inputva = document.createElement("input");
		inputva.type = "text";
		if (entry.adresse != undefined)
			inputva.value = entry.address;
		else
			inputva.value = entry.phone;
		var delbtn = document.createElement("input");
		delbtn.type = "button";
		delbtn.className = "rmvc";
		par.appendChild(inputv);
		par.appendChild(inputva);
		par.appendChild(delbtn);
		document.getElementById("voterslist").appendChild(par);
		delbtn.onclick = function(){
			removevot(this.parentNode);
		};
	});
	var addvotbtn = document.createElement("input");
	addvotbtn.type = "button";
	addvotbtn.name="Addv";
	addvotbtn.id="addv";
	document.getElementById("voterslist").lastChild.appendChild(addvotbtn);
	addvotbtn.onclick = function(){
		AddVotant(this.parentNode);
	};
}