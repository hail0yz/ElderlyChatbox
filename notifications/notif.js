document.getElementById('timebox').innerHTML = new Date().toLocaleTimeString();
document.getElementById('timebox').className = 'timebox';

setInterval(updateTime, 1000);
setInterval(rappel, 1000 ); 


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
}

function updateTime() {
    document.getElementById('timebox').innerHTML = new Date().toLocaleTimeString();
    const now = new Date();
    
    //test
    if (now.getSeconds() % 1 === 0) { 
        addNotification('TESttttttttttttttttttttttttttttttttttttttttt\n\ntttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttt');
        //window.open().document.write("<title>Assistant personnel | Groupe A </title> <h1>test</h1>");
        const NOTIFICATION_TITLE = 'Notification'
        const NOTIFICATION_BODY = 'test'

        new window.Notification(NOTIFICATION_TITLE, { body: NOTIFICATION_BODY })
        .onclick = () => { document.getElementById('output').innerText = CLICK_MESSAGE }

        const appId = 'electron-windows-notifications'
        const {ToastNotification} = require('electron-windows-notifications')

        let notification = new ToastNotification({
            appId: appId,
            template: `<toast><visual><binding template="ToastText01"><text id="1">%s</text></binding></visual></toast>`,
            strings: ['test']
        })

        notification.on('activated', () => console.log('Activated!'))
        notification.show()
        
    }
}


function rappel() {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const notificationTime = 12 * 60; // 12:00 PM in minutes
    
    //idée de notif à faire selon l'heure midi exemple rappel midicament
    if (currentTime === notificationTime) {
        addNotification("Il est temps de prendre votre médicament !");
    }

    if( now.getMinutes() === 0 && now.getSeconds() === 0) { 
        addNotification("N'oublie pas de manger et de boire de l'eau ");
    }

    //entre 11h-13h 18 h-20h tous les 5 minutes
    if ((now.getHours() >= 11 && now.getHours() < 13) || (now.getHours() >= 18 && now.getHours() < 20)) {
        if (now.getMinutes() % 5 === 0 && now.getSeconds() === 0) { 
            addNotification("N'oublie pas d'éteindre la caserolle");
        }
    }
}

function clearNotifications() {
    n=document.getElementById('notification');
    n.innerHTML = ''; 
}
