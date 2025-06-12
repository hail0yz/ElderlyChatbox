function addNotification(message) {
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

let data;
let formulaire;

window.addEventListener('load', async () => {
    data = await window.chatbot_app.get_notif_data();
    formulaire= await window.chatbot_app.get_form_data();
    handle_notif();
});

function notifON(){
        console.log("form", formulaire);
        if(formulaire["answers"] == null || formulaire["answers"] == undefined) {
            console.log("formulaire vide");
            return false ;
        }
        else{
            const formData = formulaire["answers"];
            console.log("formData", formData);
            console.log("notifications", formData["notifications"]);
                if (formData["notifications"] === "true" || formData["notifications"] === true || formData["notifications"] === "oui") {
                    console.log("Notifications activées");
                    return true;
                }
            return false;
        }
    }

  

function cibleRappel(message, targetTime, targetDate) {
    const now = new Date();

    if(targetTime == null || targetTime == "" || targetTime == undefined) {
        console.log("targetTime null");
        return;
    }
    else if(targetDate == null || targetDate == "" || targetDate == undefined) {
        console.log("targetDate null");
        return;
    }

    let heure=targetTime.split(':')[0];
    let minute=targetTime.split(':')[1];


    let tempsseconde=((heure*3600)+(minute*60));

    let annee=targetDate.split('-')[0];
    let mois=targetDate.split('-')[1];
    let jour=targetDate.split('-')[2];


    if(tempsseconde == now.getHours()*3600 + now.getMinutes()*60 && now.getDate() == jour && now.getMonth()+1 == mois && now.getFullYear() == annee && now.getSeconds() == 0) {
        addNotification(message);
    }
} 

    function handle_notif(){
        if(!notifON()) {
            console.log("Notifications désactivées");
            return;
        }
        const notif_def=data["notif_def"];
        console.log("notif para",notif_def);
            for (const notif in notif_def) {
                console.log(notif_def[notif]);
                console.log("notif",notif);
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
                    setInterval(addNotification, intervalleTemp * 1000, message);
                }
                if(targetTime != null && targetDate != null) {
                    setInterval(cibleRappel, 1000,
                        message,
                        targetTime,
                        targetDate
                    );
                }
        }

}
