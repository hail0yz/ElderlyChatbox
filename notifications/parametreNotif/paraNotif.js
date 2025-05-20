function saveData() {
	window.chatbot_app.set_notif_data(data);
}

let data = await window.chatbot_app.get_notif_data();

console.log("data para",data);
loadNotif();


document.getElementById('form').addEventListener('submit', function (event) {
    event.preventDefault(); 
    const textNotif = document.querySelector('input[placeholder="Text de la notif"]').value.trim();
    const intervalleTemp = document.querySelector('input[id="Intervalle de temps"]').value.trim();
    const targetDate = document.querySelector('input[id="cible_date"]').value.trim();
    const targetTime = document.querySelector('input[id="Heure cible"]').value.trim();
    
    if (!textNotif) {
        window.alert('Veuillez entrer un texte pour la notification.');
        return;
    }

    addlist(textNotif, intervalleTemp,targetTime,targetDate);
});

function addlist(message, intervalleTemp, targetTime,targetDate) {
    let n = document.getElementById('cadreNotif');
    const newNotification = document.createElement('li');
    newNotification.id = `${data["notif_def"].length}`;
    console.log(newNotification.id);
    newNotification.className = 'notif';
    newNotification.textContent = `${message}`;

    const Intervalle = document.createElement('span');
    Intervalle.textContent = ` Intervalle: ${intervalleTemp}s`;
    newNotification.appendChild(Intervalle);
    if (!intervalleTemp || intervalleTemp === 'undefined') {
      Intervalle.style.display = 'none';
    }

    const date= document.createElement('date');
    date.textContent = ` Date: ${targetDate}`;
    newNotification.appendChild(date);
    if (!targetDate || targetDate === 'undefined') {
      date.style.display = 'none';
    }

    const notifTime = document.createElement('time');
    notifTime.textContent = ` Heure: ${targetTime}`;
    newNotification.appendChild(notifTime);
    if(!targetTime || targetTime === 'undefined') {
      notifTime.style.display = 'none';
    }
    

    const deleteButton = document.createElement('button');
    deleteButton.textContent = ' Supprimer';
    deleteButton.onclick = () => {
        n.removeChild(newNotification);
        data["notif_def"][newNotification.id] = null;

    };
    deleteButton.className = 'button_del_notif';

    newNotification.appendChild(deleteButton);
    n.appendChild(newNotification);

    data["notif_def"][newNotification.id] = {
        "message": message,
        "intervalleTemp": intervalleTemp,
        "targetTime": targetTime,
        "targetDate": targetDate,
    };
    saveData();
}

function loadNotif(){
    for (const n in data["notif_def"]) {
      const notif = data["notif_def"][n];
      console.log("test",notif);
      addlist(notif.message, notif.intervalleTemp, notif.targetTime, notif.targetDate);
  }
}

window.addEventListener('load', loadNotif);


let intervalleTemp = document.getElementById("Intervalle de temps");

intervalleTemp.addEventListener(
  "input",
  () => {
    console.log(intervalleTemp.value);
  },
  false,
);

let targetTime = document.getElementById("Heure cible");

targetTime.addEventListener(
  "input",
  () => {
    console.log(targetTime.value);
  },
  false,
);

let targetDate= document.getElementById("cible_date");

targetDate.addEventListener(
  "input",
  () => {
    console.log(targetDate.value);
  },
  false,
);
