// Check User's preferences
const weatherPref = document.getElementById('showWeather');
const newsPref = document.getElementById('showNews');
const streakPref = document.getElementById('showStreak');
const quotePref = document.getElementById('showQuote');
const streakImg = document.getElementById('githubProfileImg');

let buttons = [weatherPref, newsPref, streakPref, quotePref];
let preferences = JSON.parse(localStorage.getItem("preferences")) || ["true","true","true","true"];

function checkPref() {
    const newsFeed = document.getElementById('newsFeed');
    const quoteSpace = document.getElementById('quote');
    const weatherFeed = document.getElementById('weatherFeed');
    const githubProfile = document.getElementById('githubProfile');

    weatherPref.checked = (preferences[0] == "true");
    newsPref.checked = (preferences[1] == "true");
    streakPref.checked = (preferences[2] == "true");
    quotePref.checked = (preferences[3] == "true");

    if (preferences[0] == "true") {
        weatherFeed.style.visibility = "visible";
        if (document.getElementById("currentForecast").children.length == 0) {
            fetchWeather();
        }
    } else {
        weatherFeed.style.visibility = "hidden";
    }

    if (preferences[1] == "true") {
        newsFeed.style.visibility = "visible";
        if (newsFeed.children.length == 0) {
            fetchNews();
        }
    } else {
        newsFeed.style.visibility = "hidden";
    }

    if (preferences[2] == "true") {
        githubProfile.style.visibility = "visible";
        if (!streakImg.getAttribute("src")) {
            githubStreak();
        }
    } else {
        githubProfile.style.visibility = "hidden";
    }

    if (preferences[3] == "true") {
        quoteSpace.style.visibility = "visible";
        if (quoteSpace.children.length == 0) {
            fetchQuote();
        }
    } else {
        quoteSpace.style.visibility = "hidden";
    }
}

function updatePref() {
    
    preferences[0] = weatherPref.checked.toString();
    preferences[1] = newsPref.checked.toString();
    preferences[2] = streakPref.checked.toString();
    preferences[3] = quotePref.checked.toString();

    checkPref();

    localStorage.setItem("preferences", JSON.stringify(preferences));
}

buttons.forEach(button => {
    button.addEventListener("change", () => {
        updatePref();
    });
});

checkPref();

// HackerNews Top Stories Fetch
const newsFeed = document.querySelector('#newsFeed');

function fetchNews() {
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
}
// Random Quote Fetch
const quoteSpace = document.querySelector('#quote');

function fetchQuote() {
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
    });
}

// Weather API

const weatherFeed = document.getElementById('weatherFeed');
const currentForecast = document.querySelector('#currentForecast');
const weeklyForecast = document.querySelector('#weeklyForecast');

function fetchWeather() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                weatherFeed.style.visibility = "hidden";

                fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code`)
                    .then(response => response.json())
                    .then(data => {

                        const temp = data.current.temperature_2m;
                        const code = data.current.weather_code;
                        const weather = translateCode(code);
                        
                        const weatherText = currentForecast.appendChild(document.createElement('div'));
                        weatherText.classList.add("currentWeatherDiv");

                        const conditionImg = weatherText.appendChild(document.createElement('img'));
                        conditionImg.src = `img/icons/${weather}`
                        conditionImg.style.width = "64px";

                        const cityText = weatherText.appendChild(document.createElement('p'));

                        fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}`)
                            .then(response => response.json())
                            .then(data => {
                                cityText.innerHTML = data.city;
                            });
                        weatherFeed.style.visibility = "visible";
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
                            const weatherText = weeklyForecast.appendChild(document.createElement('div'));
                            weatherText.classList.add("weatherDiv");

                            const dateContainer = weatherText.appendChild(document.createElement('div'));

                            const dateText = dateContainer.appendChild(document.createElement('p'));
                            dateText.innerHTML = `${date.split("-")[2]}/${date.split("-")[1]}`;

                            const conditionContainer = weatherText.appendChild(document.createElement('div'));

                            const conditionImg = conditionContainer.appendChild(document.createElement('img'));
                            conditionImg.src = `img/icons/${weather}`
                            conditionImg.style.width = "32px";

                            const tempContainer = weatherText.appendChild(document.createElement('div'));

                            const maxTempText = tempContainer.appendChild(document.createElement('p'));
                            maxTempText.innerHTML = `${maxTemp}°C`

                            const minTempText = tempContainer.appendChild(document.createElement('p'));
                            minTempText.innerHTML = `${minTemp}°C`

                            weatherFeed.style.visibility = "visible";
                        };
                    });
            },
            (error) => {
                console.log("Cannot access user location");
            }
        )
    }
}

function translateCode(code) {

    let iconName = "Icon=Sunny.png";

    if (code === 0) {
        iconName = "Icon=Sunny.png";
    } else if (code >= 1 && code <= 3) {
        iconName = "Icon=Partly Cloudy.png";
    } else if (code >= 45 && code <= 48) {
        iconName = "Icon=Cloudy.png";
    } else if (code >= 51 && code <= 55) {
        iconName = "Icon=Light Drizzle.png";
    } else if (code >= 56 && code <= 57) {
        iconName = "Icon=Sleet.png";
    } else if (code >= 61 && code <= 65) {
        iconName = "Icon=Rainy.png";
    } else if (code >= 66 && code <= 67) {
        iconName = "Icon=Sleet.png";
    } else if (code >= 71 && code <= 75) {
        iconName = "Icon=Snow.png";
    } else if (code >= 77 && code <= 79) {
        iconName = "Icon=Snowfall.png";
    } else if (code >= 80 && code <= 82) {
        iconName = "Icon=Rainy with Sun.png";
    } else if (code >= 85 && code <= 86) {
        iconName = "Icon=Snowfall.png";
    } else if (code === 95) {
        iconName = "Icon=Lightning.png";
    } else if (code >= 96 && code <= 99) {
        iconName = "Icon=Thunderstorm.png";
    }

    return iconName;
}

// Bookmarks
const addBookmark = document.getElementById('addBookmark');
const bookmarksContainer = document.getElementById('bookmarks');

let bookmarkList = JSON.parse(localStorage.getItem(`bookmark`)) || [];

bookmarkList.forEach(link => {
    createBookmark(link);
});

addBookmark.addEventListener("click", () => {
    const bookmarksCount = document.querySelectorAll(`.bookmark`);

    if (bookmarksCount.length <= 4) {
        let link = prompt("Insert bookmark link (without https://): ");

        if (link) {

            createBookmark(link);
            
            bookmarkList.push(link)

            localStorage.setItem(`bookmark`, JSON.stringify(bookmarkList));
        } else {
            alert("Bookmark creation failed. You must insert a link.");
        }
    }
});

function createBookmark (link) {
    const bookmark = bookmarksContainer.appendChild(document.createElement('div'));
    bookmark.classList.add("bookmark");

    const bookmarkText = bookmark.appendChild(document.createElement('a'));
    bookmarkText.href = "https://" + link;

    const bookmarkImg = bookmarkText.appendChild(document.createElement('img'));
    bookmarkImg.src = `https://www.google.com/s2/favicons?sz=64&domain=${link}`;
    bookmarkImg.style.width = "64px";
    bookmarkImg.style.height = "64px";

    const delButton = bookmark.appendChild(document.createElement('img'));
    delButton.altText = "Del";
    delButton.classList.add("delBookmark");
    delButton.src = "img/delete.png";
    delButton.addEventListener("click", () => {
        bookmark.remove();
        bookmarkList.splice(bookmarkList.indexOf(link), 1);

        localStorage.setItem('bookmark', JSON.stringify(bookmarkList));
    });

}

// Fetch daily wallpaper:

fetch("https://bing.biturl.top/")
    .then(response => response.json())
    .then(data => {
        document.getElementById("body").style.backgroundImage = `url(${data.url})`;
    });
    
    
// Custom Github Streak
function githubStreak() {
    let username = localStorage.getItem("username") || undefined;
    if (username) {
        streakImg.src = `https://streak-stats.demolab.com?user=${username}&theme=dark&hide_border=true`
    }
}

streakImg.addEventListener("click", () => {

    username = undefined;

    if (!username) {
        username = prompt("Insert your GitHub username: ");
    }
    
    if (username.trim().length == 0) {
        alert("Username must be at least 1 character long!");
    } else {
        streakImg.src = `https://streak-stats.demolab.com?user=${username}&theme=dark&hide_border=true`
        localStorage.setItem("username", username);
    }
});

// Search... Duh

const input = document.getElementById('searchInput');

input.addEventListener("keypress", (event) => {
    const search = input.value;
    window.location.href = `https://duckduckgo.com/${search}`;
});


// Edit page preferences

const editButton = document.getElementById('editButton');
const prefWindow = document.getElementById('prefWindow');

prefWindow.style.display = "none";

editButton.addEventListener("click", () => {
    if (prefWindow.style.display == "none") {
        prefWindow.style.display = "block";
    } else {
        prefWindow.style.display = "none";
    }
});
