// define elements
const container = document.getElementById('container');
const btnCurrent = document.getElementById('btn-current');

// Coordinates for cities
const CARY = { name: "Cary, USA", lat: 35.79, lon: -78.78 };
const NSK = { name: "Novosibirsk, RU", lat: 55.04, lon: 82.93 };

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
                <p style="font-size: 24px;">${dataCary.current_weather.temperature}°C</p>    
            </div>
            <div class="card">
                <h3>${NSK.name}</h3>
                <p style="font-size: 24px;">${dataNSK.current_weather.temperature}°C</p>   
            </div>
            
        `;
    } catch (error) {
        container.innerHTML = "<p style='color:red;'>Error loading data. Please try again.</p>";
        console.error("Fetch error:", error);
    }
}

btnCurrent.addEventListener('click', loadCurrentWeather);
