
document.getElementById('form').addEventListener('submit', function (event) {
    event.preventDefault(); 
    const textNotif = event.target.querySelector('input[placeholder="Text de la notif"]').value.trim();
    const intervalleTemp = event.target.querySelector('input[placeholder="Intervalle de temps"]').value.trim();
    const targetTime = event.target.querySelector('input[placeholder="Heure cible"]').value.trim();

    const targetTimeParts = targetTime.split(':');
    const targetHours = parseInt(targetTimeParts[0], 10);
    const targetMinutes = parseInt(targetTimeParts[1], 10);
    const targetSeconds = parseInt(targetTimeParts[2], 10);
    const targetTimeInSeconds = targetHours * 3600 + targetMinutes * 60 + targetSeconds;

    const intervalleTempParts = intervalleTemp.split(':');
    const intervalleHours = parseInt(intervalleTempParts[0], 10);
    const intervalleMinutes = parseInt(intervalleTempParts[1], 10);
    const intervalleSeconds = parseInt(intervalleTempParts[2], 10);
    const intervalleTempInSeconds = intervalleHours * 3600 + intervalleMinutes * 60 + intervalleSeconds;
    
    if (!textNotif) {
        alert('Veuillez entrer un texte pour la notification.');
        return;
    }

    addlist(textNotif, intervalleTempInSeconds, targetTimeInSeconds);
});

function addlist(message, intervalleTemp, targetTime) {
    let n = document.getElementById('cadreNotif');
    const newNotification = document.createElement('li');
    newNotification.className = 'notif';
    newNotification.textContent = `${message} (Intervalle: ${intervalleTemp}s, Cible: ${targetTime}s)`;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Supprimer';
    deleteButton.onclick = () => {
        n.removeChild(newNotification);
        notiflist = notiflist.removeChild(newNotification);
        localStorage.setItem('notiflist', notiflist);
    };
    deleteButton.className = 'button_del';

    newNotification.appendChild(deleteButton);
    n.appendChild(newNotification);

    const notifObject = { message: message, intervalleTemp: intervalleTemp, targetTime: targetTime };
    notiflist.push(notifObject);
    localStorage.setItem('notiflist', notiflist);
}

function saveNotifications() {
    notiflist = document.getElementById('cadreNotif').innerHTML;
    localStorage.setItem('notiflist',notiflist);
}

window.addEventListener('beforeunload', saveNotifications);

window.addEventListener('load', () => {
    notiflist=[];
    const storedNotifList = localStorage.getItem('notiflist');
    if (storedNotifList) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = storedNotifList;
        const notifications = tempDiv.querySelectorAll('.notif');
        notifications.forEach(notification => {
            const message = notification.textContent.split(' (')[0];
            const intervalleTemp = parseInt(notification.textContent.split('Intervalle: ')[1].split('s')[0], 10);
            const targetTime = parseInt(notification.textContent.split('Cible: ')[1].split('s')[0], 10);
            addlist(message, intervalleTemp, targetTime);
        });
    }
});