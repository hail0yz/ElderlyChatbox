document.getElementById('timebox').innerHTML = new Date().toLocaleTimeString();
document.getElementById('timebox').className = 'timebox';
setInterval(updateTime, 1000);

function saveData() {
	window.chatbot_app.set_notif_data(data);
}

let data;
let formulaire;

window.addEventListener('load', async () => {
    data = await window.chatbot_app.get_notif_data();
    formulaire = await window.chatbot_app.get_form_data();
    loaddata();
    console.log("data",data);
});

function notifON(){
        console.log("form", formulaire);
        if(formulaire["answers"] == null || formulaire["answers"] == undefined) {
            console.log("formulaire vide");
            return false ;
        }
        else{
            const formData = formulaire["answers"];
                if (formData["notifications"] ==="true") {
                    return true;
                }
            return false;
        }
    }



function addNotification(message) {
    if(!notifON()) {
        console.log("Notifications désactivées");
        return;
    }
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

    if (Notification.permission !== "granted") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                new window.Notification(NOTIFICATION_TITLE, { body: NOTIFICATION_BODY })
                .onclick = () => { document.getElementById('output').innerText = CLICK_MESSAGE }
            }
        });
        return;
    }
    new window.Notification(NOTIFICATION_TITLE, { body: NOTIFICATION_BODY })
    .onclick = () => { document.getElementById('output').innerText = CLICK_MESSAGE }

}

function updateTime() {
    document.getElementById('timebox').innerHTML = new Date().toLocaleTimeString();
}

function rappel(intervalleTemp,message) {

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

    if(targetTime == null || targetTime == "" || targetTime == undefined) {
        console.log("targetTime null");
        return;
    }

    let heure=targetTime.split(':')[0];
    let minute=targetTime.split(':')[1];


    let tempsseconde=((heure*3600)+(minute*60));

    let annee=targetDate.split('-')[0];
    let mois=targetDate.split('-')[1];
    let jour=targetDate.split('-')[2];


    if(tempsseconde == now.getHours()*3600 + now.getMinutes()*60 && now.getDate() == jour && now.getMonth()+1 == mois && now.getFullYear() == annee && now.getSeconds() == 0) {
        console.log('Notification');
        addNotification(message);
    }
    else if(targetDate == null || targetDate == "" || targetDate == undefined) {
        console.log("targetDate null");
        if(tempsseconde == now.getHours()*3600 + now.getMinutes()*60 && now.getSeconds() == 0) {
            console.log('Notification');
            addNotification(message);
        }
    }

}

function clearNotifications() {
    let n=document.getElementById('notification');
    n.innerHTML = ''; 
    data["notif_histo"]["ul"]= n.innerHTML;
    saveData();
}


function saveNotifications() {
    const notifications = document.getElementById('notification').innerHTML;
    data["notif_histo"]["ul"]= notifications;
    saveData();
}

window.addEventListener('beforeunload', saveNotifications);

function loaddata() {
    console.log("loaddata");
    const notif_def=data["notif_def"];
    console.log("notif para",notif_def);
        for (const notif in notif_def) {
            console.log(notif_def[notif]);
            if(notif_def[notif]== null) {
                console.log("notif null");
                continue;
            }
            const message = notif_def[notif].message;
            const intervalleTemp = parseInt(notif_def[notif].intervalleTemp);
            const targetTime = notif_def[notif].targetTime;
            const targetDate = notif_def[notif].targetDate;

            console.log("message",message);
            console.log("intervalle",intervalleTemp);
            console.log("targetTime",targetTime);
            console.log("targetDate",targetDate);
            if(intervalleTemp > 0 ) {
                rappel(
                    intervalleTemp,
                    message
                );
            }
            if(targetTime != null && targetDate != null) {
                setInterval(cibleRappel, 1000,
                    message,
                    targetTime,
                    targetDate
                );
            }
    }

    const savedNotifications= data["notif_histo"]["ul"];
    console.log("savedNotifications",savedNotifications);
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = savedNotifications;
    const notifications = tempDiv.querySelectorAll('.notif_msg');
    notifications.forEach(notification => {
        addNotification(notification.getElementsByTagName('span')[0].textContent);
    })
}



document.getElementById('clearButton').onclick = () => clearNotifications();


function initData(){
    data["notif_def"] = {}
    data["notif_histo"]= {}
}
