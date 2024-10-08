
const apiKey = 'f71b3360cbf3491aa68175027242609';

async function fetchWeather() 
{    
    const city = document.getElementById('cityInput').value.trim();

    if (!city) 
        {
        alert('Please enter a city name.');
        return;
    }
    const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=1&aqi=no&alerts=no`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.error) {
            document.getElementById('weather').innerHTML = `<p>${data.error.message}</p>`;
            return;
        }

        const forecast = data.forecast.forecastday[0].hour;

        function getForecastByHour(hour) {
            return forecast.find(f => new Date(f.time).getHours() === hour);
        }

        const times = [
            { label: '9 AM', hour: 9 },
            { label: '12 PM', hour: 12 },
            { label: '5 PM', hour: 17 },
            { label: '9 PM', hour: 21 }
        ];

        let weatherHtml = `<h2>Weather forecast for ${data.location.name}, ${data.location.country}</h2>`;
        weatherHtml += `<div class="weather-row">`; 
        times.forEach(time => {
            const forecastForHour = getForecastByHour(time.hour);
            if (forecastForHour) {
                weatherHtml += `
                    <div class="weather-box">
                        <h3>${time.label}</h3>
                        <p>Time: ${forecastForHour.time}</p>
                        <p>Temperature: ${forecastForHour.temp_c} °C</p>
                        <p>Weather: ${forecastForHour.condition.text}</p>
                        <img src="${forecastForHour.condition.icon}" >
                    </div>
                `;
            }
        });
        weatherHtml += `</div>`; 

        document.getElementById('weather').innerHTML = weatherHtml;

        const weatherCondition = getForecastByHour(9)?.condition.text.toLowerCase();
        if (weatherCondition) {
            if (weatherCondition.includes('rain')) {
                document.body.style.backgroundImage = "url('https://t3.ftcdn.net/jpg/00/96/81/08/360_F_96810852_GF3IUBZDvfSqETwbsfY8OcCR1mOC4YIB.jpg')";
            } else if (weatherCondition.includes('clear') || weatherCondition.includes('sunny')) {
                document.body.style.backgroundImage = "url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTi6Y5vmLJ_nVK8BirsKfMDuLBNxF8Tnqy_wA&s')";
            } else if (weatherCondition.includes('cloud')) {
                document.body.style.backgroundImage = "url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvqlsG_pjK9bCW20D1Fb_OMInrTkiVrlaNHw&s')";
            } else if (weatherCondition.includes('snow')) {
                document.body.style.backgroundImage = "url('https://thumbs.dreamstime.com/b/snowy-background-illustration-scene-62743966.jpg')";
            } else {
                document.body.style.backgroundImage = "url('https://png.pngtree.com/thumb_back/fh260/background/20201012/pngtree-white-cloud-on-blue-sky-weather-background-image_410050.jpg')";
            }
        }

    } catch (error) {
        console.error('Error fetching weather data:', error);
        document.getElementById('weather').innerHTML = '<p>Failed to load weather data.</p>';
    }
}
