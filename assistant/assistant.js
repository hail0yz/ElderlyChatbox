const data = await window.chatbot_app.get_bot_data();

window.addEventListener('beforeunload', saveData);

let laste_mouseleave = Date.now();
document.body.addEventListener("mouseleave", ()=>{
	const now = Date.now();
	console.log(now-laste_mouseleave);
	if(now-laste_mouseleave > 15000 /* 15 secondes */) {
		laste_mouseleave = now;
		saveData();
	}
})
function saveData() {
	window.chatbot_app.set_bot_data(data);
}
const sendChatBtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");
const btnGrp = document.querySelector("#dynamicButtons");
let userMessage;
let keyCount=0;
let context;
let suggestions;
let ourDictionnaire = {
	prevenir:["prévenir","aviser","pallier"],
	sports:["gymnastique douce","gym sénior","marche à pied","tai-chi","aquagym"],
	prudemment:["prudemment","avec prudence","précautionneusement"],
	phrasesFin:[" Si vous souhaitez en savoir plus, dites-le moi!", " N'hésitez pas à me demander plus de renseignements.",
		" Prenez soin de vous."],
	phrasesRappel:["Il semblerait que vous souhaitez en savoir plus.","Bien sur, voici d'autres informations à ce sujets:"],
	surtout:["surtout","particulièrement"],
	souhaitezvous:["Souhaitez-vous", "Voudriez-vous", "Voulez-vous","Desirez-vous"],
	activephysique:["\' activité physique","\' exercice physique","a forme physique", "\'entrainement physique"],
	evitez:["evitez","abstenez vous","eliminer au plus possible"],
	verifiez:["Contrôlez","Vérifiez","Testez","Evaluez","Surveillez"],
	respectez:["Respectez","Appliquez"]
}
let keywords= {//les Objects sont interprétés comme un id commun aux mots "synonymes"
	chute:0, tombe:0,tombé:0,chuté:0,
	brulure:1,"br_lé":1, brûlure:1, brule:101,
	chimique:101,substance:101, nettoyant:101, solvant:101,
	cigarette:102, thermique:102, barbecue:102, "alcool à bruler":102,
	incendie:2, incendier:2, feu:2, flamme:2, 
	intoxication:3, induction: 3, toxique:3,
	inhalation:4, gaz:4, fumée:4, intoxiquer:4, intoxiquer:4,
	etouffement:5, asphyxie: 5,
	noyade:6, noyer:6, baignade:6, baigner:6, piscine:6, plage:6, mer:6, nager:6, natation:6, bateau:6,
	elongation:7, muscle:7, porter:7, dos:7, lumbago:7, mal:7, effort:7, soulever:7,
	coupe:8, coupure:8, blessure:8, blesser:8, cisailles:8, lame:8, sang:8, saigner:8,
	morsure:9, griffure:9, chat:9, chien:9, mord:9, griffe:9,
	arme:10,
	renseignements: 11,"dis moi en plus":11
}
function handleAnswersBack(kw){
	switch(keywords[kw[0]]){
		case 0: 
		fkw="chute";break;
		case 1: 
			for (w in kw){
				console.log(w)
				c=0;b=0;
				if (keywords[kw[w]]== 101){
					c=1;
				}
				if (keywords[kw[w]]== 102){
					b=1;
				}
				if (b&c){
					fkw="brulure";
					break;
				}
			}
			if (context=="infos") c=1
			if (c) fkw="brulureChim";
			if (b) fkw="brulureFeu";
			if(!b&!c) fkw="brulure";
			break;
		case 2: fkw="incendie";break;
		case 3: fkw="intoxication";break;
		case 4: fkw="inhalation";break;
		case 5: fkw="etouffement";break;
		case 6: fkw="noyade";break;
		case 7: fkw="";break;
		case 8: fkw="coupe";break;
		case 9: fkw="morsure";break;
		case 10: fkw="arme";break;
		case 101:
			for (w in kw){
				if (keywords[kw[w]]==1){
					fkw="brulureChim";
					break;
				}
				if (keywords[kw]==3){
					fkw="intoxication";
					break;
				}
			}
			fkw="infos"
			break;
		case 102:
		default: fkw="no"	
	}

	if (keywords[fkw]&&keywords[context]==keywords[fkw]){ // si l'id du keyword de context == l'id du keyword de fkw, alors on ajoute bis
		context = fkw;//mettre le context avant d'ajouter le bis car si on redemande ca decontextualise
		fkw = fkw +"Bis";
	}
	else{context=fkw;} // on store pour la prochaine fois, au cas ou l user demande plus de renseignements
	
	const answer = getAnswerString(fkw);
	return getFilledAnswer(answer)
}
function getAnswerString(fkw) { 
	const ans = data.answers[fkw];
	return ans[Math.floor(Math.random()*ans.length)];
}
function getFilledAnswer(answer) {
	const splited = answer.split("%");
	let count = 1;
	const end = splited.length;
	
	while(count < end) {
		// Remplacer les %str% par le mot aléatoir
		const n = getWord(splited[count]);
		console.log("=> BF",splited[count], "AF", n);
		splited[count] = n;
		count+=2;
	}
	
	return splited.join("");
}
function getWord(str) {
	return ourDictionnaire[str][Math.floor(Math.random()*ourDictionnaire[str].length)];
}

function createSuggestions(){
	occurencesTotal=0
	themes=data.themes;
	for (w in themes){
		if ((w[date].getTime()-Date.now().getTime()/1000)<604800){// une semaine en secondes
			suggestions.append[w.key]
		}
	}
}

function searchKeyword(userMsg){
	let keys= Object.keys(keywords)
	let re= new RegExp('(?<!\S)'+'('+keys.join('|')+')','g')//le mot peut etre conjugué mais pas avoir de prefxe
	return userMsg.toLowerCase().match(re)
}

const createChatLi = (message, className) => {
	const chatLi= document.createElement("li");
	chatLi.classList.add("chat", className);
	chatLi.innerHTML = `<p>${message}</p>`;
	return chatLi;
}
function handleAnswerUI(userMsg){
	const kw= searchKeyword(userMsg);
	if (!kw){
		chatbox.appendChild(createChatLi("No keyword found","incoming"));
		return;
	}
	chatbox.appendChild(createChatLi(handleAnswersBack(kw),"incoming"));
}

function generateRandomButtons(){
	console.log(context);
	btnGrp.innerHTML=""; // Clear previous content
	let re= new RegExp('Bis','g')
	const btn = document.createElement("button");
	btn.classList="btn-grp";
	btn.textContent = "Donnez-moi plus d'informations"; //test
	btn.addEventListener("click", function() {
		chatbox.appendChild(createChatLi(btn.textContent, "outgoing"));
		
		handleAnswerUI(context);
	});
	btnGrp.appendChild(btn);
	if (!(context.test(re))){ //pas de reformulation de bis pour l'instant
		const btn2 = document.createElement("button");
		btn2.classList="btn-grp";
		btn2.textContent = "Je ne comprends pas"; //test
		btn2.addEventListener("click", function() {
			chatbox.appendChild(createChatLi(btn2.textContent, "outgoing"));
			myword=context;
			context="";
			handleAnswerUI(myword);
		});
	}
	btnGrp.appendChild(btn2);
	const btn3 = document.createElement("button");
	btn3.classList="btn-grp";
	btn3.textContent = "Pouvez-vous me suggérer un thème"; //test
	btn3.addEventListener("click", function() {
		chatbox.appendChild(createChatLi(btn3.textContent, "outgoing"));
		createSuggestions();
		if (!suggestions){
			chatbox.appendChild(createChatLi("Nous avons parlé de tous les thèmes disponibles récemment. souhaitez-vous en raborder un?","incoming"));
			return;
		}
		if(suggestions.length==1){
			myString="Nous n'avons pas parlé de"+suggestions[0]+"depuis quelques temps. Voici ce que je peux vous dire à ce sujet";
			handleAnswerUI(suggestions[0])
			data.themes[suggestions[0]][count]+=1
			data.themes[suggestions[0]][date]+=Date.now();
			return ;
		}
		myString= "Nous n'avons pas parlé de "+suggestions.join(', ')+" récemment. Lequel de ces thèmes préferiez-vous aborder?"
		chatbox.appendChild(createChatLi(myString,"incoming"));
	});
	btnGrp.appendChild(btn2);
	chatbox.scrollTop=chatbox.scrollHeight;
}
function updateUI(Usermsg){
	btnGrp.innerHTML="";
	chatbox.appendChild(createChatLi(Usermsg,"outgoing"));
	document.getElementById("msg").value = "";
	handleAnswerUI(Usermsg);
	generateRandomButtons();
	
}
const handleChat = () => {
	chatInput = document.getElementById("msg");
	userMessage = chatInput.value;
	if (!userMessage) return;
	updateUI(userMessage.trim());
}
sendChatBtn.addEventListener("click", handleChat);

document.getElementById("msg").addEventListener("keydown", (e) => {
	if (e.key === "Enter") {
		handleChat();
	}
}
);

