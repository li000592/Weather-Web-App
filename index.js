import { getForecast, createWeatherIcon } from './weather.service.js'
import { getGeolocation } from './map.service.js'

const location = 'Algonquin College, Nepean, ON, CA'
// This is a demo of how to use the two API services.
// You should replace this with your own application logic.

const App = {
    currentLocation: 'Algonquin College, Nepean, ON, CA',
    location: null,
    data: [],
    getLocation: () => {
        var x = document.getElementById("demo");
        function getLocation() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(showPosition);
            } else {
                x.innerHTML = "Geolocation is not supported by this browser.";
            }
        }

        function showPosition(position) {
            x.innerHTML = "Latitude: " + position.coords.latitude +
                "<br>Longitude: " + position.coords.longitude;
        }
    },
    init: async () => {
        let main = document.getElementById('main')
        let template = document.getElementById('hourlyForecast');
        let form = template.content.cloneNode(true);
        main.appendChild(form);

        console.log(App.getLocation());
        await App.getGeolocation()
        App.displayNow()
    },
    getGeolocation: async () => {
        try {
            const coord = await getGeolocation(location)
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
    displayNow: (forecast) => {
        let root = document.getElementById('root')
        let weatherIcon = document.getElementById('weatherIcon')
        const current = App.data.current
        console.log(weatherIcon);
        weatherIcon.src = `https://openweathermap.org/img/wn/${current.weather[0].icon}@4x.png`

        // let weatherIcon = document.createElement('img')
        // weatherIcon.src = `https://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png`
        // console.log(weatherIcon)
        // root.appendChild(weatherIcon)

    }
}

document.addEventListener('DOMContentLoaded', App.init())

let template = document.getElementById('itemFormTemplate');
console.log(template)
let form = template.content.cloneNode(true);
main.appendChild(form);