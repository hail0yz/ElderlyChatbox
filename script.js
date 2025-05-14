const sendChatBtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");
const btnGrp = document.querySelector("#dynamicButtons");
let userMessage;
const randomStrings = [
	"Je ne comprends pas",
	"Pouvez-vous m'aider",
	"Continuez",
	"Plus d'informations",
	"Expliquez-moi",
	"Donnez un exemple",
	"Recommendations"
]
let keywords= {
	chute:'chuteSample',
	brulure:'brulureSample',
	incendie:'IncendieSample',
	intoxication:'intoxicationSample',
	etouffement:'etouffementSample',
	noyade:'noyadeSample',
	elongation:'elongationSample',
	coupe:'coupeSample',
	morsure:'morsureSample',
	griffure:'griffureSample',
	arme:'armeSample',
}

function searchKeyword(userMsg){
	let keys= Object.keys(keywords)
	let re= new RegExp('\\s'+'('+keys.join('|')+')','g')//le mot peut etre conjugué mais pas avoir de prefxe
	console.log(re)
	return userMsg.toLowerCase().match(re)
}

const createChatLi = (message, className) => {
	const chatLi= document.createElement("li");
	chatLi.classList.add("chat", className);
	chatLi.innerHTML = `<p>${message}</p>`;
	console.log("blavl")
	return chatLi;
}
function handleAnswer(userMsg){
	console.log("hello")
	const kw= searchKeyword(userMsg);
	if (!kw){
		chatbox.appendChild(createChatLi("No keyword found","incoming"));
		return;
	}
	chatbox.appendChild(createChatLi(kw[0],"incoming"));
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
		//btn.type="button"
		btn.classList="btn-grp";
		btn.textContent = pickRandString(); //test
		btn.addEventListener("click", function() {
			createChatLi(btn.textContent, "outgoing");
			updateUI(btn.textContent);
		});
		btnGrp.appendChild(btn);
		console.log("test");
	}
	//chatbox.scrollTop=chatbox.scrollHeight;
}
function updateUI(Usermsg){
	btnGrp.innerHTML="";
	chatbox.appendChild(createChatLi(Usermsg,"outgoing"));
	document.getElementById("msg").value = "";
    generateRandomButtons();

}
const handleChat = () => {
chatInput = document.getElementById("msg");
	userMessage = chatInput.value.trim();
	if (!userMessage) return;
	updateUI(userMessage);
	handleAnswer(userMessage);
}
sendChatBtn.addEventListener("click", handleChat);




