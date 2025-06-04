function addNotification(message) {
    const NOTIFICATION_TITLE = 'Notification'
    const NOTIFICATION_BODY = message
    new window.Notification(NOTIFICATION_TITLE, { body: NOTIFICATION_BODY })
    .onclick = () => { document.getElementById('output').innerText = CLICK_MESSAGE }
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

    let data;
    window.addEventListener('load', async () => {
        data = await window.chatbot_app.get_notif_data();
        console.log("data", data);
        handle_notif();
        notifFormulaire();
        window.chatbot_app.set_notif_data(data);
    });

    function handle_notif(){
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

function notifFormulaire(){
    window.chatbot_app.get_form_data().then(formulaire => {
        console.log("form", formulaire);
        if(formulaire["answers"] == null || formulaire["answers"] == undefined) {
            console.log("formulaire vide");
            return;
        }
        else{
            const formData = formulaire["answers"];
            for (const key in formData) {
                if (formData["notifications"] ==="true") {
                    switch (key) {
                        case "risqueDenutrition":
                            if (formData[key] === "oui") {
                                data["notif_def"]["risqueDenutrition"] = {
                                    message: "Pensez à manger.",
                                    intervalleTemp: 10,
                                    targetTime: null,
                                    targetDate: null,
                                    id:key
                                };
                            }
                            break;
                        case "risqueDeshydratation":
                            if (formData[key] === "oui") {
                                data["notif_def"]["risqueDeshydratation"] = {
                                    message: "Pensez à boire.",
                                    intervalleTemp: 10,
                                    targetTime: null,
                                    targetDate: null,
                                    id:key
                                };
                            }
                            break;
                        case "risqueChute":
                            if (formData[key] === "oui") {
                                data["notif_def"]["risqueChute"] = {
                                    message: "Faites attention aux tapis, escalier, sol glissante.",
                                    intervalleTemp: 10,
                                    targetTime: null,
                                    targetDate: null,
                                    id:key
                                };
                            }
                            break;
                        case "risqueIntoxInhalation":
                            if (formData[key] === "oui") {
                                data["notif_def"]["risqueIntoxInhalation"] = {
                                    message: "Pensez à aérer les pièces.",
                                    intervalleTemp: 10,
                                    targetTime: null,
                                    targetDate: null,
                                    id:key
                                };
                            }
                            break;
                        case "risqueArmeFeu":
                            if (formData[key] === "oui") {
                                data["notif_def"]["risqueArmeFeu"] = {
                                    message: "Attention aux armes à feu.",
                                    intervalleTemp: 10,
                                    targetTime: null,
                                    targetDate: null,
                                    id:key
                                };
                            }
                            break;
                        case "risqueEtouffement":
                            if (formData[key] === "oui") {
                                data["notif_def"]["risqueEtouffement"] = {
                                    message: "Faites attentions à bien macher la nouriture.",
                                    intervalleTemp: 10,
                                    targetTime: null,
                                    targetDate: null,
                                    id:key
                                };
                            }
                            break;
                    }
                }
            }
        }
    }).catch(error => {
        console.error("Error fetching form data:", error);
    });

}