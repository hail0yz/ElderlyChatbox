const sendChatBtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");
const btnGrp = document.querySelector("#dynamicButtons");
let userMessage;
let keyCount=0;
let ourDictionnaire = {
	prevenir:["prévenir","aviser","pallier"],
	sports:["gymnastique douce","gym sénior","marche à pied","tai-chi","aquagym"]

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
	brulure:1,brûlé:1, brûlée:1,
	chimique:101, cigarette:102,
	incendie:2,
	intoxication:3, induction: 3, toxique:3,
	involontaire:4,
	etouffement:5, asphyxie: 5,
	noyade:6, noyer:6,
	elongation:7,
	coupe:8,
	morsure:9,
	griffure:9,
	arme:10
}
function handleAnswersBack(kw){
	switch(keywords[kw[0]]){
		case 0: fkw="chute";break;
		case 1: 
			c=0;
			if ("chimique" in kw){
				c=1;
			}
			b=0;
			if ("cigarette" in kw){
				b=1;
			}
			if ((b==1 && c==1)||(b==0 && c==0)){fkw="brulure";break;}
			if (b==1){fkw="brulureF";break;}
			fkw="brulure";
		case 2: fkw="incendie";break;
		case 3: fkw="intoxication";break;
		case 4: fkw="involontaire";break;
		case 5: fkw="etouffement";break;
		case 6: fkw="noyade";break;
		case 7: fkw="";break;
		case 8: fkw="coupe";break;
		case 9: fkw="morsure";break;
		case 10: fkw="arme";break;		
	}
	let answers={
	chute: ["Pour "+ ourDictionnaire["prevenir"][Math.floor(Math.random()*3)]+" les chutes, restez actif .\n L'activité physique peut contribuer grandement à la prévention des chutes.\n Avec l'accord de votre professionnel de santé, envisagez des activités comme la marche, l'aquagym ou le tai-chi, un exercice doux qui implique des mouvements lents et gracieux, semblables à ceux d'une danse."],
	brulure:[""],
	brulureChim:[""],
	brulureFeu:[""],
	incendie:[""],
	intoxication:[""],
	etouffement:[""],
	noyade:[""],
	elongation:[""],
	coupe:[""],
	morsure:[""],
	arme:[""]
	}
	console.log
	return answers[fkw];
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




