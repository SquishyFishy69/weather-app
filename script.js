const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const country = document.getElementById("country");
const key = "ec62212600be07fc00ac97040cdbdd48";
const input = document.getElementById("input");
let countryInput = "Singapore";
let tempCountryInput = "Singapore";
window.onload = updateWeather;
country.onsubmit = updateWeather;

async function getWeather(site) {
  try {
    const response = await fetch(site, { mode: "cors" });
    const weatherData = await response.json();
    input.value = "";
    return weatherData;
  } catch (err) {
    console.log(err);
  }
}

async function returnWeather() {
  try {
    const error = document.getElementById("error");
    input.value = input.value || countryInput;
    if (input.value) {
      tempCountryInput = countryInput;
      countryInput = input.value;
    }
    const weather = await getWeather(
      `https://api.openweathermap.org/data/2.5/weather?q=${input.value}&appid=${key}`
    );
    const lat = weather.coord.lat;
    const lon = weather.coord.lon;
    const coord = `Lat: ${lat}, Lon: ${lon}`;
    const name = weather.name;
    const description = weather.weather[0].description;
    const getDate = new Date();
    const day = days[getDate.getDay()];
    const date = getDate.getDate();
    const month = months[getDate.getMonth()];
    const year = getDate.getFullYear();
    const time = `${getDate.getHours()}:${addZero(
      String(getDate.getMinutes())
    )}`;
    const fullDate = `${day}, ${date} ${month} ${year}`;
    const temp = weather.main.temp;
    const icon = `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`;
    const feelsLike = weather.main.feels_like;
    const humidity = weather.main.humidity + " %";
    const windSpeed = weather.wind.speed + " km/h";
    const visibility = weather.visibility + " m";
    const multiWeather = await getWeather(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${key}`
    );
    const dailyMax = [];
    const dailyMin = [];
    const dailyIcon = [];
    for (const day of multiWeather.daily) {
      dailyMax.push(day.temp.max);
      dailyMin.push(day.temp.min);
      dailyIcon.push(
        `https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`
      );
    }
    const hourlyTemp = [];
    const hourlyIcon = [];
    for (const hour of multiWeather.hourly.slice(0, 24)) {
      hourlyTemp.push(hour.temp);
      hourlyIcon.push(
        `https://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png`
      );
    }

    error.style.visibility = "hidden";

    return {
      coord,
      name,
      description,
      fullDate,
      time,
      temp,
      icon,
      feelsLike,
      humidity,
      windSpeed,
      visibility,
      dailyMax,
      dailyMin,
      dailyIcon,
      hourlyTemp,
      hourlyIcon,
    };
  } catch (err) {
    error.style.visibility = "visible";
    countryInput = tempCountryInput;
    console.log(err);
  }
}

async function updateWeather(e) {
  const description = document.getElementById("description");
  const name = document.getElementById("name");
  const coord = document.getElementById("coord");
  const date = document.getElementById("date");
  const time = document.getElementById("time");
  const temp = document.getElementById("temp");
  const icon = document.getElementById("icon");
  const feelsLike = document.getElementById("feels-like-value");
  const humidity = document.getElementById("humidity-value");
  const visibility = document.getElementById("visibility-value");
  const windSpeed = document.getElementById("wind-speed-value");
  const getUnit = checkUnit();
  const hour = document.getElementsByClassName("hour")[0];
  while (hour.lastChild) {
    hour.removeChild(hour.lastChild);
  }

  try {
    if (e) {
      e.preventDefault();
    }
    const weather = await returnWeather();
    description.textContent = weather.description;
    name.textContent = weather.name;
    coord.textContent = weather.coord;
    date.textContent = weather.fullDate;
    time.textContent = weather.time;
    temp.textContent = getUnit(weather.temp);
    icon.src = weather.icon;
    feelsLike.textContent = getUnit(weather.feelsLike);
    humidity.textContent = weather.humidity;
    visibility.textContent = weather.visibility;
    windSpeed.textContent = weather.windSpeed;

    const dayItem = document.getElementsByClassName("day-item");
    for (let i = 0; i < dayItem.length; i++) {
      const dayName = dayItem[i].childNodes[1];
      const dailyMax = dayItem[i].childNodes[3];
      const dailyMin = dayItem[i].childNodes[5];
      const dailyIcon = dayItem[i].childNodes[7];

      dayName.textContent = getCurrentDay(i);
      dailyMax.textContent = getUnit(weather.dailyMax[i]);
      dailyMin.textContent = getUnit(weather.dailyMin[i]);
      dailyIcon.src = weather.dailyIcon[i];
    }

    for (let i = 0; i < 24; i++) {
      const divItem = document.createElement("div");
      const hourName = document.createElement("p");
      const hourlyTemp = document.createElement("p");
      const hourlyIcon = document.createElement("img");

      divItem.classList.add("div-item", "hour-item");
      hourName.classList.add("hour-name");
      hourlyTemp.classList.add("hourly-temp");
      hourlyIcon.classList.add("hourly-icon");

      hourName.textContent = getCurrentHour(i);
      hourlyTemp.textContent = getUnit(weather.hourlyTemp[i]);
      hourlyIcon.src = weather.hourlyIcon[i];

      divItem.appendChild(hourName);
      divItem.appendChild(hourlyTemp);
      divItem.appendChild(hourlyIcon);
      hour.appendChild(divItem);
    }
  } catch (err) {
    console.log(err);
  }
}

function toCelsius(temp) {
  return String(Math.round((temp - 273.15) * 10) / 10) + " °C";
}

function toFahrenheit(temp) {
  return String(Math.round((1.8 * (temp - 273.15) + 32) * 10) / 10) + " °F";
}

function addZero(str) {
  if (str.length == 1) {
    return `0${str}`;
  } else {
    return str;
  }
}

function checkUnit() {
  const lol = document.getElementById("lol");
  if (lol.checked) return toFahrenheit;
  else return toCelsius;
}

function changeDayHour() {
  const lolol = document.getElementById("lolol");
  const day = document.getElementsByClassName("day")[0];
  const hour = document.getElementsByClassName("hour")[0];
  if (lolol.checked) {
    day.style.display = "none";
    hour.style.display = "flex";
  } else {
    day.style.display = "flex";
    hour.style.display = "none";
  }
}

function getCurrentDay(num) {
  today = new Date().getDay();
  if (today + num >= 7) today -= 7;
  return days[today + num];
}

function getCurrentHour(num) {
  hourNow = new Date().getHours() + num;
  if (hourNow >= 24) hourNow -= 24;
  return `${addZero(String(hourNow))}:00`;
}
