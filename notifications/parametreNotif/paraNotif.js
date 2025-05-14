
document.getElementById('form').addEventListener('submit', function (event) {
    event.preventDefault(); 
    const textNotif = event.target.querySelector('input[placeholder="Text de la notif"]').value.trim();
    
    if (!textNotif) {
        alert('Veuillez entrer un texte pour la notification.');
        return;
    }

    addlist(textNotif);
});

function addlist(message) {
    let n = document.getElementById('cadreNotif');
    const newNotification = document.createElement('li');
    newNotification.className = 'notif';
    newNotification.textContent = message;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Supprimer';
    deleteButton.onclick = () => {
        n.removeChild(newNotification);
        notiflist = notiflist.filter(notif => notif !== message);
        localStorage.setItem('notiflist', JSON.stringify(notiflist));
    };
    deleteButton.className = 'button_del';

    newNotification.appendChild(deleteButton);
    n.appendChild(newNotification);
}

function saveNotifications() {
    const notiflist = document.getElementById('cadreNotif').innerHTML;
    localStorage.setItem('notiflist',notiflist);
}

window.addEventListener('beforeunload', saveNotifications);

window.addEventListener('load', () => {
    const storedNotifList = localStorage.getItem('notiflist');
    if (storedNotifList) {
        document.getElementById('cadreNotif').innerHTML = savedNotifications;
    }
});