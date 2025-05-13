const sendChatBtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");

let userMessage;
const createChatLi = (message, className) => {
	const chatLi= document.createElement("li");
	chatLi.classList.add("chat", className);
	chatLi.innerHTML = `<p>${message}</p>`;
	return chatLi;
}
function createButton(mess) {
  const button= document.createElement("button");
	button.classList.add("bottom", "btn-grp");
	button.textContent = mess;
	return button;
}
function createRandomString(length) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
function updateUI(Usermsg){

	chatbox.appendChild(createChatLi(Usermsg,"outgoing"));
	document.getElementById("msg").value = "";
	//on genere de maniere random entre 2 et 5 buttons
	/*k=Math.floor(Math.random() * 4 + 2);
	for(let i = 0; i < k; i++){
	 const option = document.createElement("button");
	    const response = `Option 1`;
	    option.classList.add("bottom");
	    option.classList.add("btn-grp");
	    option.textContent=response;
	    document.appendChild(option);
    }*/
	setTimeout(() => { // message dattente
		chatbox.appendChild(createChatLi("Je réflechis...","incoming"));
	},600);

}
const handleChat = () => {
chatInput = document.getElementById("msg");
	userMessage = chatInput.value.trim();
	if (!userMessage) return;
	updateUI(userMessage);
}
sendChatBtn.addEventListener("click", handleChat);

