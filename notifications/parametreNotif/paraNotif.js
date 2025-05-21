function saveData() {
	window.chatbot_app.set_notif_data(data);
}

let data;

window.addEventListener('load', async () => {
  data = await window.chatbot_app.get_notif_data();
  console.log("data",data);
  loadNotif();
});




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

    addInData(textNotif, intervalleTemp,targetTime,targetDate);
});

function chargementLabel(message, intervalleTemp, targetTime,targetDate,id) { 
  let n = document.getElementById('cadreNotif');
    const newNotification = document.createElement('li');
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
        console.log("delete",id);
        data["notif_def"][`${id}`] = null;
        saveData();

    };
    deleteButton.className = 'button_del_notif';

    newNotification.appendChild(deleteButton);
    n.appendChild(newNotification);
}

function addlist(message, intervalleTemp, targetTime,targetDate,id) {
  chargementLabel(message, intervalleTemp, targetTime,targetDate,id);
}

function addInData(message, intervalleTemp, targetTime,targetDate) {
  let id =Object.keys(data["notif_def"]).length;
  console.log("id",id);
  chargementLabel(message, intervalleTemp, targetTime,targetDate,id);

  data["notif_def"][id] = {
      "message": message,
      "intervalleTemp": intervalleTemp,
      "targetTime": targetTime,
      "targetDate": targetDate,
      "id": id
  };
  saveData();
}


function loadNotif(){
    console.log("loadNotif");
    console.log(data);
    for (const n in data["notif_def"]) {
        const notif = data["notif_def"][n];
        console.log("test",notif);
        if(notif == null){
            console.log("notif null");
            continue;
        }
        addlist(notif.message, notif.intervalleTemp, notif.targetTime, notif.targetDate,notif.id);
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
