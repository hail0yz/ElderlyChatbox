document.getElementById('timebox').innerHTML = new Date().toLocaleTimeString();
document.getElementById('timebox').className = 'timebox';

setInterval(updateTime, 1000);

function addNotification(message) {
    let n=document.getElementById('notification');
    let list=document.createElement('ul');
    const newNotification = document.createElement('li');
    newNotification.className = 'notif_msg';

    const messageText = document.createElement('span');
    messageText.textContent = message;
    newNotification.appendChild(messageText);

    console.log("message: " + message);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = ' Supprimer';
    deleteButton.onclick = () => list.removeChild(newNotification);
    deleteButton.className = 'button_del';

    newNotification.appendChild(deleteButton);

    list.appendChild(newNotification);

    n.appendChild(list);

    const NOTIFICATION_TITLE = 'Notification'
    const NOTIFICATION_BODY = message

    new window.Notification(NOTIFICATION_TITLE, { body: NOTIFICATION_BODY })
    .onclick = () => { document.getElementById('output').innerText = CLICK_MESSAGE }
   /* const appId = 'electron-windows-notifications'
    const {ToastNotification} = require('electron-windows-notifications')

    let notification = new ToastNotification({
        appId: appId,
        template: `<toast><visual><binding template="ToastText01"><text id="1">%s</text></binding></visual></toast>`,
        strings: [message]
    })
    


    notification.on('activated', () => console.log('Activated!'))


    notification.show()*/

}

function updateTime() {
    document.getElementById('timebox').innerHTML = new Date().toLocaleTimeString();
}

function rappel(intervalleTemp,message) {
    console.log(intervalleTemp);

    if(intervalleTemp > 0) {
        setInterval(addNotification, intervalleTemp * 1000, message);
    }

}

function cibleRappel(message, targetTime, targetDate) {
    const now = new Date();

    console.log(now.toLocaleTimeString);
    console.log(targetTime);
    console.log(now.toLocaleDateString());
    console.log(targetDate);

    heure=targetTime.split(':')[0];
    minute=targetTime.split(':')[1];

    tempsseconde=((heure*3600)+(minute*60));

    annee=targetDate.split('-')[0];
    mois=targetDate.split('-')[1];
    jour=targetDate.split('-')[2];

    console.log(jour);
    console.log(now.getDate());
    console.log(mois); 
    console.log(now.getMonth());
    console.log(annee);
    console.log(now.getFullYear());

    if(tempsseconde == now.getHours()*3600 + now.getMinutes()*60 && now.getDate() == jour && now.getMonth() == mois && now.getFullYear() == annee) {
        console.log('Notification');
        addNotification(message);
    }

}

function clearNotifications() {
    n=document.getElementById('notification');
    n.innerHTML = ''; 
    localStorage.removeItem('savedNotifications');
}


function saveNotifications() {
    const notifications = document.getElementById('notification').innerHTML;
    localStorage.setItem('savedNotifications', notifications);
}

window.addEventListener('beforeunload', saveNotifications);

window.addEventListener('load', () => {
    const savedNotifications = localStorage.getItem('savedNotifications');
    if (savedNotifications) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = savedNotifications;
        const notifications = tempDiv.querySelectorAll('.notif_msg');
        notifications.forEach(notification => {
            addNotification(notification.getElementsByTagName('span')[0].textContent);
        });
    }

    const savedNotiflist = localStorage.getItem('notiflist');
    console.log(savedNotiflist);
    if (savedNotiflist) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = savedNotiflist;
        const notifications = tempDiv.querySelectorAll('.notif');
        notifications.forEach(notification => {
            const message = notification.textContent.split(' (')[0];
            const intervalleTemp = parseInt(notification.textContent.split('Intervalle: ')[1].split('s')[0], 10);
            const targetTime = notification.textContent.split('Cible: ')[1].split(' ')[0];
            const targetDate = notification.querySelector('date').textContent.split('Date: ')[1].split(' ')[0];
            rappel(
                intervalleTemp,
                message
            );
            setInterval(cibleRappel, 1000,message, targetTime, targetDate);
        });
    }
});
