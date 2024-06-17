'use strict';

const weatherUrl = "https://api.open-meteo.com/v1/forecast?latitude=47.8517&longitude=35.1171&hourly=temperature_2m&daily=temperature_2m_max&current_weather=true&timezone=Europe/Kiev";
const threeDaysWeatherUrl = "https://api.open-meteo.com/v1/forecast?latitude=47.8517&longitude=35.1171&daily=temperature_2m_max,precipitation_sum,wind_speed_10m_max&wind_speed_unit=ms&timezone=GMT&forecast_days=3";
const sevenDaysWeatherUrl = "https://api.open-meteo.com/v1/forecast?latitude=47.875&longitude=35.125&daily=temperature_2m_max,precipitation_sum,wind_speed_10m_max&wind_speed_unit=ms&timezone=GMT&forecast_days=7";

let isCelsiDegree = true;
let isKMToH = true;

const tempUnitBtn = document.querySelector('.tempunitBtn');
tempUnitBtn.textContent = `Переключитися на ${isCelsiDegree ? 'F' : 'C'}`;

const speedUnitBtn = document.querySelector('.speedBtn');
speedUnitBtn.textContent = `Переключитися ${isKMToH ? 'ms' : 'km/s'}`;

speedUnitBtn.onclick = switchSpeedUnit;
tempUnitBtn.onclick = switchTemperatureUnit;

function switchSpeedUnit(){
    isKMToH = !isKMToH;
    speedUnitBtn.textContent = `Переключитися ${isKMToH ? 'ms' : 'km/s'}`;

    fetch(`${weatherUrl}${isKMToH ? '' : '&wind_speed_unit=ms'}`)
    .then(response => response.json())
    .then(data => generateWeather(data))
    .catch(err => console.log(err));
}

function switchTemperatureUnit(){
    isCelsiDegree = !isCelsiDegree;
    tempUnitBtn.textContent = `Переключитися на ${isCelsiDegree ? 'F' : 'C'}`;

    fetch(`${weatherUrl}${isCelsiDegree ? '' : '&temperature_unit=fahrenheit'}`)
    .then(response => response.json())
    .then(data => generateWeather(data))
    .catch(err => console.log(err));
}

fetch(weatherUrl)
    .then(response => response.json())
    .then(data => generateWeather(data))
    .catch(err => console.log(err));

fetch(threeDaysWeatherUrl)
    .then(response => response.json())
    .then(data => generateThreeDaysWeather(data.daily))
    .catch(err => console.log(err));

const showSevenDaysWeatherBtn = document.querySelector('.show-seven-days-weather-btn');
showSevenDaysWeatherBtn.onclick = showSevenDaysWeather;

function showSevenDaysWeather() {
    const sevenDaysMainContainer = document.querySelector('.seven-days-main-container');
    if (sevenDaysMainContainer.style.display === "none" || !sevenDaysMainContainer.style.display) {
        sevenDaysMainContainer.style.display = "block";
        fetch(sevenDaysWeatherUrl)
            .then(response => response.json())
            .then(data => generateSevenDaysWeather(data.daily))
            .catch(err => console.log(err));
    } else {
        sevenDaysMainContainer.style.display = "none";
    }
}

function generateWeather({ 
    current_weather: { temperature, windspeed }, 
    current_weather_units: { temperature: tempUnit, windspeed: windUnit },
    timezone 
}) {
    const currentTemperatureEl = document.querySelector('.temperatura');
    const currentTimeZoneEl = document.querySelector('.location');
    const currentWindspeedEl = document.querySelector('.speed');
    const weatherImage = document.querySelector('.pic-about-weather');

    let colorFunc = isCelsiDegree ? calcTemperatureColor : calcTemperatureColorFahrenheit;
    currentTemperatureEl.textContent = `Поточна температура: ${temperature} ${tempUnit}`;
    currentTemperatureEl.style.color = colorFunc(temperature);
    weatherImage.src = selectPic(temperature);

    currentWindspeedEl.textContent = `Поточна швидкість вітру: ${windspeed} ${windUnit}`;
    currentTimeZoneEl.textContent = `Місце розташування: ${timezone}`;
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

function calcTemperatureColorFahrenheit(temperature) {
    switch (true) {
        case (temperature <= 32):
            return 'blue';
        case (temperature <= 68):
            return 'green';
        case (temperature <= 86):
            return 'orange';
        default:
            return 'red';
    }
}

function selectPic(temperature) {
    if (temperature < 0) {
        return "./assets/img/icon-snowy.png";
    } else if (temperature <= 20) {
        return "./assets/img/icon-sun.png";
    } else {
        return "./assets/img/icon-sun.png";
    }
}

function generateThreeDaysWeather(daily) {
    const days = daily.time;
    const maxTemps = daily.temperature_2m_max;
    const precipitations = daily.precipitation_sum;
    const windSpeeds = daily.wind_speed_10m_max;

    const threeDaysWeatherCards = document.querySelectorAll('.threedays-weather-card');
    
    threeDaysWeatherCards.forEach((card, index) => {
        if (days[index]) {
            const dayEl = card.querySelector('.day');
            const maxTempEl = card.querySelector('.threedays-temperatura');
            const precipitationEl = card.querySelector('.threedays-precipitation');
            const windSpeedEl = card.querySelector('.threedays-speed');
            const weatherImage = card.querySelector('.threedays-pic-about-weather');

            dayEl.textContent = `Дата: ${days[index]}`;
            maxTempEl.textContent = `Температура: ${maxTemps[index]}°C`;
            precipitationEl.textContent = `Опади: ${precipitations[index]} мм`;
            windSpeedEl.textContent = `Швидкість вітру: ${windSpeeds[index]} m/s`;

            maxTempEl.style.color = calcTemperatureColor(maxTemps[index]);
            weatherImage.src = selectPic(maxTemps[index]);
        }
    });
}

function generateSevenDaysWeather(daily) {
    const days = daily.time;
    const maxTemps = daily.temperature_2m_max;
    const precipitations = daily.precipitation_sum;
    const windSpeeds = daily.wind_speed_10m_max;

    const sevenDaysWeatherCards = document.querySelectorAll('.seven-days-weather-card');
    
    sevenDaysWeatherCards.forEach((card, index) => {
        if (days[index]) {
            const dayEl = card.querySelector('.seven-days-date');
            const maxTempEl = card.querySelector('.seven-days-temperatura');
            const precipitationEl = card.querySelector('.seven-days-precipitation');
            const windSpeedEl = card.querySelector('.seven-days-speed');
            const weatherImage = card.querySelector('.seven-days-pic-about-weather');

            dayEl.textContent = `Дата: ${days[index]}`;
            maxTempEl.textContent = `Температура: ${maxTemps[index]}°C`;
            precipitationEl.textContent = `Опади: ${precipitations[index]} mm`;
            windSpeedEl.textContent = `Швидкість вітру: ${windSpeeds[index]} m/s`;

            maxTempEl.style.color = calcTemperatureColor(maxTemps[index]);
            weatherImage.src = selectPic(maxTemps[index]);
        }
    });
}

function updateRealTime() {
    const realTime = document.querySelector('.real-time');
    const now = new Date();
    const dateOptions = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    const dateStr = now.toLocaleDateString('uk-UA', dateOptions);
    realTime.textContent = `${dateStr}`;
}

updateRealTime();
