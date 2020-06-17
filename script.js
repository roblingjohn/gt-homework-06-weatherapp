// Set variables 
    // search entry
    var searchEntry = $("#search-bar").val();
    // ajax results
        // city name
        var cityName = ""
        // temperature
        var temperature = 0
        // humidity
        var humidity = 0
        // wind speed
        var windspeed = 0
        // UV index
        var UVIndex = 0

        var previousEntries = []

    // weather box
    // forecast box

// set event from search bar
$("#search-button").on("click", function() {
    event.preventDefault();
    // get search results from search bar
    var searchEntry = $("#search-bar").val();
    // get ajax data from search result
    var APIKey = "83cea6cbcabbb7bef1222d329e94e37c"
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + searchEntry 
    + "&units=imperial&appid=" +
    APIKey;
    $.ajax({
        url: queryURL,
        method: 'GET'
      }).then(function(response) {
            var results = response;
            cityName = results.name;
            temperature = Math.floor(results.main.temp);
            humidity = results.main.humidity;
            windspeed = results.wind.speed;
            windspeed = windspeed.toFixed(1);
            longitude = results.coord.lon;
            lattitude = results.coord.lat;
            $("#city-name").text(cityName + "  (" + moment().add(10, 'days').calendar() + ")");
            $("#temperature").text("Temperature: " + temperature + "°F")
            $("#humidity").text("Humidity: " + humidity + "%")
            $("#wind-speed").text("WInd speed: " + windspeed + " MPH")
            previousEntries.push(cityName);
            var UVIURL = "http://api.openweathermap.org/data/2.5/uvi?appid=" + APIKey + "&lat=" + lattitude + "&lon=" + longitude;
            $.ajax({
                url: UVIURL,
                method: 'GET'
            })
        .then(function(response) {
            UVIndex = response.value;
            $("#uv-index").text("UV index: " + UVIndex)
        })

// put results in appropriate fields in weather box

// create forecast information
    // iterate through forecast 5 times

// push search into previous search array
// iterate through previous searchest and place in previous search column
})
})

// http://api.openweathermap.org/data/2.5/uvi?appid={appid}&lat={lat}&lon={lon}