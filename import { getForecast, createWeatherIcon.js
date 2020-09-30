import { getForecast, createWeatherIcon } from './weather.service.js'
import { getGeolocation } from './map.service.js'

// main()

// This is a demo of how to use the two API services.
// You should replace this with your own application logic.
const location = 'Algonquin College, Nepean, ON, CA'
const App = {
    data: [],
    init: async () => {
        await App.getGeolocation()
        App.displayNow()
    },
    getGeolocation: async () => {
        try {
            const coord = await getGeolocation(location)
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
        const current = App.data.current
        let weatherIcon = document.createElement('img')
        weatherIcon.src = `https://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png`
        console.log(weatherIcon)
        root.appendChild(weatherIcon)

    }

}

async function main() {

    try {
        const coord = await getGeolocation(location)
        const forecast = await getForecast({ coord })
        console.log(forecast)

    } catch (error) {
        console.log(error.message)
    }
    displayNow(forecast)
    const displayNow = (forecast) => {
        const current = forecast.current
        let weatherIcon = document.createElement('img')
        weatherIcon.src = `https://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png`
        console.log(weatherIcon);
    }
    const displayNext6Day = (forecast) => {

    }
}


document.addEventListener('DOMContentLoaded', App.init())