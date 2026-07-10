# What is MainTab

**MainTab** is my own New Tab page made for Stardance. It's built using HTML, CSS and JavaScript using some APIs listed down this page. 
I decided to build it like this because it has everything I would want from a New Tab page.

<video src="img/mainTabShowcase.mp4" controls width="100%"></video>

---

## MainTab features:
- **News Feed**: Get the *Top Stories* from "HackerNews" right on your page, for easy access
- **Weather Forecast**: Get current weather conditions and a *7-day forecast*!
- **GitHub Profile Stats**: A little widget that shows your *total contributions* on GitHub and your *current* and *longest* Streak!
- **Search**: ... Well ... Obviously, it lets you search anything on the Web using DuckDuckGo.
- **Daily Background**: Get a *different background* every day!
- **Bookmarks**: Save your *most used websites* for easy access!

---

If you want to know all the APIs used here they are:

- [Open Meteo](https://open-meteo.com): Get weather data using Latitude and Longitude.
- [BigDataCloud Reverse Geocoding](https://www.bigdatacloud.com/reverse-geocoding): Get a precise location using Latitude and Longitude.
- [Google Favicon API](https://dev.to/derlin/get-favicons-from-any-website-using-a-hidden-google-api-3p1e): This API lets you get the Icon of a website. I couldn't find any official documentation, so here is the guide I used.
- [Hacker News API](https://github.com/HackerNews/API): To get news from the HackerNews Feed.
- [Quoteslate API](https://quoteslate.vercel.app/): Get a random quote.
- [Bing Wallpaper API](https://github.com/TimothyYe/bing-wallpaper): API that lets you get a daily background from the Bing.com
- [GitHub Readme Streak Stats](https://github.com/DenverCoder1/github-readme-streak-stats): Generate the profile stats card for GitHub

Also, data like GitHub username and bookmarks are all saved into `localStorage` so nothing is lost on refresh!!

## To Run Locally:

1. Clone the Repo:
    ```
        git clone https://github.com/n0kira/MainTab
    ```
2. Open the website:
    From your file manager find the folder named `MainTab`, open it and run `index.html`
