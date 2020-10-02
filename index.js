import { getForecast, createWeatherIcon } from './weather.service.js'
import { getGeolocation } from './map.service.js'


const location = 'Algonquin College, Nepean, ON, CA'

const App = {
    currentCity: 'Toronto',
    searchInput: 'Toronto',
    currentCoordinate: {
        lat: '45.42',
        lon: '-75.69'
    },
    data: {},
    init: async () => {
        let main = document.getElementById('main')
        let template = document.getElementById('currentForecast')
        let form = template.content.cloneNode(true)
        main.appendChild(form)
        App.EventListener()
        App.currentRender()
        if (!localStorage.getItem('weather-data')) await App.getGeolocation()



        // if LocalStorage has data Run it 
        // else getData

        // if (localStorage.getItem('123')) {
        //     App.data = localStorage.getItem('weather')
        // } else {
        //     console.log('RUNNING ELSE')

        // }
        if (!localStorage.getItem('currentCity')) {
            await App.getCity()
        }



        // console.log(App.currentCity)
        await App.dailyRender()
        // console.log(App.data)

    },
    clickSearch: async () => {
        console.log("CLICKED")
        let searchValue = document.getElementById('search').value
        console.log(searchValue)
        App.searchInput = searchValue
        await App.getGeolocation()
        App.currentRender()
        searchValue = ''
        // App.currentRender()
    },
    clickLocation: async () => {
        console.log('LOCATION');
        await App.getCurrentLocation()
        App.currentRender()

    },
    EventListener: () => {
        // search click & enter/return
        const searchBTN = document.getElementById('search-btn')
        console.log(searchBTN)
        searchBTN.addEventListener('click', App.clickSearch)
        document.querySelector('body').addEventListener('keypress', en => {
            if (en.key === 'Enter') {
                App.clickSearch()
            }
        })

        // Hourly 
        document.getElementById('hourly-btn').addEventListener('click', App.hourlyRender)
        // Daily
        document.getElementById('daily-btn').addEventListener('click', App.dailyRender)
        // get location
        document.getElementById('location-btn').addEventListener('click', App.clickLocation)
    },
    currentRender: () => {
        let root = document.getElementById('root')

        let weatherIcon = document.getElementById('weatherIcon')
        const data = JSON.parse(localStorage.getItem('weather-data'))

        //weather icon
        // weatherIcon.src = `https://openweathermap.org/img/wn/${current.weather[0].icon}@4x.png`
        let createImg = createWeatherIcon(data.current.weather[0].icon)
        weatherIcon.innerHTML = ''
        weatherIcon.appendChild(createImg)


        // place name
        let currentPlace = document.getElementById('currentPlace')
        console.log(currentPlace)
        currentPlace.textContent = App.currentCity
        // weather name
        let weather = document.getElementById('weather')
        weather.textContent = data.current.weather[0].main
        // teamp
        let currentTemp = document.getElementById('currentTemp')
        currentTemp.textContent = parseInt(data.current.temp) + '°C'

        // App.getCity()

    },
    hourlyRender: () => {
        let hourlyOrDaily = document.getElementById('hourlyOrDaily')
        hourlyOrDaily.innerHTML = ''
        let template = document.getElementById('hourlyForecast')
        let form = template.content.cloneNode(true)
        hourlyOrDaily.appendChild(form)

        let data = JSON.parse(localStorage.getItem('weather-data'))
        console.log(data)


        let hourlyColumns = document.getElementById('hourlyColumns')
        console.log(hourlyColumns)
        for (let i = 0; i < 6; i++) {
            const dt = new Date(data.hourly[i].dt * 1000).getHours()
            let newdt
            if (dt > 12) newdt = dt + 'am'

            else newdt = dt + 'pm'


            let div = document.createElement('div')
            div.className = 'column has-text-centered'
            let time = document.createElement('p')
            time.textContent = newdt
            div.appendChild(time)
            hourlyColumns.appendChild(div)

            let temp = document.createElement('div')
            temp.className = 'temp'
            temp.textContent = parseInt(data.hourly[i].temp) + '°C'
            console.log(temp.textContent)
            div.appendChild(temp)

            let icon = createWeatherIcon(data.hourly[i].weather[0].icon)
            div.appendChild(icon)
        }


        // let weatherIcon = document.createElement('img')
        // weatherIcon.src = `https://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png`
        // console.log(weatherIcon)
        // root.appendChild(weatherIcon)

    },
    dailyRender: (forecast) => {
        let hourlyOrDaily = document.getElementById('hourlyOrDaily')
        hourlyOrDaily.innerHTML = ''

        let template = document.getElementById('dailyForecast')
        let form = template.content.cloneNode(true)
        hourlyOrDaily.appendChild(form)

        let data = JSON.parse(localStorage.getItem('weather-data'))
        console.log(data)


        let hourlyColumns = document.getElementById('dailyColumns')
        for (let i = 1; i < 6; i++) {
            const dt = new Date(data.daily[i].dt * 1000).getDay()
            // console.log(dt)
            let newdt
            if (dt == 0) newdt = 'Sun'
            else if (dt == 1) newdt = 'Mon'
            else if (dt == 2) newdt = 'Tue'
            else if (dt == 3) newdt = 'Sun'
            else if (dt == 4) newdt = 'Wed'
            else if (dt == 5) newdt = 'Fri'
            else if (dt == 6) newdt = 'Sat'
            else newdt = 'NaN'

            console.log(newdt)


            let div = document.createElement('div')
            div.className = 'column has-text-centered'
            let time = document.createElement('p')
            time.textContent = newdt
            div.appendChild(time)
            hourlyColumns.appendChild(div)

            let temp = document.createElement('div')
            temp.className = 'temp'
            temp.textContent = parseInt(data.hourly[i].temp) + '°C'
            // console.log(temp.textContent)
            div.appendChild(temp)

            let icon = createWeatherIcon(data.hourly[i].weather[0].icon)
            div.appendChild(icon)
        }

    },
    getGeolocation: async () => {
        try {
            console.log(App.searchInput)
            const coord = await getGeolocation(App.searchInput)
            const forecast = await getForecast({ coord })
            console.log(coord.lat);
            App.currentCoordinate.lat = coord.lat
            App.currentCoordinate.lon = coord.lon
            await App.getCity()
            console.log(forecast)
            localStorage.setItem('weather-data', JSON.stringify(forecast))
            console.log(JSON.parse(localStorage.getItem('weather-data')))
        } catch (error) {
            console.log(error.message)
        }
    },
    getCity: async () => {
        let link = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${App.currentCoordinate.lat},${App.currentCoordinate.lon}&key=AIzaSyBGj0jkgUzBeGRw15c_M9v_t68eEqzBFmE`
        const response = await fetch(link)
        const myJson = await response.json()
        console.log(myJson)
        App.currentCity = myJson.results[0].address_components[3].long_name
        console.log(App.currentCity)
        localStorage.setItem('currentCity', myJson.results[0].address_components[3].long_name)
    },
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
            App.currentCoordinate.lat = crd.latitude
            App.currentCoordinate.lon = crd.longitude
        }

        function error(err) {
            console.warn(`ERROR(${err.code}): ${err.message}`);
        }

        navigator.geolocation.getCurrentPosition(success, error, options);
    },
}

document.addEventListener('DOMContentLoaded', App.init())