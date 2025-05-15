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
	surtout:["surtout","particulièrement"],
	souhaitezvous["Souhaitez-vous", "Voudriez-vous", "Voulez-vous","Desirez-vous"]
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
	let answers={
	chute: ["Pour "+ ourDictionnaire["prevenir"][Math.floor(Math.random()*ourDictionnaire["prevenir"].length)]+" les chutes, restez actif .\n \
	L'activité physique peut contribuer grandement à la prévention des chutes.\n\
	Avec l'accord de votre professionnel de santé, envisagez des activités comme la marche, l'aquagym ou le tai-chi, un exercice doux qui implique des mouvements lents et gracieux, semblables à ceux d'une danse.",
	"Les facteurs de risques de chute sont l'âge, vos activités de la vie quotidienne, la mobilité réduite, certaines pathologies\
	telles que Parkinson, ou des troubles locomoteurs et neuro-musculaires. Pour ce qui est des facteurs extrinsèques, il s'agit de facteurs\
	comportementaux: la consommation d'alcool, la sédentarité et la malnutrition, ou bien de facteurs environnementaux comme la nécessité d'un instrument d'aide, la prise de risque ou un habitat mal adapté."],
	chuteBis:[ourDictionnaire["phrasesRappel"][Math.floor(Math.random()*ourDictionnaire["phrasesRappel"].length)]+"Vous pouvez aussi par exemple éviter tapis aux bords élevés, restez vigilant dans les escaliers"+ourDictionnaire["surtout"][Math.floor(Math.random()*ourDictionnaire["surtout"].length)]+" en cas de pluie ou de gel.",
	ourDictionnaire["phrasesRappel"][Math.floor(Math.random()*ourDictionnaire["phrasesRappel"].length)]+"Réaliser quelques tests simples peut être utile à titre systématique pour confirmer \
	l’absence de risque de chute au cours de la consultation. C’est indispensable en cas de chute signalée, même si elle paraît banale, ou en présence de facteurs de risque de chute. Vous pouvez demander à un \
	professionnel de santé de réaliser ces tests."],
	brulure:["Pour "+ ourDictionnaire["prevenir"][Math.floor(Math.random()*ourDictionnaire["prevenir"].length)]+" les brûlures, vous devriez:\n\
	Utilisez les appareils de chauffage "+ourDictionnaire["prevenir"][Math.floor(Math.random()*ourDictionnaire["prevenir"].length)]+" et tenez-les éloignés de tout ce qui peut brûler. Ne laissez jamais les bougies sans surveillance.\n \
	 Abaissez la température du chauffe-eau (inférieure à 50°C).\n\
	 Gardez les boissons chaudes, loin des bords de la table ou du comptoir.\n "],
	brulureBis:[ourDictionnaire["phrasesRappel"][Math.floor(Math.random()*ourDictionnaire["phrasesRappel"].length)]+"\
	Vous pourriez par exemple tourner les poignées des casseroles vers l’intérieurou encore ne pas oublier de laisser un peu refroidir les aliments chauffés au micro-ondes","test"],
	brulureChim:["Vous pouvez aider à "+ourDictionnaire["prevenir"][Math.floor(Math.random()*ourDictionnaire["prevenir"].length)]+" les brûlures chimiques en :\n\
		 lisant et en suivant toujours les instructions lors de l’utilisation de produits chimiques.\n \
		 en portant toujours des gants de sécurité et des lunettes de protection lorsque vous utilisez des produits chimiques. en vous lavant toujours les mains après avoir utilisé un produit chimique."],
	brulureFeu:["Pour "+ ourDictionnaire["prevenir"][Math.floor(Math.random()*ourDictionnaire["prevenir"].length)]+" les brûlures de feu, il est important de ne pas fumer à l'intérieur de votre maison. \
	Tournez les poignées des casseroles vers l'intérieur de la cuisinière. \
	Laissez un peu refeoidrir les aliments chauffés au micro-ondes. \
	Évitez de porter des vêtements amples lorsque vous cuisinez. \
	Utilisez des maniques pour manipuler les plats chauds et les ustensiles de cuisine. \
	Faites attention aux liquides bouillants et aux graisses chaudes. \
	Priviligiez une bouilloire électrique plutôt qu'une casserole pour faire chauffer de l'eau. \
	Prenez grde à toujours ouvrir l'eau froide en premier lorsque vous utilisez un robinet mélangeur. \
	Baissez la température maximale de votre chauffe-eau"],
	incendie:["Voici les principes de la prévention  incendie:\n\
		- installer des détecteurs de fumée en réseau,\n\
		-faire vérifier les appareils et les installations électriques\n\
		-apprenez en plus sur les risques incendies.\n"+ ourDictionnaire["phrasesFin"][Math.floor(Math.random()*ourDictionnaire["phrasesFin"].length)]],
	intoxication:["Pour "+ ourDictionnaire["prevenir"][Math.floor(Math.random()*ourDictionnaire["prevenir"].length)]+" les intoxications alimentares, il est important de bien se laver les mains avant de cuisiner et de manger. \
	Désinfectez régulièrement les surfaces de travail, les ustensiles de cuisine et le réfrigérateur. \
	Respectez les dates de péremption des aliments et conservez-les correctement. \
	Respectez la chaîne du froid et cuisez suffisemment vos aliments. \
	Évitez de consommer des aliments crus ou mal cuits, en particulier les viandes, les œufs et les produits laitiers. \
	Évitez de consommer des aliments périmés ou dont l'emballage est endommagé. \
	Lavez soigneusement les fruits et légumes avant de les consommer. \
	Coupez les aliments en petits morceaux pour faciliter la cuisson et réduire le risque de contamination croisée. \
	Faites en sorte de rendre les produits toxiques identifiables en les rangeant dans des contenants hermétiques et en les étiquetant clairement. \
	Enfin, conservez vos produits d'entretien et vos médicaments dans leurs emballages d'origine."],
	inhalation:["Pour "+ ourDictionnaire["prevenir"][Math.floor(Math.random()*ourDictionnaire["prevenir"].length)]+" l'inhalation de gaz toxiques, il est important de bien ventiler les pièces de votre maison. \
	Vérifiez la bonne évacuation des équipements de gaz sur l'extérieur de votre maison. \
	Vérifiez également que les appareils de chauffage à combustion sont en bon état de fonctionnement et qu'ils sont correctement installés.\
	Évitez de fumer à l'intérieur de votre maison, car la fumée de cigarette peut être toxique pour les personnes qui y vivent.\
	Respectez les consignes d'utilisation des appareils à combustion. \
	N'utilisez jamais de façon prolongée des panneaux radiants à gaz ou des poêles à pétrole. \
	Entretenez régulièrement votre cheminée si vous en avez une. \
	Ne jamais utiliser une cuisinière ou un brasero comme chauffage de secours dans une pièce fermée.\
	Enfin, il est important de ne pas utiliser de produits chimiques à l'intérieur de votre maison sans une ventilation adéquate."],
	etouffement:["Pour "+ ourDictionnaire["prevenir"][Math.floor(Math.random()*ourDictionnaire["prevenir"].length)]+" les étouffements, il est important de bien mastiquer les aliments avant de les avaler.\
	Prenez soin d'avoir une bonne hydratation et de ne pas parler en mangeant.\
	Mangez dans une position assise et stable. Évitez de manger trop vite, de trop manger ou de manger en paralant.\
	Faites attention aux noyaux des fruits et aux arêtes de poisson."],
	noyade:["Pour "+ ourDictionnaire["prevenir"][Math.floor(Math.random()*ourDictionnaire["prevenir"].length)]+" la noyade, ne buvez pas d'alcool avant de vous baigner, cela risque d'altérer la \
	coordination des gestes et d'entrainer des troubles de la vision. Évitez également de nager trop longtemps loin des bords, vous risquez de vous fatiguer \
	ou de vous laisser surprendre par les courants et ne pas être en état de revenir. Si vous êtes sujet à des maladies cardio-vasculaire, la dépression ou a des vertiges, \
	la proscription de la baignade est de mise."],
	elongation:["Pour "+ ourDictionnaire["prevenir"][Math.floor(Math.random()*ourDictionnaire["prevenir"].length)]+"de vous élonguer un muscle lors d'un effort intense, pratiquer une activité physique régulière permet de maintenir les muscles en forme \
	de réduire les risques de traumatisme. Évitez de porter ou de pousser des objets trop lourds, demandez de l'aide à quelqu'un ou utilisez \
	des objets adéquats comme une brouette ou un chario, par exemple."],
	coupe:["Pour "+ ourDictionnaire["prevenir"][Math.floor(Math.random()*ourDictionnaire["prevenir"].length)]+" de vous couper ou de vous blaisser avec un objets tranchant, prenez soin de toujours \
	vos couteaux et ustensiles de cuisines ou de jardinage la lame vers le bas, ainsi vous pourrez les empoignez sereinement (Attention, cependant, vous n'êtes jamais \
	à l'abri d'une innatention). Pensez également à prendre votre temps et à vous appliquer pendant votre tâche pour ne pas faire de mauvaise manipulation."],
	morsure:["Pour "+ ourDictionnaire["prevenir"][Math.floor(Math.random()*ourDictionnaire["prevenir"].length)]+" les morsures ou griffures d'animaux domestiques comme les chats ou les chiens, \
	veillez à ne pas insister à carresser l'animal lorsque celui-ci refuse. Ne tirer pas trop sur la laisse, lors d'une promenade, cela risque de l'énerver et \
	de le rendre plus aggressif. Lorsque vous le carressez, prenez garde à placer vos doigts loins de sa gueule, il pourrait vous mordre sans même le vouloir.\
	Afin d'éviter certaines maladies graves lors d'un accident, il est nécessaire de tenir à jour les vaccins de l'animal."],
	arme:["Les accidents domestiques d'armes à feu sont souvent sous-estimés.\
	Pour "+ ourDictionnaire["prevenir"][Math.floor(Math.random()*ourDictionnaire["prevenir"].length)]+" les accidents d'armes à feu, il est important de garder les armes à feu et les munitions dans un endroit sûr et sécurisé. \
	Traitez les armes à feu comme si elles étaient toujours chargées. \
	Ne jamais pointer une arme à feu dans une direction sûre. \
	"],
	no:["Précisez votre demande, je suis là pour faire de la prévention primaire."],
	infos:["Il semblerait que vous vouliez des renseignements sur des produits chimiques."+ourDictionnaire["souhaitezvous"][Math.floor(Math.random()*ourDictionnaire["souhaitezvous"].length)]+" prévenir les brulures chimiques, ou les intoxations chimiques?"]
	}
	ans=answers[fkw];
	return ans[Math.floor(Math.random()*ans.length)];
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
	const btn = document.createElement("button");
	btn.classList="btn-grp";
	btn.textContent = "Donnez-moi plus d'informations"; //test
	btn.addEventListener("click", function() {
		chatbox.appendChild(createChatLi(btn.textContent, "outgoing"));

		handleAnswerUI(context);
	});
	btnGrp.appendChild(btn);
	const btn2 = document.createElement("button");
	btn2.classList="btn-grp";
	btn2.textContent = "Je ne comprends pas"; //test
	btn2.addEventListener("click", function() {
		chatbox.appendChild(createChatLi(btn2.textContent, "outgoing"));
		myword=context;
		context="";
		handleAnswerUI(myword);
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




