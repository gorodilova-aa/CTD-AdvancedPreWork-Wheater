// define elements
const container = document.getElementById('container');
const btnCurrent = document.getElementById('btn-current');
const btnForecast = document.getElementById('btn-forecast');

// Coordinates for cities
const CARY = { name: "Cary, USA", lat: 35.79, lon: -78.78 };
const NSK = { name: "Novosibirsk, RU", lat: 55.04, lon: 82.93 };


// weather icons
function getWeatherIcon(code) {
    // Коды WMO: https://open-meteo.com/en/docs
    if (code === 0) return '☀️';              // Clear sky
    if (code >= 1 && code <= 3) return '🌤️';  // Partly cloudy
    if (code >= 45 && code <= 48) return '🌫️'; // Fog
    if (code >= 51 && code <= 67) return '🌧️'; // Rain/Drizzle
    if (code >= 71 && code <= 77) return '❄️'; // Snow
    if (code >= 80 && code <= 82) return '🌦️'; // Rain showers
    if (code >= 95) return '⛈️';               // Thunderstorm
    return '☁️';                               // Default
}


// current weather
async function loadCurrentWeather() {
    container.innerHTML = "<p>Loading current weather...</p>";
    
    const urlCary = `https://api.open-meteo.com/v1/forecast?latitude=${CARY.lat}&longitude=${CARY.lon}&current_weather=true`;
    const urlNSK = `https://api.open-meteo.com/v1/forecast?latitude=${NSK.lat}&longitude=${NSK.lon}&current_weather=true`;

    try {
        // Fetching both at the same time
        const [resCary, resNSK] = await Promise.all([
            fetch(urlCary),
            fetch(urlNSK)
        ]);

        const dataCary = await resCary.json();
        const dataNSK = await resNSK.json();

        // Printing current weather for both cities
        container.innerHTML = `
            <div class="card">
                <h3>${CARY.name}</h3>
                <p style="font-size: 24px;">${getWeatherIcon(dataCary.current_weather.weathercode)}
                ${Math.round(dataCary.current_weather.temperature)}°C</p>    
            </div>
            <div class="card">
                <h3>${NSK.name}</h3>
                <p style="font-size: 24px;">${getWeatherIcon(dataNSK.current_weather.weathercode)}
                ${Math.round(dataNSK.current_weather.temperature)}°C</p>   
            </div>             
        `;
    } catch (error) {
        container.innerHTML = "<p style='color:red;'>Error loading data. Please try again.</p>";
        console.error("Fetch error:", error);
    }
}
btnCurrent.addEventListener('click', loadCurrentWeather);


// 7-day forecast
async function loadForecast() {
    container.innerHTML = "<p>Loading 7-day forecast...</p>";
    
    // links to daily max and min temperature for 7-day
    const urlCary = `https://api.open-meteo.com/v1/forecast?latitude=${CARY.lat}&longitude=${CARY.lon}&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto`;
    const urlNSK = `https://api.open-meteo.com/v1/forecast?latitude=${NSK.lat}&longitude=${NSK.lon}&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto`;

    try {
        const [resCary, resNSK] = await Promise.all([
            fetch(urlCary),
            fetch(urlNSK)
        ]);

        const dataCary = await resCary.json();
        const dataNSK = await resNSK.json();

        // additional function for printing 7 days
        const createForecastHTML = (data) => {
            let html = '<div class="forecast-list">';
            // Loop for 7 days
            for (let i = 0; i < 7; i++) {
                html += `
                    <div class="forecast-day">
                        <span>${data.daily.time[i].slice(5)}:</span> 
                        <span>${getWeatherIcon(data.daily.weathercode[i])}</span>
                        <span class="temp">${Math.round(data.daily.temperature_2m_max[i])}°</span>
                        <span class="temp">${Math.round(data.daily.temperature_2m_min[i])}°</span>
                    </div>`;
            }
            html += '</div>';
            return html;
        };

        container.innerHTML = `
            <div class="card">
                <h3>${CARY.name}</h3>
                ${createForecastHTML(dataCary)}
            </div>
            <div class="card">
                <h3>${NSK.name}</h3>
                ${createForecastHTML(dataNSK)}
            </div>
        `;
    } catch (error) {
        container.innerHTML = "<p style='color:red;'>Error loading forecast.</p>";
        console.error(error);
    }
}
btnForecast.addEventListener('click', loadForecast);



