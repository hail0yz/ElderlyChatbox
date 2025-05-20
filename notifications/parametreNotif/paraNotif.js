
document.getElementById('form').addEventListener('submit', function (event) {
    event.preventDefault(); 
    const textNotif = document.querySelector('input[placeholder="Text de la notif"]').value.trim();
    console.log(textNotif);
    const intervalleTemp = document.querySelector('input[id="Intervalle de temps"]').value.trim();
    console.log(intervalleTemp);
    const targetDate = document.querySelector('input[id="cible_date"]').value.trim();
    console.log(targetDate);
    const targetTime = document.querySelector('input[id="Heure cible"]').value.trim();
    console.log(targetTime);
    
    if (!textNotif) {
        window.alert('Veuillez entrer un texte pour la notification.');
        return;
    }

    addlist(textNotif, intervalleTemp,targetTime,targetDate);
});

function addlist(message, intervalleTemp, targetTime,targetDate) {
    let n = document.getElementById('cadreNotif');
    const newNotification = document.createElement('li');
    newNotification.className = 'notif';
    newNotification.textContent = `${message} (Intervalle: ${intervalleTemp}s)`;

    const date= document.createElement('date');
    date.textContent = `Date: ${targetDate}`;
    newNotification.appendChild(date);
    if (!targetDate || targetDate === 'undefined') {
      date.style.display = 'none';
    }

    const notifTime = document.createElement('time');
    notifTime.textContent = `Cible: ${targetTime}`;
    newNotification.appendChild(notifTime);
    if(!targetTime || targetTime === 'undefined') {
      notifTime.style.display = 'none';
    }
    

    const deleteButton = document.createElement('button');
    deleteButton.textContent = ' Supprimer';
    deleteButton.onclick = () => {
        n.removeChild(newNotification);
        localStorage.setItem('notiflist', n);
    };
    deleteButton.className = 'button_del_notif';

    newNotification.appendChild(deleteButton);
    n.appendChild(newNotification);

    localStorage.setItem('notiflist',n);
}

function saveNotifications() {
    notiflist = document.getElementById('cadreNotif').innerHTML;
    localStorage.setItem('notiflist',notiflist);
}

window.addEventListener('beforeunload', saveNotifications);

window.addEventListener('load', () => {
    storedNotifList = localStorage.getItem('notiflist');
    if (storedNotifList) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = storedNotifList;
        const notifications = tempDiv.querySelectorAll('.notif');
        console.log(notifications.length);
        if(notifications.length === 0) {
            ajoutBasicNotif();
        }

        notifications.forEach(notification => {
            const message = notification.textContent.split(' (')[0];
            const intervalleTemp = parseInt(notification.textContent.split('Intervalle: ')[1].split('s')[0], 10);
            const targetTime = notification.textContent.split('Cible: ')[1].split(' ')[0];
            const targetDate = notification.querySelector('date').textContent.split('Date: ')[1].split(' ')[0];

            console.log(message);
            console.log(intervalleTemp);
            console.log(targetTime);
            console.log(targetDate);

            addlist(message, intervalleTemp, targetTime,targetDate);
        });
    }
    console.log(storedNotifList);
});

function ajoutBasicNotif(){
    intervalleTemp = 3;
   
    addlist("N'oublie pas de manger !", intervalleTemp);

    addlist("N'oublie pas de boire !", intervalleTemp);

    addlist("Pense à faire de l'exercice (marche, mini footing, ...) !", intervalleTemp);
}

intervalleTemp = document.getElementById("Intervalle de temps");

intervalleTemp.addEventListener(
  "input",
  () => {
    console.log(intervalleTemp.value);
  },
  false,
);

targetTime = document.getElementById("Heure cible");

targetTime.addEventListener(
  "input",
  () => {
    console.log(targetTime.value);
  },
  false,
);

targetDate= document.getElementById("cible_date");

targetDate.addEventListener(
  "input",
  () => {
    console.log(targetDate.value);
  },
  false,
);
