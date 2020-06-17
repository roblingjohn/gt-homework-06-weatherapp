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

// function removeDuplicates(arrayName) {
//     var uniqueArray = [];
//     for(i=0; i < arrayName.length; i++){
//         if(uniqueArray.indexOf(arrayName[i]) === -1) {
//             uniqueArray.push(arrayName[i]);
//         }
//     }
//     arrayName = uniqueArray;
// }

function writePrevEntries() {
    $("#searched-cities").empty();
    for (i = previousEntries.length - 1; i > previousEntries.length - 9 ; i--){
        if (previousEntries[i] === undefined) {
            console.log("No more entries");
        }
        else {
        $("#searched-cities").append("<button class='prev-search' data-city='" + previousEntries[i] + "'>" + previousEntries[i] + "</button>")
        }
    }
    tidyArray();
};

tidyArray();
writePrevEntries();
getCityData();

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


searchEntry = $("#search-bar").val();

// set event from search bar
function getCityData() {
    $("#search-bar").val("")
    // get search results from search bar
    // get ajax data from search result
    var APIKey = "83cea6cbcabbb7bef1222d329e94e37c"
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + searchEntry 
    + "&units=imperial&appid=" +
    APIKey;
    $.ajax({
        url: queryURL,
        method: 'GET'
      }).then(function(response) {
            weatherBox.attr("class", "")
            var results = response;
            cityName = results.name;
            temperature = Math.floor(results.main.temp);
            humidity = results.main.humidity;
            windspeed = results.wind.speed;
            windspeed = windspeed.toFixed(1);
            longitude = results.coord.lon;
            lattitude = results.coord.lat;
            // put results in appropriate fields in weather box
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
            $("#city-name").text(cityName + "  (" + moment().format('L') + ")");
            $("#weather-icon").attr("class", currentWeatherIcon)
            $("#temperature").text("Temperature: " + temperature + "°F")
            $("#humidity").text("Humidity: " + humidity + "%")
            $("#wind-speed").text("WInd speed: " + windspeed + " MPH")
            previousEntries.push(cityName);
            localStorage.setItem("cities", JSON.stringify(previousEntries))
            var UVIURL = "http://api.openweathermap.org/data/2.5/uvi?appid=" + APIKey + "&lat=" + lattitude + "&lon=" + longitude;
            $.ajax({
                url: UVIURL,
                method: 'GET'
            })
        .then(function(response) {
            UVIndex = response.value;
            $("#uv-index").text(UVIndex);
            UVColor();
            // create forecast information
            var forecastURL = "http://api.openweathermap.org/data/2.5/forecast?units=imperial&q=" + cityName + "&appid=" + APIKey;
            $.ajax({
                url: forecastURL,
                method: 'GET'
            })
        .then(function(response) {
            forecastAPI = response;
            $("#forecast-text").attr("class", "")
            var forecastBlocks = $("#forecast-blocks");
            forecastBlocks.empty();
        for (i = 1; i < 6; i++) {
            var forecastEntry = $("<div class ='col-md forecast-box'>")
            var forecastDate = moment(moment().add('days', i)).format("MM/DD/YYYY");
            forecastEntry.append("<h5>" + forecastDate + "</h5>");
            var forecastWeather = forecastAPI.list[i].weather[0].main;
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
            forecastEntry.append(forecastWeatherIcon);
            var forecastTemp = forecastAPI.list[i].main.temp;
            forecastTemp = Math.floor(forecastTemp);
            forecastEntry.append("<p>Temp: " + forecastTemp + "°F</p>");
            var forecastHumidity = forecastAPI.list[i].main.humidity;
            forecastEntry.append("<p>Humidity: " + forecastHumidity + "%</p>")
            forecastBlocks.append(forecastEntry)


        }
        $(".prev-search").click(function(event) {
            event.preventDefault();
            searchEntry = $(this).attr("data-city");
            getCityData();
        });
    })
 })


    // iterate through forecast 5 times

// push search into previous search array
// iterate through previous searchest and place in previous search column

})
}

$(".search-button").click(function() {
    event.preventDefault();
    searchEntry = $("#search-bar").val();
    getCityData();
    tidyArray();
    writePrevEntries();
});

