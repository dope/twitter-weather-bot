require("dotenv").config();

// Imports
const http = require("http");
const fetch = require("node-fetch");
const twitter = require("twitter");
const cron = require("node-cron");


// Node
const hostname = "127.0.0.1";
const port = 3000;

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

const server = http.createServer((req, res) => {
  cron.schedule('0 0 */3 * * *', function () {
    fetch(url)
      .then(function(response) {
        return response.json();
      })
      .then(function(weather) {
        const output = `Currently in Leicester the tempature is ${weather.main.temp} with a high of ${
          weather.main.temp_min
        } and a low of ${weather.main.temp_max}. #${weather.weather[0].main} #Weather`;

        const params = { screen_name: "nodejs" };
        client.post("statuses/update", { status: output }, function(error, tweet, response) {
          if (!error) {
            console.log(tweet);
          }
        });
        res.end(output);
      });
  });
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
