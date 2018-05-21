require('dotenv').config();

var fs = require("fs");
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var request = require('request');

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter); 

var operator = process.argv[2];
var userInput = process.argv;
var userInputString = "";

for (var i = 3; i < userInput.length; i++) {
    if (i > 2 && i < userInput.length) {
        userInputString = userInputString + "+" + userInput[i];
    } else {
        userInputString += userInput[i];
    }
}

function spotifySearch(song){
    spotify.search({type: 'track', query: song, popularity: 100, limit: 1}, function(err, data) {
        //Error Status
        if (err) {
          return console.log('Error occurred: ' + err);
        }
        //On success
        for (var i = 0; i < data.tracks.items.length; i++) {
          console.log("Artist: " + data.tracks.items[i].artists[0].name);
          console.log("Track name: " + data.tracks.items[i].name);
          if (data.tracks.items[i].preview_url === null) {
            console.log("Song preview: Preview for this track is not available.")
          } else {
            console.log("Song preview: " + data.tracks.items[i].preview_url);
          }
          console.log("Album: " + data.tracks.items[i].album.name);
        }
        console.log("\n");
    });
}

function twitterStatuses() {
    var params = {screen_name: 'hgd_wd'};
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        //If no error
        if (!error) {
            for (var i = 0; i < tweets.length; i++){
            console.log(tweets[i].text);
            console.log(tweets[i].created_at);
            console.log("\n");
            }
        }
    });
}

function omdbResults(movieName){

    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

    // This line is just to help us debug against the actual URL.
    // console.log(queryUrl);

    request(queryUrl, function(error, response, body) {

    // If the request is successful
        if (!error && response.statusCode === 200) {

            // Parse the body of the site and recover just the imdbRating
            // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
            // console.log(JSON.parse(body));
            var movieResponse = JSON.parse(body);
            if (movieResponse.Title === undefined) {
                console.log("Movie not found in the OMDb database. Try another search.")
            } else {
                console.log("Movie Title: " + movieResponse.Title);
                console.log("Release Date: " + movieResponse.Year);
                console.log("IMDB Rating: " + movieResponse.Ratings[0].Value);
                if (movieResponse.Ratings[1] === undefined) {
                    console.log("Rotten Tomatoes Rating: Not available for this movie title.")
                } else {
                    console.log("Rotten Tomatoes Rating: " + movieResponse.Ratings[1].Value);
                }
                console.log("Country: " + movieResponse.Country);
                console.log("Plot: " + movieResponse.Plot);
                console.log("Actors: " + movieResponse.Actors);
                
            }
            console.log("\n");
        }
    })
}

switch (operator) {
    case "my-tweets":
        console.log("\n");
        console.log("===================================================================================================================");
        console.log("# My Latest 20 Tweets");
        console.log("===================================================================================================================");
        console.log("\n");
        twitterStatuses();
        break;
    case "spotify-this-song":
        console.log("\n");
        console.log("===================================================================================================================");
        console.log("# Spotify Song Info");
        console.log("===================================================================================================================");
        console.log("\n");
        spotifySearch(userInputString.substring(1));
        break;
    case "movie-this":
        console.log("\n");
        console.log("===================================================================================================================");
        console.log("# OMDb Movie Info");
        console.log("===================================================================================================================");
        console.log("\n");
        if ((process.argv[3] === undefined) && (userInput.length <= 3)) {
            omdbResults("Mr.+Nobody");
        } else {
            omdbResults(userInputString.substring(1));
        }
        break;
    case "do-what-it-says":
        // lotto();
        break;
}

function liriError() {
    console.log("///////////////////////////////////////////////////////////////////////////////////////////////////////////////////");
    console.log("/                                                                                                                 /");
    console.log("/    liri.js: Invalid command or argument, or no command was specified                                            /");
    console.log("/                                                                                                                 /");
    console.log("/    Usage: node liri.js <command> [<args>]                                                                       /");
    console.log("/                                                                                                                 /");
    console.log("/    my-tweets [<username>]         Retrieves last 20 tweets from hgd_wd test ('Hong Gildong) twittter account    /");
    console.log("/                                   and displays them.                                                            /");
    console.log("/    spotify-this-song [<song>]     Searches Spotify and returns basic information about specified song.          /");
    console.log("/    movie-this [<movie>]           Searches OMDb and returns basic information about specified movie.            /");
    console.log("/    do-what-it-says                Reads and executes the instructions contained in random.txt.                  /");
    console.log("/                                                                                                                 /");
    console.log("///////////////////////////////////////////////////////////////////////////////////////////////////////////////////");
    console.log("\n");
}

if ((operator === undefined) && (userInput.length <= 2)) {
    liriError();
}
