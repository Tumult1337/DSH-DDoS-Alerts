const TOKEN = 'DSH-.....................';
const API_REQ_IPS = [
	['IP', "DiscordUID", "https://discord.com/api/webhooks/....................."],
	['IP2', "DiscordUID2", "https://discord.com/api/webhooks/.....................2"],
];
var delay = 45; //in secs
/////////////////////////////////////////////////////////////////
const XMLHttpRequest = require("xhr2")

delay = (delay * 1000)-1000;

const APIurl = 'https://api.dsh.gg/api/v2/protection/incidents/';
var lastDDoS = [];
var thisDDoS = [];
var sentEndOfAttack = [];
var ppsPeakLast = [];
var bpsPeakLast = [];
for (i = 0; i < API_REQ_IPS.length; i++) {
	lastDDoS[i] = '';
	thisDDoS[i] = '';
	sentEndOfAttack[i] = '';
	bpsPeakLast[i] = '';
	ppsPeakLast[i] = '';
}

function GetTime() {
	const today = new Date();
	return today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
}
function sendMessage(sendthis, ipIndex, state) {
	const xhr = new XMLHttpRequest();
	xhr.open("POST", API_REQ_IPS[ipIndex][2], true);
	xhr.setRequestHeader('Content-type', 'application/json');
	if (!state) { var cont = `<@${API_REQ_IPS[ipIndex][1]}>` }
	const params = {
		content: cont || "",
		username: "Skid Alert",
		avatar_url: 'https://check-host.net/images/mainlogo.png',
		embeds: [sendthis]
	}
	xhr.onload = function() {
		if (!state) {
			console.log("Send Alert: " + API_REQ_IPS[ipIndex][0]);
			return;
		}
		console.log("Notified end: "  + API_REQ_IPS[ipIndex][0])
	}
	xhr.send(JSON.stringify(params));
}

function getDiscordWebhookFormat(t, ipIndex, state) {
	if (!t) {return}
	if (state == "end") {
		var title = "Attack summary";
		var timestamp = t['end'];
		var col = 0x00FF69;
		var type = " (peak)";
	} else if (state == "update") {
		var title = "Attack update";
		var timestamp = new Date();
		var col = 0xFFFF00;
		var type = " (New peak)";
	} else {
		var title = "Illegal Traffic detected!";
		var timestamp = t['start'];
		thisDDoS[ipIndex] = t['start'];
		var col = 0xFF1000;
		var type = " (current)";
	}
	const out = {
		'author': {
			name: 'DDoS',
			icon_url: 'https://deinserverhost.de/assets/img/theme/penguin/server_penguin_500.png',
			url: 'https://deinserverhost.de/store/clientarea.php'
		},
		thumbnail: {
			url: 'https://cdn.discordapp.com/emojis/799190580424998962.gif?size=96&quality=lossless',
		},
		'title': title,
		'url': "https://deinserverhost.de/store/clientarea.php",
		'color': col,
		fields: [
	   		{
				name: 'Server',
				value: t['host'] || "no data",
			},
			{
				name: 'reason',
				value: t['reason'] || "no data",
			},
			{
				name: 'Gigabit/s' + type,
				value: ((parseInt(t['peak_bps']['value'])/1024/1024/1024)*8).toFixed(3) || "no data",
			},
			{
				name: 'Packets/s' + type,
				value: t['peak_pps']['value'].toLocaleString('de') || "no data",
			},
		],
		timestamp: timestamp
	}
	return out
}

function httpGet(url, ipIndex) {
	try {
		console.log("Request for ip: " + API_REQ_IPS[ipIndex][0] + " | " + GetTime() + " | waiting for response...");
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.open("GET", url, true);
		xmlHttp.setRequestHeader('X-TOKEN', TOKEN);
		xmlHttp.send();
		xmlHttp.onload = () => {
			if (xmlHttp.status != 200) {
				console.log("HTTP error: " + xmlHttp.status)
				return
			}
			var response = JSON.parse(xmlHttp.response);	
			if (!response) { 
				console.log("No data returned");
				return;
			}
			if (!response['items']) {
				console.log("ERR, no items: | " + API_REQ_IPS[ipIndex][0]);
				console.log(response);
				return;
			}
			if (response['items'].length == 0) {
				console.log("no attack detected | " + API_REQ_IPS[ipIndex][0]);
				console.log(response)
				return;
			}
			const log = response['items'].length + " results | " + API_REQ_IPS[ipIndex][0] + " | ";
			response = response['items'][0]; //latest attack
			//////////////////////////////////////////////////////////////
			if (response['end'] != null) { 
				if (sentEndOfAttack[ipIndex]) {
					console.log(log + "Latest Attack already ended, not sending notification");
					return; // if attack already ended dont send again
				}
				console.log(log + " Attack ended | "  + API_REQ_IPS[ipIndex][0])
				sendMessage(getDiscordWebhookFormat(response, ipIndex, "end"), ipIndex, "end");
				sentEndOfAttack[ipIndex] = true;
				return;
			} 
			const dcValue = getDiscordWebhookFormat(response, ipIndex);
			if (!dcValue) { return; }			
			if (lastDDoS[ipIndex] == thisDDoS[ipIndex]) {
				if (ppsPeakLast[ipIndex] == response['peak_pps']['value'] && bpsPeakLast[ipIndex] == response['peak_bps']['value']) {
					console.log(log + thisDDoS[ipIndex] + " | " + API_REQ_IPS[ipIndex][0] + " | Attack still in progress...");
					return;
				}
				ppsPeakLast[ipIndex] = response['peak_pps']['value'];
				bpsPeakLast[ipIndex] = response['peak_bps']['value'];
				console.log(log + thisDDoS[ipIndex] + " | " + API_REQ_IPS[ipIndex][0] + " | New Peak, still ongoing");
				sendMessage(getDiscordWebhookFormat(response, ipIndex, "update"), ipIndex, "update");
				return;
			}
			console.log(log + thisDDoS[ipIndex] + " | " + API_REQ_IPS[ipIndex][0]);
			console.log(response);
			lastDDoS[ipIndex] = thisDDoS[ipIndex];
			ppsPeakLast[ipIndex] = response['peak_pps']['value'];
			bpsPeakLast[ipIndex] = response['peak_bps']['value'];
			sendMessage(dcValue, ipIndex);	   
			sentEndOfAttack[ipIndex] = false;	 
		}
	} catch (e) {
		console.log(e)
	}
}

for (i = 0; i < API_REQ_IPS.length; i++) {
	httpGet(APIurl + API_REQ_IPS[i][0], i);
}

function CallItself() {
	try {	
		setTimeout(function() {
			CallItself();
			for (i = 0; i < API_REQ_IPS.length; i++) {
				setTimeout(httpGet, i*1000, APIurl + API_REQ_IPS[i][0], i);
			}
		}, delay);
	} catch (e) {
		console.log(e);
	}
}
CallItself();

