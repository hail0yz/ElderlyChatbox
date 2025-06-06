// ========== DATA et SAVING ==========
const data = await window.chatbot_app.get_bot_data();
const form_data = await window.chatbot_app.get_form_data();

window.addEventListener('beforeunload', saveData);

let laste_mouseleave = Date.now();
document.body.addEventListener("mouseleave", ()=>{
	const now = Date.now();
	if(now-laste_mouseleave > 15000 /* 15 secondes */) {
		laste_mouseleave = now;
		saveData();
	}
})
function saveData() {
	window.chatbot_app.set_bot_data(data);
}

// ========== VARIABLES ==========
const global_theme = Object.keys(data.themes);

const systemContext = 
`Tu es un assistant virtuel bienveillant, conçu pour aider les personnes âgées à prévenir les accidents domestiques.
Ta mission est d’informer, de conseiller et de proposer des solutions simples pour réduire les risques à la maison (chutes, brûlures, intoxications, etc.).
Tu peux aborder tous les thèmes figurant dans la liste suivante : ${global_theme.join(', ')}. Tu peux aussi suggérer des sujets pertinents, proposer des conseils pratiques, des aménagements adaptés ou des activités physiques douces, tant qu’ils ont un lien avec la sécurité et le bien-être à domicile.
Inutile de condenser trop d'informations en un seul message : l'utilisateur peut te demander plus de détails s’il le souhaite.
Par exemple, tu peux d’abord expliquer comment éviter une situation dangereuse (ex. : se tenir dans l’escalier, demander de l’aide dans la rue), puis proposer des aménagements (ex. : rampes, sièges monte-escaliers) si l'utilisateur en fait la demande. Tu peux aussi suggérer des activités adaptées comme la marche, le yoga au sol, etc.
Tu dois toujours répondre de façon claire, concise (maximum 3 phrases), avec un ton positif et rassurant.
Ne commence jamais tes phrases par "Je comprends", "Compris", ou toute autre formule automatique. N’utilise pas de texte en gras ni de mise en forme spéciale.
Si une question sort de ton domaine (ex. : mort, suicide, violence, maladie grave ou urgence médicale), indique poliment que tu ne peux pas en parler, et recentre la conversation sur les risques domestiques.
Si tu ne comprends pas la question, demande gentiment une reformulation. Reste toujours concentré sur ta mission : aider à prévenir les accidents domestiques.
Si l’utilisateur demande “de quoi peut-on parler ?” ou une question équivalente, propose quelques exemples de thèmes utiles que tu peux aborder, en rapport avec la sécurité et le bien-être à domicile. Invite l’utilisateur à choisir un sujet s’il le souhaite.
`;

const systemContext2 = 
`
Tu es une personne chargée de la prévention primaire des risques domestiques.
Tu ne peux pas parler directement de la mort ou de sucide. Seuls les sujets dans la liste suivante sont acceptés : ${global_theme.join(", ")}.
Si l'utilisateur te demande de quel theme tu peux parler, donne 4 exemples de la liste ci-dessus. Si il te demande de sugérer un thème, proposé en un avec une phrase du type : "Que pense tu du sujet <sujet> ? Je peux en parler si tu le souhaite".
Sur les sujets, dans un premier temps, parle des situations à éviter. Dans un second temps si la personne parle encore du sujet, donne des solutions à apporter pour limiter les risques. Et enfin propose des activités si possible. Sinon continue de parler du sujet sans donner des chiffres sur les morts, la quantité d'accident ou autre. Tu dois rester positif et ne pas pointer les difficultés des personnes âgées.
Si tu ne comprends pas la question, demande à reformuler. Si la demande n'est pas dans la liste de tes compétences, alors dis gentillement que tu n'es pas habilité pour traiter de ce sujet.
Ne commence jamais tes phrases par "Je comprends", "Compris", "Bonjour !" ou toute autre formule automatique. N’utilise pas de texte en gras ni de mise en forme spéciale.
N'oublie pas que tu dois parler comme un humain dans une discussion normale.

Tu dois donc répondre en 30 mots à ce que l'utilisateur demande si dessous :

`;

const systemContext3 = `
Tu es une personne chargée de la prévention primaire des risques domestiques.
Tu ne peux pas parler directement de la mort ou de suicide. Seuls les sujets dans la liste suivante sont acceptés : ${global_theme.join(", ")}.

Si l'utilisateur demande : "quels thèmes peux-tu aborder ?", "de quoi peux-tu parler ?", ou des formulations similaires, donne 4 exemples précis tirés de la liste ci-dessus.

Si il te demande de suggérer un thème, propose-en un avec une phrase comme : "Que penses-tu du sujet <sujet> ? Je peux en parler si tu le souhaites."

Quand un sujet est abordé :
1. Commence par parler des situations à éviter.
2. Si l'utilisateur continue, propose des solutions pour limiter les risques.
3. Enfin, propose des activités en lien avec le sujet si possible.

Ne parle jamais de chiffres de morts, d'accidents ou de statistiques.
Reste positif, ne souligne pas les difficultés des personnes âgées.

Si tu ne comprends pas la question, demande à reformuler. Si le sujet n’est pas dans la liste, dis gentiment que ce n’est pas de ton ressort.

N’utilise pas d’expressions comme "Je comprends" ou "Compris".
Ne mets aucun mot en gras ou en italique.

Exprime-toi de manière naturelle, comme un humain en discussion.

Tu dois répondre en 30 mots à ce que l'utilisateur demande ci-dessous :
`;

const systemContext4 = 
`Tu es un chatbot spécialisé en prévention des risques domestiques. Tu réponds de façon directe, claire et utile, sans introduction ni conclusion superflue.
Ta mission est de prévenir les accidents du quotidien chez les personnes à domicile. Tu donnes des conseils pratiques, des exemples de situations à risque, et tu proposes des solutions simples pour éviter ou limiter les dangers.

Les principaux risques à traiter sont :

- Chutes (escaliers, tapis, sols mouillés...)
- Brûlures (cuisine, eau chaude...)
- Incendies (cuisinière, bougies, prises électriques...)
- Déshydratation et dénutrition
- Morsures d’animaux
- Infections liées à des blessures mal soignées

Tu peux dire par exemple :
- "Lorsque vous descendez des escaliers, faites attention à où vous mettez les pieds."
- "Pensez à boire régulièrement de l’eau, même par petites quantités."
- "Gardez toujours un œil sur ce qui est sur le feu."
- "Surveillez vos blessures : si elles changent de couleur, consultez rapidement un médecin."
- "Installez des barres d’appui dans les escaliers ou la douche pour plus de sécurité."

Si l’utilisateur demande plus de détails, tu peux donner d'autres exemples ou proposer des actions simples :
- "Utiliser un minuteur pendant la cuisson évite d’oublier une casserole sur le feu."
- "Préférez les chemins plats, surtout s’il pleut, ou redoublez de vigilance."

Tu peux aussi suggérer des activités douces et bénéfiques comme :
- "Marcher régulièrement pour entretenir son équilibre."
- "Faire du yoga doux ou des exercices d’étirement."
- "Jouer à des jeux de mémoire pour stimuler le cerveau."

Ne parle jamais de suicide.
Ne fais aucune remarque directe sur l’âge, préfère des tournures douces comme :
- "Avec le temps, certaines habitudes deviennent utiles pour rester en sécurité."

Ta réponse doit être concise, bienveillante et toujours centrée sur la prévention et les solutions concrètes.`;
const systemContext5=`
Si l'utilisateur te demande plus de détails ou plus d'informations, donne lui en une ou deux phrases d'autres conseils brefs.
Reste positif et ménage l'utilisateur. N'évoque pas de suicide ou de sujets trop déprimants. Ne fait pas de remarques sur l'age,
et ne blame pas l'utilisateur. Reste positif dans tes tournures de phrases; ne dis pas à l'utilisateur qu'il est limité par son age,
vois le côté positif et réalisable. Les sujets à traiter contiennent, mais ne sont pas limités à:
- Chutes (escaliers, tapis, sols mouillés...)
- Brûlures (cuisine, eau chaude...)
- Incendies (cuisinière, bougies, prises électriques...)
- Déshydratation et dénutrition
- Morsures d’animaux
- Infections liées à des blessures mal soignées
-Isolation sociale
Si l'utilisateur demande une suggestion de thèmes, limitez vous à ceux-ci.
N'oublie pas de rester succinct, limite toi à une cinquantaine de mots. Soit amical et chaleureux mais ne dit pas bonjour à l'utilisateur.
Ne mets pas de passages en gras ou italique. Ne sois surtout pas dédaigneux ou condescendant. N'infantilise pas la personne. Si la personne parle d'un sujet en particulier, reste sur celui ci autant que possible
Si et SEULEMENT SI cela est propice à la situation, tu peux utiliser ce que tu sais de l'utilisateur dans la réponse.
`
let formulaire_rep= form_data.answers;
let myString = "Tu es un assistant virtuel qui doit épauler les personnes agées dans la prévention primaires des risques domestiques uniquement. Tu vas devoir t'occuper d'une personne agée"
if (formulaire_rep.username!=""){
		myString =myString+ "s'appelant "+ formulaire_rep.username;
	}
	if (formulaire_rep.seulacc=="seul" || formulaire_rep.seulacc=="accompagné"){
		myString= myString+" vivant "+ formulaire_rep.seulacc;
	}
	//Ajouter les risques identifiés dans le contexte
	let risquesIdentifies = [];
	
	if (formulaire_rep.chutesFrequentes == "oui") {
		risquesIdentifies.push("chutes fréquentes");
	}
	
	if (formulaire_rep.risqueChute == "oui") {
		risquesIdentifies.push("risques de chute dans le logement");
	}
	
	if (formulaire_rep.risqueBrulure == "oui") {
		risquesIdentifies.push("utilisation d'équipements chauds");
	}
	
	if (formulaire_rep.risqueIncendie == "non") {
		risquesIdentifies.push("absence de détecteurs de fumée");
	}
	
	if (formulaire_rep.risqueIntoxOrale == "non") {
		risquesIdentifies.push("mauvaise séparation des produits alimentaires et d'entretien");
	}
	
	if (formulaire_rep.risqueIntoxInhalation == "non") {
		risquesIdentifies.push("aération insuffisante du logement");
	}
	
	if (formulaire_rep.risqueEtouffement == "oui") {
		risquesIdentifies.push("difficultés à mâcher ou avaler");
	}
	
	if (formulaire_rep.risqueDeshydratation == "non") {
		risquesIdentifies.push("hydratation insuffisante");
	}
	
	if (formulaire_rep.risqueDenutrition == "non") {
		risquesIdentifies.push("alimentation insuffisante");
	}
	
	if (formulaire_rep.risqueElectrocution == "non") {
		risquesIdentifies.push("installations électriques défaillantes");
	}
	
	if (formulaire_rep.risqueNoyade == "oui") {
		risquesIdentifies.push("présence de points d'eau");
	}
	
	if (formulaire_rep.risqueElongation == "oui") {
		risquesIdentifies.push("manipulation d'objets lourds");
	}
	
	if (formulaire_rep.risqueCoupure == "non") {
		risquesIdentifies.push("objets tranchants mal rangés");
	}
	
	if (formulaire_rep.risqueAnimal == "oui") {
		risquesIdentifies.push("animal domestique imprévisible");
	}
	
	if (formulaire_rep.risqueArmeFeu == "oui") {
		risquesIdentifies.push("présence d'armes à feu");
	}
	
	if (formulaire_rep.interrupteursAccessibles == "non") {
		risquesIdentifies.push("interrupteurs mal accessibles");
	}
	
	// Compléter le message avec les risques identifiés
	if (risquesIdentifies.length > 0) {
		myString += " présentant les risques suivants : " + risquesIdentifies.join(", ");
	}
let used_context = myString+systemContext5;

const sendChatBtn = document.querySelector(".chat-input span");
const chatInput=document.querySelector(".chat-input textarea");
const chatbox = document.querySelector(".chatbox");
const btnGrp = document.querySelector("#dynamicButtons");
let userMessage;
let keywords;
let ourDictionnaire;
const msg_input = document.getElementById("msg");

// Désactiver les interactions jusqu'à l'initialisation
sendChatBtn.style.pointerEvents = "none";
msg_input.disabled = true;
function onlyUnique(value, index, array) {
	return array.indexOf(value) === index;
}
// Chargement asynchrone des données
async function initializeData() {
	try {
		ourDictionnaire = data.ourDictionnaire;
		keywords = listKeyFromData();
		generateRandomButtons();
		
		// Réactiver les interactions
		sendChatBtn.style.pointerEvents = "auto";
		msg_input.disabled = false;
	} catch (error) {
		console.error("Erreur lors de l'initialisation des données:", error);
		chatbox.appendChild(createChatLi("Désolé, j'ai rencontré un problème lors du chargement. Veuillez rafraîchir la page.", "incoming"));
	}
}

// Initialisation
initializeData();

// ========== FUNCTIONS ==========
const generateBotResponse = async (userMessage) => {
	
	const msg_lg = userMessage.split(' ').filter(e=>e.length>2).length;
	
	const donner_list_sujet = [
		/quel(?:\s+|_)*sujet/, 
		/quel(?:\s+|_)*sont/, 
		/quel(?:\s+|_)*est/, 
		/liste(?:s)?/, 
		/sujet(?:s)?/, 
		/peux[-\s]*tu(?:\s+)?/,
		/tu peux/,
		/moi/,
		/parler/
	];
	
	const donner_un_sujet = [
		/propose/,
		/sugg.re/,
		/donne/,
		/id.e/,
		/parle.*sujet/, 
		/quel.*sujet/,
		/peux[-\s]*tu(?:\s+)?/,
		/tu peux/,
		/proposes/,
		/sujet/,
		/un sujet/,
		/th.me/,
		/un th.me/,
		/peut on/,
		/parler/
	];
	
	const value_list = donner_list_sujet.reduce((acc, regex) => acc + (regex.test(userMessage) ? 1 : 0), 0);
	const value_un = donner_un_sujet.reduce((acc, regex) => acc + (regex.test(userMessage) ? 1 : 0), 0);
	
	console.log(`Nombre de vrais mot : ${msg_lg}\nValue liste des sujets : ${value_list}\nValue un seul sujet : ${value_un}`);
	
	const ratio_list = value_list/msg_lg;
	const ratio_un = value_un/msg_lg;
	
	if(ratio_list >= .5 || ratio_un >= .5) console.log(`Le bot repondra avec : ${Math.max(ratio_list, ratio_un)===ratio_list?"Liste de sujet":"Sujet Unique"}\n => C'est un TODO :)`)
		
	let responseText = "";
	
	// Si aucun mot-clé ne correspond, utiliser Gemini API
	try {
		// Préparer le contexte pour Gemini
		
		responseText = await window.chatbot_app.send_message(`${used_context}L'utilisateur demande : \n\n${userMessage}`);
		console.log("API Response:\n", responseText);
		
	} catch (error) {
		console.error("Erreur avec l'API Gemini:", error);
		responseText = "Désolé, j'ai rencontré un problème technique. Pourriez-vous essayer à nouveau ou choisir un autre sujet ?";
	}
	
	//responseText.replaceAll("\n","<br>")
	
	// Trouver et supprimer le message "Je réfléchis..."
	const thinkingMessages = document.querySelectorAll(".chat.incoming p");
	for (const msg of thinkingMessages) {
		if (msg.textContent === "Je réfléchis...") {
			msg.parentElement.remove();
			break;
		}
	}
	let answersKW=searchKeyword(userMessage)
	if (answersKW) answersKW=answersKW.filter(onlyUnique);// devrait  renvoyer une liste avec des KW uniques
	console.log("Mots-clés trouvés :", answersKW);
	let themeschekced = [];
	for (const key in data.keywords){
		for (const cle in data.keywords[key]["clé"]){
			if (answersKW && answersKW.includes(data.keywords[key]["clé"][cle])){
				themeschekced.push(key);
			}
		}
	}

	themeschekced = themeschekced.filter(onlyUnique);
	console.log("Thèmes vérifiés :", themeschekced);

	for (const w in themeschekced){
		console.log("Mise à jour du thème :", themeschekced[w]);	
		updateThemeData(themeschekced[w]);
	}
	saveData()
	// Afficher la réponse
	chatbox.appendChild(createChatLi(responseText, "incoming"));
	chatbox.scrollTop = chatbox.scrollHeight;
	generateRandomButtons();
}

const createChatLi = (content, className) => {
	const chatLi= document.createElement("li");
	chatLi.classList.add("chat", className);
	chatLi.innerHTML = `<p>${content}</p>`;
	return chatLi;
}

function searchKeyword(userMsg){
	if (!keywords || !keywords.keys) return null;
	let re= new RegExp('(?<!\S)'+'('+keywords.keys.join('|')+')','g')//le mot peut etre conjugué mais pas avoir de prefxe
	return userMsg.toLowerCase().match(re)
}

// Fonction pour gérer les réponses basées sur des mots-clés
function handleAnswerUI(keyword) {
	let responseText = getFilledAnswer(getAnswerString(keyword));
	chatbox.appendChild(createChatLi(responseText, "incoming"));
	chatbox.scrollTop = chatbox.scrollHeight;
}

// Nouvelle fonction pour mettre à jour les données d'un thème
function updateThemeData(themeName) {
	if (data.themes[themeName]) {
		data.themes[themeName].date = Math.floor(Date.now() / 1000);
		data.themes[themeName].count += 1;
		console.log(`Mise à jour du thème ${themeName}:`, data.themes[themeName]);
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
		generateBotResponse("Donnez-moi plus d'informations.")
		chatbox.scrollTop = chatbox.scrollHeight;
	});
	btnGrp.appendChild(btn);
	const btn2 = document.createElement("button");
	btn2.classList = "btn-grp";
	btn2.textContent = "Je ne comprends pas";
	btn2.addEventListener("click", function() {
		chatbox.appendChild(createChatLi(btn2.textContent, "outgoing"));
		generateBotResponse("Je ne comprends pas")
		chatbox.scrollTop = chatbox.scrollHeight;
	});
	btnGrp.appendChild(btn2);
	
	
	// Bouton 3 - Suggestions de thèmes
	const btn3 = document.createElement("button");
	btn3.classList = "btn-grp";
	btn3.textContent = "Pouvez-vous me suggérer un thème";
	btn3.addEventListener("click", function() {
		chatbox.appendChild(createChatLi(btn3.textContent, "outgoing"));
		const suggestions = createSuggestions(); // Assurez-vous que createSuggestions() renvoie un tableau
		
		if (!suggestions || suggestions.length === 0) {
			generateBotResponse("Pouvez-vous me suggérer un thème?")
			chatbox.scrollTop = chatbox.scrollHeight;
			return;
		}
		
		if (suggestions.length === 1) {
			let myString = "Nous n'avons pas parlé de " + suggestions[0] + " depuis quelques temps. Voici ce que je peux vous dire à ce sujet";
			chatbox.appendChild(createChatLi(myString, "incoming"));
			generateBotResponse("reformule ça"+myString);
			chatbox.scrollTop = chatbox.scrollHeight;
			return;
		}
		
		let myString = "Nous n'avons pas parlé de " + suggestions.join(', ') + " récemment. Lequel de ces thèmes préféreriez-vous aborder?";
		generateBotResponse("reformule ça"+myString)
		chatbox.scrollTop = chatbox.scrollHeight;
	});
	btnGrp.appendChild(btn3);
	
	// Bouton 4 - Liste des thèmes disponibles
	const btn4 = document.createElement("button");
	btn4.classList = "btn-grp";
	btn4.textContent = "De quels thèmes pouvez-vous parler?";
	btn4.addEventListener("click", function() {
		chatbox.appendChild(createChatLi(btn4.textContent, "outgoing"));
		
		// Affiche la liste des thèmes
		let myString = "Nous pouvons parler de " + global_theme.join(', ') + ".";
		generateBotResponse("Reformule ça"+myString);
		chatbox.scrollTop = chatbox.scrollHeight;
	});
	btnGrp.appendChild(btn4);
}

function createSuggestions() {
	const suggestions = [];
	let themes = data.themes;
	const now = Math.floor(Date.now() / 1000); // Temps actuel en secondes
	for (const themeName in themes) {
		const theme = themes[themeName];
		const themeDate = theme.date || 0;
		if (now - themeDate > 604800) { // 604800 secondes = 1 semaine
			suggestions.push(themeName);
		}
	}
	console.log("Suggestions de thèmes :", suggestions);
	
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
	if (!data || !data.themes || !data.keywords) return { keys: [] };
	
	const keywords = { keys: [] };
	for (let themesname in data.themes){
		if (data.keywords[themesname] && data.keywords[themesname]["clé"]) {
			for (let key of data.keywords[themesname]["clé"]) {
				keywords[key] = data.keywords[themesname]["id"];
				keywords.keys.push(key);
			}
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

const handleChat = () => {
	userMessage = chatInput.value.trim();
	if(!userMessage) return;
	
	chatbox.appendChild(createChatLi(userMessage, "outgoing"));
	chatInput.value = ""; // Vider le champ de saisie
	
	// Afficher "Je réfléchis..." pendant le chargement
	setTimeout(() => {
		chatbox.appendChild(createChatLi("Je réfléchis...", "incoming"));
		generateBotResponse(userMessage);
	}, 600);
}

// ========== EVENTS HANDLE ==========
msg_input.addEventListener("keydown", (e) => {
	if (e.key === "Enter" && !e.shiftKey) {
		e.preventDefault(); // Empêcher le saut de ligne
		handleChat();
	}
});
sendChatBtn.addEventListener("click", handleChat);