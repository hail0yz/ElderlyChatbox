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
let ourDictionnaire = {};
ourDictionnaireFromData();
let keywords= {}
listKeyFromData();

function handleAnswersBack(kw){
	let fkw;
	switch(keywords[kw[0]]){
		case 0: 
		fkw="chute";break;
		case 1: 
		let c; let b;
			for (var w in kw){
				console.log(w)
				c=0;
				b=0;
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
			if (context=="infos")  c=1
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
		case 12: fkw="Déshydratation";break;
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

    let mainTheme = fkw;

	if (keywords[fkw]&&keywords[context]==keywords[fkw]){ // si l'id du keyword de context == l'id du keyword de fkw, alors on ajoute bis
		context = fkw;//mettre le context avant d'ajouter le bis car si on redemande ca decontextualise
		fkw = fkw +"Bis";
	}
	else{context=fkw;} // on store pour la prochaine fois, au cas ou l user demande plus de renseignements
	updateThemeData(mainTheme);
 
    if (mainTheme === "brulureChim" || mainTheme === "brulureFeu") {
        updateThemeData("brulure");
    }
	const answer = getAnswerString(fkw);
	return getFilledAnswer(answer)
}
// Nouvelle fonction pour mettre à jour les données d'un thème
function updateThemeData(themeName) {
    if (data.themes[themeName]) {
        data.themes[themeName].date = Math.floor(Date.now() / 1000);
        data.themes[themeName].count += 1;
        saveData();
    }
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

function createSuggestions() {
  suggestions = [];
  let themes = data.themes;
  const now = Date.now() / 1000; // Temps actuel en secondes
  for (const themeName in themes) {
    const theme = themes[themeName];
    const themeDate = theme.date || 0;
    if (now - themeDate > 604800) { // 604800 secondes = 1 semaine
      suggestions.push(themeName);
    }
  }
  
  return suggestions;
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

function generateRandomButtons() {
    btnGrp.innerHTML = ""; // Clear previous content
    
    // Bouton 1 - Plus d'informations
    const btn = document.createElement("button");
    btn.classList = "btn-grp";
    btn.textContent = "Donnez-moi plus d'informations";
    btn.addEventListener("click", function() {
        chatbox.appendChild(createChatLi(btn.textContent, "outgoing"));
        handleAnswerUI(context);
    });
    btnGrp.appendChild(btn);
    
    // Bouton 2 - Je ne comprends pas
    // Vérifie si context est défini et ne contient pas "Bis"
    if (context && !context.includes("Bis")) {
        const btn2 = document.createElement("button");
        btn2.classList = "btn-grp";
        btn2.textContent = "Je ne comprends pas";
        btn2.addEventListener("click", function() {
            chatbox.appendChild(createChatLi(btn2.textContent, "outgoing"));
            let myword = context;
            context = "";
            handleAnswerUI(myword);
        });
        btnGrp.appendChild(btn2);
    }
    
    // Bouton 3 - Suggestions de thèmes
    const btn3 = document.createElement("button");
    btn3.classList = "btn-grp";
    btn3.textContent = "Pouvez-vous me suggérer un thème";
    btn3.addEventListener("click", function() {
        chatbox.appendChild(createChatLi(btn3.textContent, "outgoing"));
        suggestions = createSuggestions(); // Assurez-vous que createSuggestions() renvoie un tableau
        
        if (!suggestions || suggestions.length === 0) {
            chatbox.appendChild(createChatLi("Nous avons parlé de tous les thèmes disponibles récemment. Souhaitez-vous en aborder un à nouveau?", "incoming"));
            return;
        }
        
        if (suggestions.length === 1) {
            let myString = "Nous n'avons pas parlé de " + suggestions[0] + " depuis quelques temps. Voici ce que je peux vous dire à ce sujet";
            chatbox.appendChild(createChatLi(myString, "incoming"));
            handleAnswerUI(suggestions[0]);
            data.themes[suggestions[0]].count += 1;
            data.themes[suggestions[0]].date = Math.floor(Date.now() / 1000);
            return;
        }
        
        let myString = "Nous n'avons pas parlé de " + suggestions.join(', ') + " récemment. Lequel de ces thèmes préféreriez-vous aborder?";
        chatbox.appendChild(createChatLi(myString, "incoming"));
    });
    btnGrp.appendChild(btn3);
    
    // Bouton 4 - Liste des thèmes disponibles
    const btn4 = document.createElement("button");
    btn4.classList = "btn-grp";
    btn4.textContent = "De quels thèmes pouvez-vous parler?";
    btn4.addEventListener("click", function() {
        chatbox.appendChild(createChatLi(btn4.textContent, "outgoing"));
        
        // Crée un tableau avec tous les noms de thèmes
        let keys = [];
        for (const themeName in data.themes) {
            keys.push(themeName);
        }
        
        // Affiche la liste des thèmes
        let myString = "Nous pouvons parler de " + keys.join(', ') + ".";
        chatbox.appendChild(createChatLi(myString, "incoming"));
    });
    btnGrp.appendChild(btn4);
    
    chatbox.scrollTop = chatbox.scrollHeight;
}
function updateUI(Usermsg){
	btnGrp.innerHTML="";
	chatbox.appendChild(createChatLi(Usermsg,"outgoing"));
	document.getElementById("msg").value = "";
	handleAnswerUI(Usermsg);
	generateRandomButtons();
	
}
const handleChat = () => {
	let chatInput = document.getElementById("msg");
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


window.resetDataTheme = function () {
	for (const themeName in data.themes) {
		data.themes[themeName].count = 0;
		data.themes[themeName].date = 0;
	}
	saveData();
}

function listKeyFromData(){
	for (let themesname in data.themes){
		for (let key in data.keywords[themesname]["clé"]) {
			//console.log(data.keywords[themesname]["clé"][key]);
			//console.log(data.keywords[themesname]["id"]);
			keywords[data.keywords[themesname]["clé"][key]]=data.keywords[themesname]["id"];
		}
	}
}

function ourDictionnaireFromData(){
		for (let key in data.ourDictionnaire) {
			//console.log("mot ",key,data.ourDictionnaire[key]);
			ourDictionnaire[key]=data.ourDictionnaire[key];
		}
}


// Fonction pour récupérer les thèmes les moins abordés
function getLeastDiscussedThemes() {
    const themes = Object.entries(data.themes);
    themes.sort((a, b) => a[1].count - b[1].count); 
    return themes.slice(0, 3).map(theme => theme[0]); 
}
