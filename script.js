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
        var forecastAPI = ""

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
            // put results in appropriate fields in weather box

            $("#city-name").text(cityName + "  (" + moment().format('L') + ")");
            $("#temperature").text("Temperature: " + temperature + "°F")
            $("#humidity").text("Humidity: " + humidity + "%")
            $("#wind-speed").text("WInd speed: " + windspeed + " MPH")
            previousEntries.push(cityName);
            console.log(previousEntries)

            var UVIURL = "http://api.openweathermap.org/data/2.5/uvi?appid=" + APIKey + "&lat=" + lattitude + "&lon=" + longitude;
            $.ajax({
                url: UVIURL,
                method: 'GET'
            })
        .then(function(response) {
            UVIndex = response.value;
            $("#uv-index").text("UV index: " + UVIndex);
            // create forecast information
            var forecastURL = "http://api.openweathermap.org/data/2.5/forecast?units=imperial&q=" + cityName + "&appid=" + APIKey;
            console.log(forecastURL);
            $.ajax({
                url: forecastURL,
                method: 'GET'
            })
        .then(function(response) {
            forecastAPI = response;
            console.log(forecastAPI);
            $("#forecast-text").attr("class", "")

        for (i = 1; i < 6; i++) {
            var forecastBlocks = $("#forecast-blocks");
            var forecastEntry = $("<div class ='col forecast-box'>")
            var forecastDate = moment(moment().add('days', i)).format("MM/DD/YYYY");
            forecastEntry.append("<h5>" + forecastDate + "</h5>");
            var forecastWeatherIcon = forecastAPI.list[i].weather[0].main;
            ;
            forecastEntry.append("<p>" + forecastWeatherIcon + "</p>");
            var forecastTemp = forecastAPI.list[i].main.temp;
            forecastTemp = Math.floor(forecastTemp);
            forecastEntry.append("<p>Temperature: " + forecastTemp + "</p>");
            var forecastHumidity = forecastAPI.list[i].main.humidity;
            forecastEntry.append("<p>Humidity: " + forecastHumidity + "</p>")
            forecastBlocks.append(forecastEntry)


        }
    })
 })


    // iterate through forecast 5 times

// push search into previous search array
// iterate through previous searchest and place in previous search column
})
})

// http://api.openweathermap.org/data/2.5/uvi?appid={appid}&lat={lat}&lon={lon}