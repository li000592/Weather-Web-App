import { getForecast, createWeatherIcon } from './weather.service.js'
import { getGeolocation } from './map.service.js'

const location = 'Algonquin College, Nepean, ON, CA'
// This is a demo of how to use the two API services.
// You should replace this with your own application logic.

const App = {
    currentLocation: 'Algonquin College, Nepean, ON, CA',
    currentPlace: 'Nepean',
    location: null,
    data: {},
    getCurrentLocation: () => {
        var options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        };

        function success(pos) {
            var crd = pos.coords;

            console.log('Your current position is:');
            console.log(`Latitude : ${crd.latitude}`);
            console.log(`Longitude: ${crd.longitude}`);
            console.log(`More or less ${crd.accuracy} meters.`);
        }

        function error(err) {
            console.warn(`ERROR(${err.code}): ${err.message}`);
        }

        navigator.geolocation.getCurrentPosition(success, error, options);
    },
    init: async () => {
        let main = document.getElementById('main')
        let template = document.getElementById('hourlyForecast');
        let form = template.content.cloneNode(true);
        main.appendChild(form);

        console.log(App.getCurrentLocation());
        await App.getGeolocation()
        App.displayHourly()
        console.log(App.data);
    },
    EventListener: () => {
        // search click & enter/return
        // Hourly 
        // Daily
        // get location
    },
    getGeolocation: async () => {
        try {
            const coord = await getGeolocation(App.currentLocation)
            console.log(coord);
            const forecast = await getForecast({ coord })
            console.log(forecast)
            App.data = forecast



            localStorage.setItem('weather', App.data)
            console.log(localStorage.getItem('weather'))
        } catch (error) {
            console.log(error.message)
        }
    },
    displayHourly: (forecast) => {
        let root = document.getElementById('root')
        let weatherIcon = document.getElementById('weatherIcon')
        const current = App.data.current

        //weather icon
        // weatherIcon.src = `https://openweathermap.org/img/wn/${current.weather[0].icon}@4x.png`
        let createImg = createWeatherIcon(current.weather[0].icon)
        weatherIcon.appendChild(createImg)

        // place name
        let currentPlace = document.getElementById('currentPlace')
        console.log(currentPlace);
        currentPlace.textContent = App.currentPlace
        // weather name
        let weather = document.getElementById('weather')
        weather.textContent = current.weather[0].main
        // teamp
        let currentTemp = document.getElementById('currentTemp')
        currentTemp.textContent = parseInt(current.temp) + '°C'



        // let weatherIcon = document.createElement('img')
        // weatherIcon.src = `https://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png`
        // console.log(weatherIcon)
        // root.appendChild(weatherIcon)

    },
    displayDaily: (forecast) => {

    },
}

document.addEventListener('DOMContentLoaded', App.init())