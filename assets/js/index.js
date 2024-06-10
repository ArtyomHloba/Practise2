'user strict'

const weatherUrl = "https://api.open-meteo.com/v1/forecast?latitude=47.8517&longitude=35.1171&hourly=temperature_2m&daily=temperature_2m_max&current_weather=true&timezone=Europe/Kiev";

let isCelsiDegree = true;
let isKMToH = true;

const tempUnitBtn = document.querySelector('.tempunitBtn');
tempUnitBtn.textContent = `Переключитися на ${isCelsiDegree ? 'F' : 'C'}`;

const speedUnitBtn = document.querySelector('.speedBtn');
speedUnitBtn.textContent = `Переключитися ${isKMToH ? 'ms' : 'km/s'}`;

speedUnitBtn.onclick = switchSpeedUnit;

function switchSpeedUnit(){
    isKMToH = !isKMToH;
    speedUnitBtn.textContent = `Переключитися ${isKMToH ? 'ms' : 'km/s'}`;

    fetch(`https://api.open-meteo.com/v1/forecast?latitude=47.8517&longitude=35.1171&hourly=temperature_2m&daily=temperature_2m_max&current_weather=true&timezone=Europe/Kiev${isKMToH ? '' : '&wind_speed_unit=ms'} `)
    .then(response => response.json())
    .then(data => generateWeather(data))
    .catch(err => console.log(err));
}


tempUnitBtn.onclick = switchTemperatureUnit;

function switchTemperatureUnit(){
    isCelsiDegree = !isCelsiDegree;
    tempUnitBtn.textContent = `Переключитися на ${isCelsiDegree ? 'F' : 'C'}`;

    fetch(`https://api.open-meteo.com/v1/forecast?latitude=47.8517&longitude=35.1171&hourly=temperature_2m&daily=temperature_2m_max&current_weather=true&timezone=Europe/Kiev${isCelsiDegree? '' : '&temperature_unit=fahrenheit'} `)
    .then(response => response.json())
    .then(data => generateWeather(data))
    .catch(err => console.log(err));

}


fetch(weatherUrl)
    .then(response => response.json())
    .then(data => generateWeather(data))
    .catch(err => console.log(err));

function generateWeather({ 
    current_weather: { temperature, windspeed}, 
    current_weather_units: { temperature: tempUnit, windspeed: windUnit},
    timezone 
}) {

    const currentTemperatureEl = document.querySelector('.temperatura');
    const currentTimeZoneEl = document.querySelector('.location');
    const currentWindspeedEl = document.querySelector('.speed');

    currentTemperatureEl.textContent = `Температура: ${temperature} ${tempUnit}`;
    currentTemperatureEl.style.color = calcTemperatureColor(temperature);

    currentWindspeedEl.textContent = `Швидкість вітру: ${windspeed} ${windUnit}`;
    
    currentTimeZoneEl.textContent = `Місто: ${timezone}`;

}

function calcTemperatureColor(temperature) {
    switch (true) {
        case (temperature <= 0):
            return 'blue';
        case (temperature <= 20):
            return 'green';
        case (temperature <= 30):
            return 'orange';
        default:
            return 'red';
    }
}


