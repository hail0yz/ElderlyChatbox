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
}

function updateTime() {
    document.getElementById('timebox').innerHTML = new Date().toLocaleTimeString();
    const now = new Date();
}


function rappel(intervalleTemp,targetTime,message) {
    const now = new Date();
    const currentTime = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
    if (currentTime === targetTime) {
        addNotification(message);
    }
    setInterval(addNotification, intervalleTemp * 1000, message);

}

function clearNotifications() {
    n=document.getElementById('notification');
    n.innerHTML = ''; 
    localStorage.clear('savedNotifications');
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
                targetTime,
                message
            );
        });
    }
});
