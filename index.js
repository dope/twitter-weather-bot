require(`dotenv`).config();

const fetch = require(`node-fetch`);
const twitter = require(`twitter`);

// Twitter
const client = new twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

// Weather
const API_KEY = process.env.WEATHER_API_KEY;
const LOCATION = process.env.WEATHER_LOCATION;
const url = `http://api.openweathermap.org/data/2.5/weather?q=${LOCATION}&APPID=${API_KEY}&units=metric`;

fetch(url)
  .then(function(response) {
    return response.json();
  })
  .then(function(weather) {
    const label = weather.weather[0].description;

    function icon() {
      if (label.includes(`clouds`)) return `☁`;
      if (label.includes(`clear`)) return `☀️`;
      if (label.includes(`rain`)) return `🌧`;
      if (label.includes(`thunderstorm`)) return `⛈`;
      if (label.includes(`snow`)) return `❄️`;
      return `Update:`;
    }

    function time() {
      const time = new Date();
      if (time.getHours() === 7) {
        return `7am`;
      } else {
        return `6pm`;
      }
    }

    const output = `${icon()}  It's ${time()} in ${LOCATION} the temperature is ${Math.round(
      weather.main.temp
    )}°C with a high of ${Math.round(weather.main.temp_max)}°C and a low of ${Math.round(
      weather.main.temp_min
    )}°C.`;

    console.log(output);

    const params = { screen_name: "nodejs" };
    client.post("statuses/update", { status: output }, function (error, tweet, response) {
      if (!error) {
        console.log(tweet);
      }
    });
  });
