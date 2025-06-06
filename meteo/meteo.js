const url =
	'https://api.openweathermap.org/data/2.5/weather';
const apiKey =
	'f00c38e0279b7bc85480c3fe775d518c';


let data = await window.chatbot_app.get_settings();


$(document).ready(function () {
	weatherFn(data["ville"]);
});

setInterval(weatherFn, 15000, data["ville"]);

async function weatherFn(cName) {
	const temp =
		`${url}?q=${cName}&appid=${apiKey}&units=metric`;
	try {
		const res = await fetch(temp);
		const data = await res.json();
		if (res.ok) {
			weatherShowFn(data);
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
	$('#date').text(moment().format('MMMM DD YYYY, HH:mm:ss'));
    $('#temperature').html(`${Math.round(temp)}&deg;C`);
    $('#wind-speed').html(`Vitesse vent: ${speed} m/s`);
    $('#weather-icon').attr('src', `http://openweathermap.org/img/wn/${icon}@2x.png`);
    $('#weather-info').fadeIn();
}