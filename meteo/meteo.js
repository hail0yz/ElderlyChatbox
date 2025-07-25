const url =
	'https://api.openweathermap.org/data/2.5/weather';
const apiKey =
	'f00c38e0279b7bc85480c3fe775d518c';


let data = await window.chatbot_app.get_settings();

let last_data = null;
let count = 20;
let affiche_forte_chaleur = 0;

$(document).ready(function () {
	weatherFn(data["ville"]);
});

setInterval(weatherFn, 1000, data["ville"]);

async function weatherFn(cName) {
	count++;
	if(count<16) return weatherShowFn(last_data);
	count = 0;

	console.log("fetch")
	const temp =
		`${url}?q=${cName}&appid=${apiKey}&units=metric`;
	try {
		const res = await fetch(temp);
		const data = await res.json();
		if (res.ok) {
			weatherShowFn(data);
			last_data = data;
		} else {
			console.log('Error:', data.message);
		}
	} catch (error) {
		console.error('Error fetching weather data:', error);
	}
}

function weatherShowFn(data) {
    const { temp } = data.main;
    const { name } = data;
    const { icon } = data.weather[0];
    const { speed } = data.wind;

    $('#city-name').text(name);
	moment.locale('fr');
	let formattedDate = moment().format('DD MMMM YYYY, HH:mm:ss');
	$('#date').text(moment().format('DD MMMM YYYY, HH:mm:ss'));
	formattedDate = formattedDate
		.replace('January', 'janvier')
		.replace('February', 'février')
		.replace('March', 'mars')
		.replace('April', 'avril')
		.replace('May', 'mai')
		.replace('June', 'juin')
		.replace('July', 'juillet')
		.replace('August', 'août')
		.replace('September', 'septembre')
		.replace('October', 'octobre')
		.replace('November', 'novembre')
		.replace('December', 'décembre');
    $('#date').text(formattedDate);
	$('#temperature').html(`${Math.round(temp)}&deg;C`);
    $('#wind-speed').html(`Vitesse vent: ${speed} m/s`);
    $('#weather-icon').attr('src', `http://openweathermap.org/img/wn/${icon}@2x.png`);
    $('#weather-info').fadeIn();
	
	if(temp > 30 && affiche_forte_chaleur == 0) {
		affiche_forte_chaleur = 1;
		notifForteChaleur();
	}
}

function notifForteChaleur(){
	if (Notification.permission !== "granted") {
		Notification.requestPermission().then(permission => {
			if (permission === "granted") {
				const notif = new Notification("Alerte Météo", {
					body: "Attention, il fait très chaud aujourd'hui !",
				});
			}
		})
		return;
	}
	const notif = new Notification("Alerte Météo", {
		body: "Attention, il fait très chaud aujourd'hui !",
	});
}
