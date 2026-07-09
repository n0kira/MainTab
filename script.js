// HackerNews Top Stories Fetch
const newsFeed = document.querySelector('#newsFeed');

fetch('https://hacker-news.firebaseio.com/v0/topstories.json')
    .then(response => response.json())
    .then(storyIds => {
        const topIds = storyIds.slice(0, 20);

        return Promise.all(
            topIds.map(id => 
                fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
                    .then(response => response.json())
            )
        );
    })
    .then(stories => {
        stories.forEach(story => {
            console.log(story);
            console.log(`${story.title} - ${story.url}`);
            const storyDiv = document.createElement('div');
            newsFeed.appendChild(storyDiv);

            const storyTitle = storyDiv.appendChild(document.createElement('p'));
            const storyAuthor = storyDiv.appendChild(document.createElement('p'));
            const storyUrl = storyDiv.appendChild(document.createElement('a'));

            storyTitle.classList.add("storyTitle");
            storyAuthor.classList.add("storyAuthor");

            storyTitle.innerHTML = story.title;
            storyAuthor.innerHTML = "By @" + story.by;
            storyUrl.innerHTML = "Full Story Here";
            storyUrl.href = story.url;
        });
    });

// Random Quote Fetch
const quoteSpace = document.querySelector('#quote');

fetch('https://quoteslate.vercel.app/api/quotes/random')
    .then(response => response.json())
    .then(data => {
        const quote = data.quote;
        const author = data.author;

        const quoteText = quoteSpace.appendChild(document.createElement('p'));
        const quoteAuthor = quoteSpace.appendChild(document.createElement('p'));

        quoteText.classList.add("quoteText");
        quoteAuthor.classList.add("quoteAuthor");

        quoteText.innerHTML = quote;
        quoteAuthor.innerHTML = "~ "+author;
        console.log(`${quote} - ${author}`);
    });

// Weather API

const currentForecast = document.querySelector('#currentForecast');
const weeklyForecast = document.querySelector('#weeklyForecast');

if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            console.log(`Lat: ${lat} - Lon: ${lon}`);

            fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code`)
                .then(response => response.json())
                .then(data => {

                    const temp = data.current.temperature_2m;
                    const code = data.current.weather_code;
                    const weather = translateCode(code);
                    
                    const weatherText = currentForecast.appendChild(document.createElement('p'));
                    weatherText.innerHTML = `Temp: ${temp} - Weather: ${weather}`;
                    console.log(`Temp: ${temp} - Code: ${code} - Weather: ${weather}`);
                });

            fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto`)
                .then(response => response.json())
                .then(data => {

                    const dates = data.daily.time;
                    const maxTemps = data.daily.temperature_2m_max;
                    const minTemps = data.daily.temperature_2m_min;
                    const codes = data.daily.weather_code;

                    for (let i = 0; i < 7; i++) {
                        const date = dates[i];
                        const maxTemp = maxTemps[i];
                        const minTemp = minTemps[i];
                        const code = codes[i];

                        const weather = translateCode(code);
                        const weatherText = weeklyForecast.appendChild(document.createElement('p'));

                        weatherText.innerHTML = `Date: ${date} | High: ${maxTemp}°C | Low: ${minTemp}°C | Condition: ${weather}`;

                        console.log(`Date: ${date} | High: ${maxTemp}°C | Low: ${minTemp}°C | Condition: ${weather}`);
                    };
                });
        },
        (error) => {
            console.log("Cannot access user location");
        }
    )
}

function translateCode(code) {
    let weather = "Unknown";

    if (code == 0) weather="Sunny";
    if (code >= 1 && code <= 3) weather="Partly Cloudy";
    if (code >= 45 && code <= 48) weather="Foggy";
    if (code >= 51 && code <= 67) weather="Rainy";
    if (code >= 71 && code <= 77) weather="Snowy";
    if (code >= 80 && code <= 82) weather="Rain Showers";
    if (code >= 95 && code <= 99) weather="Thunderstorm";

    return weather;
}
