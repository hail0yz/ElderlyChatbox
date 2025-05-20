// ========== DATA et SAVING ==========

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

// ========== VARIABLES ==========
const GROQ_API_KEY="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"
const API_URL= "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}"
const sendChatBtn = document.querySelector(".chat-input span");
const chatInput=document.querySelector(".chat-input textarea");
const chatbox = document.querySelector(".chatbox");
const btnGrp = document.querySelector("#dynamicButtons");
let context;
let ourDictionnaire = data.ourDictionnaire;
let keywords = listKeyFromData();
const userData={
	message:null
}
const msg_input = document.getElementById("msg");
let userMessage;



// ========== FUNCTIONS ==========
const llm = new ChatGroq({
  model: "llama-3.3-70b-versatile",
  temperature: 0
});const data = await window.chatbot_app.get_bot_data();

const generateBotResponse= async ()=> {
	const requestOptions={
		method: "POST",
		headers:{"Content-Type":"application/json"},
		body: JSON.stringify({
			contents:[{
			parts:[{text:userData.message}]
			}]
		})
	}
	try{
		const response = await ollama.chat({
  model: 'llama3.1',
  messages: [{ role: 'user', content: 'Why is the sky blue?' }],
})
console.log(response.message.content)
	} catch (error){
		console.log(error);
	}

}

const createChatLi = (content, className) => {
	const chatLi= document.createElement("li");
	chatLi.classList.add("chat", className);
	chatLi.innerHTML = `<p>${content}</p>`;
	return chatLi;
}


function searchKeyword(userMsg){
	let re= new RegExp('(?<!\S)'+'('+keywords.keys.join('|')+')','g')//le mot peut etre conjugué mais pas avoir de prefxe
	return userMsg.toLowerCase().match(re)
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
		splited[count] = getDictionaryWord(splited[count]);
		count+=2;
	}
	
	return splited.join("");
}

function getDictionaryWord(str) {
	return ourDictionnaire[str][Math.floor(Math.random()*ourDictionnaire[str].length)];
}

function generateRandomButtons() {
	btnGrp.innerHTML = ""; // Clear previous content
	
	// Bouton 1 - Plus d'informations
	const btn = document.createElement("button");
	btn.classList = "btn-grp";
	btn.textContent = "Donnez-moi plus d'informations";
	btn.addEventListener("click", function() {
		chatbox.appendChild(createChatLi(btn.textContent, "outgoing"));
		if(context){
			handleAnswerUI(context);
		}
		else{
			chatbox.appendChild(createChatLi("Je n'ai pas de contexte pour vous donner plus d'informations.", "incoming"));
		}
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
		const suggestions = createSuggestions(); // Assurez-vous que createSuggestions() renvoie un tableau
		
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

function createSuggestions() {
	const suggestions = [];
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

window.resetDataTheme = function () {
	for (const themeName in data.themes) {
		data.themes[themeName].count = 0;
		data.themes[themeName].date = 0;
	}
	saveData();
}

function listKeyFromData(){
	const keywords = { keys: [] };
	for (let themesname in data.themes){
		for (let key of data.keywords[themesname]["clé"]) {
			keywords[key] = data.keywords[themesname]["id"];
			keywords.keys.push(key);
		}
	}
	return keywords;
}

// Fonction pour récupérer les thèmes les moins abordés
function getLeastDiscussedThemes() {
	const themes = Object.entries(data.themes);
	themes.sort((a, b) => a[1].count - b[1].count); 
	return themes.slice(0, 3).map(theme => theme[0]); 
}
const handleChat=()=>{
	userMessage= chatInput.value.trim();
	if(!userMessage) return;
	chatbox.appendChild(createChatLi(userMessage,"outgoing"));
	setTimeout(()=>{
		chatbox.appendChild(createChatLi("Je réflechis...s","incoming"));
		generateBotResponse();
	},600)
}

// ========== EVENTS HANDLE ==========
msg_input.addEventListener("keydown", (e) => {
	if (e.key === "Enter") handleChat();
});
sendChatBtn.addEventListener("click", handleChat);
generateRandomButtons(); // Générer les 1er bouton