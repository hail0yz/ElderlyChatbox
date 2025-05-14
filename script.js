const sendChatBtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");
const btnGrp = document.querySelector("#dynamicButtons");
let userMessage;
const createChatLi = (message, className) => {
	const chatLi= document.createElement("li");
	chatLi.classList.add("chat", className);
	chatLi.innerHTML = `<p>${message}</p>`;
	console.log("blavl")
	return chatLi;
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
		btn.onclick=createChatLi;
		btnGrp.appendChild(btn);
		console.log("test");
	}
	//chatbox.scrollTop=chatbox.scrollHeight;
}
function updateUI(Usermsg){
	btnGrp.innerHTML="";
	chatbox.appendChild(createChatLi(Usermsg,"outgoing"));
	document.getElementById("msg").value = "";
	chatbox.appendChild(createChatLi("Je réflechis...","incoming"));
    generateRandomButtons();

}
const handleChat = () => {
chatInput = document.getElementById("msg");
	userMessage = chatInput.value.trim();
	if (!userMessage) return;
	updateUI(userMessage);
}
sendChatBtn.addEventListener("click", handleChat);


