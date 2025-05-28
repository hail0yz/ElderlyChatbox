const form_data = await window.chatbot_app.get_form_data();

const generateBotResponse = async (userMessage) => {
	
	
	let responseText = "";
	let formulaire_rep= form_data.answers;
	let myString="Quel conseil pourrais-tu donner à une personne agée";
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
		myString += ". Donne des conseils pratiques et personnalisés pour améliorer sa sécurité au quotidien.";
try {
		// Envoyer le contexte complet à l'API
		responseText = await window.chatbot_app.send_message(myString);
		console.log("Contexte envoyé:", myString);
		console.log("API Response:", responseText);
		
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
	let answersKW=searchKeyword(responseText)
	if (answersKW) answersKW=answersKW.filter(onlyUnique);// devrait  renvoyer une liste avec des KW uniques
	for (const w in answersKW){
		updateThemeData(w);
	}
	saveData()
	// Afficher la réponse
	chatbox.appendChild(createChatLi(responseText, "incoming"));
	chatbox.scrollTop = chatbox.scrollHeight;
	generateRandomButtons();
}