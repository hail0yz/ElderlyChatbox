const sendChatBtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");
const btnGrp = document.querySelector("#dynamicButtons");
let userMessage;
let keyCount=0;
let context;
let ourDictionnaire = {
	prevenir:["prévenir","aviser","pallier"],
	sports:["gymnastique douce","gym sénior","marche à pied","tai-chi","aquagym"],
	prudemment:["prudemment","avec prudence","précautionneusement"],
	phrasesFin:[" Si vous souhaitez en savoir plus, dites-le moi!", " N'hésitez pas à me demander plus de renseignements.",
		" Prenez soin de vous."],
	phrasesRappel:["Il semblerait que vous souhaitez en savoir plus.","Bien sur, voici d'autres informations à ce sujets:"],
	surtout:["surtout","particulièrement"]
}
const randomStrings = [
	"Je ne comprends pas",
	"Pouvez-vous m'aider",
	"Continuez",
	"Plus d'informations",
	"Expliquez-moi",
	"Donnez un exemple",
	"Recommendations"
]
let keywords= {//les Objects sont interprétés comme un id commun aux mots "synonymes"
	chute:0, tombe:0,tombé:0,chuté:0,
	brulure:1,brûlé:1, brûlée:1, brule:101,
	chimique:101,substance:101, nettoyant:101, solvant:101,
	cigarette:102, thermique:102, barbecue:102, "alcool à bruler":102,
	incendie:2,
	intoxication:3, induction: 3, toxique:3,
	involontaire:4,
	etouffement:5, asphyxie: 5,
	noyade:6, noyer:6, baignade:6, baigner:6, piscine:6, plage:6, mer:6, nager:6, natation:6, bateau:6,
	elongation:7, muscle:7, porter:7, dos:7, lumbago:7,
	coupe:8, coupure:8, blessure:8, blesser:8, cisailles:8, lame:8, sang:8, saigner:8,
	morsure:9, griffure:9, chat:9, chien:9, mord:9, griffe:9,
	arme:10,
	renseignements: 11,"dis moi en plus":11
}
function handleAnswersBack(kw){
	console.log(kw)
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

			console.log(c);
			console.log(b);
			if (c) fkw="brulureChim";
			if (b) fkw="brulureFeu";
			if(!b&!c) fkw="brulure";
			break;
		case 2: fkw="incendie";break;
		case 3: fkw="intoxication";break;
		case 4: fkw="involontaire";break;
		case 5: fkw="etouffement";break;
		case 6: fkw="noyade";break;
		case 7: fkw="";break;
		case 8: fkw="coupe";break;
		case 9: fkw="morsure";break;
		case 10: fkw="arme";break;
		default: fkw="no"	
	}
	if (keywords[context]==keywords[fkw]){ // si l'id du keyword de context == l'id du keyword de fkw, alors on ajoute bis
		context = fkw;//mettre le context avant d'ajouter le bis car si on redemande ca decontextualise
		fkw = fkw +"Bis";
	}
	else{context=fkw;} // on store pour la prochaine fois, au cas ou l user demande plus de renseignements
	let answers={
	chute: ["Pour "+ ourDictionnaire["prevenir"][Math.floor(Math.random()*3)]+" les chutes, restez actif .\n \
	L'activité physique peut contribuer grandement à la prévention des chutes.\n\
	Avec l'accord de votre professionnel de santé, envisagez des activités comme la marche, l'aquagym ou le tai-chi, un exercice doux qui implique des mouvements lents et gracieux, semblables à ceux d'une danse."],
	chuteBis:[ourDictionnaire["phrasesRappel"][Math.floor(Math.random()*ourDictionnaire["phrasesRappel"].length)]+"Vous pouvez aussi par exemple éviter tapis aux bords élevés, restez vigilant dans les escaliers"+ourDictionnaire["surtout"][Math.floor(Math.random()*ourDictionnaire["surtout"].length)]+" en cas de pluie ou de gel."],
	brulure:["Pour "+ ourDictionnaire["prevenir"][Math.floor(Math.random()*3)]+" les brûlures, vous devriez:\n\
	Utilisez les appareils de chauffage "+ourDictionnaire["prevenir"][Math.floor(Math.random()*ourDictionnaire["prevenir"].length)]+" et tenez-les éloignés de tout ce qui peut brûler. Ne laissez jamais les bougies sans surveillance.\n \
	 Abaissez la température du chauffe-eau (inférieure à 50°C).\n\
	 Gardez les boissons chaudes, loin des bords de la table ou du comptoir.\n "],
	brulureChim:["Vous pouvez aider à "+ourDictionnaire["prevenir"][Math.floor(Math.random()*ourDictionnaire["prevenir"].length)]+" les brûlures chimiques en :\n\
		 lisant et en suivant toujours les instructions lors de l’utilisation de produits chimiques.\n \
		 en portant toujours des gants de sécurité et des lunettes de protection lorsque vous utilisez des produits chimiques. en vous lavant toujours les mains après avoir utilisé un produit chimique."],
	brulureFeu:[""],
	incendie:["Voici les principes de la prévention  incendie:\n\
		- installer des détecteurs de fumée en réseau,\n\
		-faire vérifier les appareils et les installations électriques\n\
		-apprenez en plus sur les risques incendies.\n"+ ourDictionnaire["phrasesFin"][Math.floor(Math.random()*ourDictionnaire["phrasesFin"].length)]],
	intoxication:[""],
	etouffement:[""],
	noyade:["Pour "+ ourDictionnaire["prevenir"][Math.floor(Math.random()*3)]+" la noyade, ne buvez pas d'alcool avant de vous baigner, cela risque d'altérer la \
	coordination des gestes et d'entrainer des troubles de la vision. Évitez également de nager trop longtemps loin des bords, vous risquez de vous fatiguer \
	ou de vous laisser surprendre par les courants et ne pas être en état de revenir. Si vous êtes sujet à des maladies cardio-vasculaire, la dépression ou a des vertiges, \
	la proscription de la baignade est de mise."],
	elongation:["Pour "+ ourDictionnaire["prevenir"][Math.floor(Math.random()*3)]+"de vous élonguer un muscle lors d'un effort intense, pratiquer une activité physique régulière permet de maintenir les muscles en forme \
	de réduire les risques de traumatisme. Évitez de porter ou de pousser des objets trop lourds, demandez de l'aide à quelqu'un ou utilisez \
	des objets adéquats comme une brouette ou un chario, par exemple."],
	coupe:["Pour "+ ourDictionnaire["prevenir"][Math.floor(Math.random()*3)]+" de vous couper ou de vous blaisser avec un objets tranchant, prenez soin de toujours \
	vos couteaux et ustensiles de cuisines ou de jardinage la lame vers le bas, ainsi vous pourrez les empoignez sereinement (Attention, cependant, vous n'êtes jamais \
	à l'abri d'une innatention). Pensez également à prendre votre temps et à vous appliquer pendant votre tâche pour ne pas faire de mauvaise manipulation."],
	morsure:["Pour "+ ourDictionnaire["prevenir"][Math.floor(Math.random()*3)]+" les morsures ou griffures d'animaux domestiques comme les chats ou les chiens, \
	veillez à ne pas insister à carresser l'animal lorsque celui-ci refuse. Ne tirer pas trop sur la laisse, lors d'une promenade, cela risque de l'énerver et \
	de le rendre plus aggressif. Lorsque vous le carressez, prenez garde à placer vos doigts loins de sa gueule, il pourrait vous mordre sans même le vouloir.\
	Afin d'éviter certaines maladies graves lors d'un accident, il est nécessaire de tenir à jour les vaccins de l'animal."],
	arme:[""],
	no:["Précisez votre demande, je suis là pour faire de la prévention primaire."]
	}
	console.log(answers[fkw]);
	return answers[fkw][0];
}

function searchKeyword(userMsg){
	let keys= Object.keys(keywords)
	let re= new RegExp('(?<!\S)'+'('+keys.join('|')+')','g')//le mot peut etre conjugué mais pas avoir de prefxe	return userMsg.toLowerCase().match(re)
		return userMsg.toLowerCase().match(re)
}

const createChatLi = (message, className) => {
	const chatLi= document.createElement("li");
	chatLi.classList.add("chat", className);
	chatLi.innerHTML = `<p>${message}</p>`;
	return chatLi;
}
function handleAnswerUI(userMsg){
	console.log("hello");
	const kw= searchKeyword(userMsg);
	if (!kw){
		chatbox.appendChild(createChatLi("No keyword found","incoming"));
		return;
	}
	chatbox.appendChild(createChatLi(handleAnswersBack(kw),"incoming"));
}


function pickRandString(){
	const l = randomStrings.length;
	const myRandString = randomStrings[Math.floor(Math.random()*l)]
	return myRandString;
}
function generateRandomButtons(){
	btnGrp.innerHTML=""; // Clear previous content
	const btnNumber = Math.floor(Math.random()*4)+2;
	for (let i=0; i < btnNumber; i++){
		const btn = document.createElement("button");
		btn.classList="btn-grp";
		btn.textContent = pickRandString(); //test
		btn.addEventListener("click", function() {
			createChatLi(btn.textContent, "outgoing");
			updateUI(btn.textContent);
		});
		btnGrp.appendChild(btn);	}
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




