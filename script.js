// Set variables 
    // search entry
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

        // retrieves previous entries and enters empty array if not yet set
        var previousEntries = JSON.parse(localStorage.getItem("cities"));
        if (previousEntries === null) {
            previousEntries = []
            var searchEntry = ""
        }
        else {
            var searchEntry = previousEntries[previousEntries.length - 1];
        }


        var forecastAPI = ""

    // weather box
        var weatherBox = $("#weather-box")
    // forecast box

// write previous entries to left column of screen
function writePrevEntries() {
    // clear any entries already on screen
    $("#searched-cities").empty();
    // iterate through array
    for (i = previousEntries.length - 1; i > previousEntries.length - 9 ; i--){
        // stop loop if there are no values for this iteration
        if (previousEntries[i] === undefined) {
            console.log("No more entries");
        }
        // add buttons with the names of previous entries
        else {
        $("#searched-cities").append("<button class='prev-search' data-city='" + previousEntries[i] + "'>" + previousEntries[i] + "</button>")
        }
    }
    tidyArray();
};

tidyArray();
writePrevEntries();
getCityData();

// limit array to 8 entries and prevent duplicates
function tidyArray() {
    var uniqueArray = [];
        $.each(previousEntries, function(i, el){
        if($.inArray(el, uniqueArray) === -1) uniqueArray.push(el);
    });
    previousEntries = uniqueArray
    if (previousEntries.length > 7) {
        previousEntries.splice(0, 1)
    }
}

// make UV index the relevant color of warning
function UVColor() {
    if (UVIndex < 3) {
        $("#uv-index").attr("class", "uv-green");
    }
    else if (UVIndex > 7) {
        $("#uv-index").attr("class", "uv-red");
    }
    else {
        $("#uv-index").attr("class", "uv-yellow")
    }
}

// set searchEntry as the value in the search bar
searchEntry = $("#search-bar").val();

// set event from search bar
function getCityData() {
    // reset search bar to empty
    $("#search-bar").val("")
    // get search results from search bar
    // get ajax data from search result
    // set API key and query URL
    var APIKey = "83cea6cbcabbb7bef1222d329e94e37c"
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + searchEntry 
    + "&units=imperial&appid=" +
    APIKey;
    $.ajax({
        url: queryURL,
        method: 'GET'
      }).then(function(response) {
        //   unhide weather box
            weatherBox.attr("class", "")
            // set variables for corresponding data points
            var results = response;
            cityName = results.name;
            temperature = Math.floor(results.main.temp);
            humidity = results.main.humidity;
            windspeed = results.wind.speed;
            windspeed = windspeed.toFixed(1);
            longitude = results.coord.lon;
            lattitude = results.coord.lat;
            // display icon for current weather
            var currentWeather = response.weather[0].main;
            if (currentWeather === "Clear") {
                var currentWeatherIcon = "fas fa-sun"
            }
            else if (currentWeather === "Clouds") {
                var currentWeatherIcon = "fas fa-cloud-sun"
            }
            else if (currentWeather === "Rain") {
                var currentWeatherIcon = "fas fa-cloud-rain"
            }
            else {
                var currentWeatherIcon = currentWeather
            }
            // put results in appropriate fields in weather box
            $("#city-name").text(cityName + "  (" + moment().format('L') + ")");
            $("#weather-icon").attr("class", currentWeatherIcon)
            $("#temperature").text("Temperature: " + temperature + "°F")
            $("#humidity").text("Humidity: " + humidity + "%")
            $("#wind-speed").text("WInd speed: " + windspeed + " MPH")
            // put search entry into previous array and local storage
            previousEntries.push(cityName);
            localStorage.setItem("cities", JSON.stringify(previousEntries))
            // get UV index
            var UVIURL = "https://api.openweathermap.org/data/2.5/uvi?appid=" + APIKey + "&lat=" + lattitude + "&lon=" + longitude;
            $.ajax({
                url: UVIURL,
                method: 'GET'
            })
        .then(function(response) {
            // set UV index text
            UVIndex = response.value;
            $("#uv-index").text(UVIndex);
            // make UV index corresponding color
            UVColor();
            // create forecast information
            var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?units=imperial&q=" + cityName + "&appid=" + APIKey;
            $.ajax({
                url: forecastURL,
                method: 'GET'
            })
        .then(function(response) {
            forecastAPI = response;
            // unhide forecast block row
            $("#forecast-text").attr("class", "")
            var forecastBlocks = $("#forecast-blocks");
            // clear any existing forecast blocks
            forecastBlocks.empty();
        // iterate through daily forecast
        for (i = 1; i < 6; i++) {
            // create forecast block
            var forecastEntry = $("<div class ='col-md forecast-box'>")
            // set variables for forecast block information
            var forecastDate = moment(moment().add('days', i)).format("MM/DD/YYYY");
            forecastEntry.append("<h5>" + forecastDate + "</h5>");
            var forecastWeather = forecastAPI.list[i].weather[0].main;
            // set forecast weather icons
            if (forecastWeather === "Clear") {
                var forecastWeatherIcon = "<i class='fas fa-sun'></i>"
            }
            else if (forecastWeather === "Clouds") {
                var forecastWeatherIcon = "<i class='fas fa-cloud-sun'></i>"
            }
            else if (forecastWeather === "Rain") {
                var forecastWeatherIcon = "<i class='fas fa-cloud-rain'></i>"
            }
            else {
                var forecastWeatherIcon = forecastWeather
            }
            // add information to weather block
            forecastEntry.append(forecastWeatherIcon);
            var forecastTemp = forecastAPI.list[i].main.temp;
            forecastTemp = Math.floor(forecastTemp);
            forecastEntry.append("<p>Temp: " + forecastTemp + "°F</p>");
            var forecastHumidity = forecastAPI.list[i].main.humidity;
            forecastEntry.append("<p>Humidity: " + forecastHumidity + "%</p>")
            // add weather block to row
            forecastBlocks.append(forecastEntry)


        }
        // allow previous searches to be clickable
        $(".prev-search").click(function(event) {
            event.preventDefault();
            searchEntry = $(this).attr("data-city");
            getCityData();
        });
    })
 })

})
}

// sets click function for search bar
$(".search-button").click(function() {
    event.preventDefault();
    searchEntry = $("#search-bar").val();
    getCityData();
    tidyArray();
    writePrevEntries();
});

