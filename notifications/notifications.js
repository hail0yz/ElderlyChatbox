function loadParametres() {
    console.log("load paramètres")
    fontSize = parseInt(localStorage.getItem("fontSize"))
    if(Number.isNaN(fontSize)){
        console.log("Paramètres par défaut.")
        fontSize = 100;
    }
    document.body.style.fontSize = fontSize + "%"

    fontColor = localStorage.getItem("fontColor")
    if(fontColor == null){
        console.log("Paramètres par défaut.")
        fontColor = "black";
    }
    document.body.style.color = fontColor

    backgroundColor = localStorage.getItem("backgroundColor")
    if(backgroundColor == null){
        console.log("Paramètres par défaut.")
        backgroundColor = "white";
    }
    document.body.style.backgroundColor = backgroundColor

    borderColor = localStorage.getItem("borderColor")
    if(borderColor == null){
        console.log("Paramètres par défaut.")
        borderColor = "black";
    }
    document.body.style.borderColor = borderColor

    fontType = localStorage.getItem("fontType")
    if(fontType == null){
        console.log("Paramètres par défaut.")
        fontType = "Arial";
    }
    document.body.style.fontFamily = fontType
}

document.getElementById('timebox').innerHTML = new Date().toLocaleTimeString();
document.getElementById('timebox').className = 'timebox';

setInterval(updateTime, 1000);

function addNotification(message) {
    let n=document.getElementById('notification');
    let list=document.createElement('ul');
    const newNotification = document.createElement('li');
    newNotification.className = 'notif_msg';
    newNotification.textContent = message;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Supprimer';
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

function updateTime(message, targetTime) {
    document.getElementById('timebox').innerHTML = new Date().toLocaleTimeString();
    const now = new Date();
    
    if(message){
        const currentTime = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
        console.log(currentTime);
        console.log(targetTime);
        if (currentTime === targetTime) {
            addNotification(message);
        }
    }

}


function rappel(intervalleTemp,message) {
    console.log(intervalleTemp);

    if(intervalleTemp > 0) {
        setInterval(addNotification, intervalleTemp * 1000, message);
    }

}

function cibleRappel(message, targetTime) {
    const now = new Date();
    const currentTime = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
    console.log(currentTime);
    console.log(targetTime);
    if (currentTime === targetTime) {
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
            addNotification(notification.textContent.replace('Supprimer', '').trim());
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
            const targetTime = parseInt(notification.textContent.split('Cible: ')[1].split('s')[0], 10);
            rappel(
                intervalleTemp,
                message
            );
            setInterval(cibleRappel, 1000,message, targetTime);
        });
    }
});
