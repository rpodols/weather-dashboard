var currentDate = new Date();
var year = currentDate.getFullYear();
var month = currentDate.getMonth() + 1;
var date = currentDate.getDate();
var datePrint = month + "/" + date + "/" + year;
var lat = "";
var lon = "";
var apiUrlLatLon = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly&appid=e1a4ed0961c7ec0f2b9fbd50ae84099c";
var apiUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + cityInput + "&limit=1&appid=e1a4ed0961c7ec0f2b9fbd50ae84099c";
var cityInput = "";
var temp = "";
var wind = "";
var humidity = "";
var searchHistory = [];

var fetchWeatherData = function(lat, lon) {
    var apiUrlLatLon = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly&units=imperial&appid=e1a4ed0961c7ec0f2b9fbd50ae84099c";
    fetch(apiUrlLatLon).then(function(response) {
        response.json().then(function(data) {
            var icon = data.daily[0].weather[0].icon;
            var iconUrl = "https://openweathermap.org/img/w/" + icon + ".png";
            var temp = data.current.temp;
            var wind = data.current.wind_speed;
            var humidity = data.current.humidity;
            var uvIndex = data.current.uvi;
            var iconImage = $("<img>").attr("src", iconUrl).addClass("remove-on-refresh");
            var tempInfo = $("<p>").text("Temperature: " + temp + "°F");
            var windInfo = $("<p>").text("Wind Speed: " + wind + " mph");
            var humidityInfo = $("<p>").text("Humidity: " + humidity + "%");
            var uvInfo = "";
            clearPage()
                if (uvIndex >= 0 && uvIndex <= 3) {
                    var uvInfo = $("<p>").text("UV-index: " + uvIndex).addClass("green");
                } else if (uvIndex > 3 && uvIndex <= 6) {
                    var uvInfo = $("<p>").text("UV-index: " + uvIndex).addClass("yellow");
                } else if (uvIndex > 6 && uvIndex <= 7) {
                    var uvInfo = $("<p>").text("UV-index: " + uvIndex).addClass("orange");
                } else if (uvIndex > 7 && uvIndex <= 11) {
                    var uvInfo = $("<p>").text("UV-index: " + uvIndex).addClass("red");
                } else if (uvIndex > 11) {
                    var uvInfo = $("<p>").text("UV-index: " + uvIndex).addClass("purple");
                }
            $("#current-search").append(iconImage).addClass("box-border");
            $("#weather-info").append(tempInfo);
            $("#weather-info").append(windInfo);
            $("#weather-info").append(humidityInfo);
            $("#weather-info").append(uvInfo);

            for (i = 1; i < 6; i++) {
                var fiveDayDivEl = $("<div>").attr("id", `five-day-${i}`).attr("class", "five-day-box");
                $("#five-day-container").append(fiveDayDivEl);

                var dateFiveDay = (data.daily[i].dt) * 1000;
                var dateConvertedFiveDay = new Date(dateFiveDay).toLocaleDateString('en-US');
                var datePrintFiveDayEl = $("<p>").text(dateConvertedFiveDay);
                $(`#five-day-${i}`).append(datePrintFiveDayEl);
                    
                var iconFiveDay = data.daily[i].weather[0].icon;
                var iconFiveDayUrl = "https://openweathermap.org/img/w/" + iconFiveDay + ".png";
                var iconImageFiveDayEl = $("<img>").attr("src", iconFiveDayUrl);
                $(`#five-day-${i}`).append(iconImageFiveDayEl);

                var tempFiveDay = data.daily[i].temp.day;
                var tempFiveDayEl = $("<p>").text("Temp: " + tempFiveDay + "°F");
                $(`#five-day-${i}`).append(tempFiveDayEl);
            
                var windFiveDay = data.daily[i].wind_speed;
                var windFiveDayEl = $("<p>").text("Wind: " + windFiveDay + " mph");
                $(`#five-day-${i}`).append(windFiveDayEl);

                var humidityFiveDay = data.daily[i].humidity;
                var humidityFiveDayEl = $("<p>").text("Humidity: " + humidityFiveDay + "%");
                $(`#five-day-${i}`).append(humidityFiveDayEl);
            };
        });
    });
};

var fetchApiInfo = function(cityInput) {
    var apiUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + cityInput + "&limit=1&appid=e1a4ed0961c7ec0f2b9fbd50ae84099c";
    fetch(apiUrl).then(function(response) {
        if (response.ok) {
        response.json().then(function(data) {
            var citySearched = data[0].name;
            var stateSearched = data[0].state;
            var displayCityName = citySearched + ", " + stateSearched;
            var lat = data[0].lat;
            var lon = data[0].lon;
            saveCitySearch(displayCityName);
            fetchWeatherData(lat, lon);
            saveSearch(displayCityName);
        });
        } else {
            window.alert("Please enter a valid city.");
        };
    })
    .catch(function(error) {
        alert("Unable to connect to openweather.")
    });
};

var fetchApiInfoOld = function(cityInput) {
    var apiUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + cityInput + "&limit=1&appid=e1a4ed0961c7ec0f2b9fbd50ae84099c";
    fetch(apiUrl).then(function(response) {
        if (response.ok) {
        response.json().then(function(data) {
            var citySearched = data[0].name;
            var stateSearched = data[0].state;
            var displayCityName = citySearched + ", " + stateSearched;
            var lat = data[0].lat;
            var lon = data[0].lon;
            saveCitySearch(displayCityName);
            fetchWeatherData(lat, lon);
        });
        } else {
            window.alert("Please enter a valid city.");
        };
    })
    .catch(function(error) {
        alert("Unable to connect to openweather.")
    });
};

var previousSearchButtonClick = function(event) {
    event.preventDefault();
    clearPage();
    var currentClick = event.currentTarget;
    var currentClickName = $(currentClick).html();
    fetchApiInfoOld(currentClickName);
};

var loadPreviousSearches = function() {
    searchHistory = JSON.parse(localStorage.getItem("searchHistory")) ?? [];

    for (i = 0; i < searchHistory.length; i++) {
        var oldSearch = $("<button>").text(searchHistory[i]).attr("id", i);
        $("#past-searches").append(oldSearch);

        $(`#${i}`).on("click", previousSearchButtonClick);
    };
};

var saveSearch = function(displayCityName) {
    var searchHistory = JSON.parse(localStorage.getItem("searchHistory")) ?? [];

    if (!searchHistory.includes(displayCityName)) {
        searchHistory.push(displayCityName);
        localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    };
    var currentSearch = $("<button>").text(displayCityName)
    $("#past-searches").append(currentSearch);
};

var clearPage = function() {
    $("#weather-info").empty();
    $("#five-day-container").empty();
    $(".remove-on-refresh").remove();
};


var getCity = function() {
    return $("#city").val(); 
};

var searchButtonClick = function(event) {
    event.preventDefault();
    clearPage();
    cityInput = getCity();
    fetchApiInfo(cityInput);
};

var saveCitySearch = function(displayCityName) {
    $("#current-city-header").text(displayCityName + " (" + datePrint + ")");
};

loadPreviousSearches();
$("#search-button").on("click", searchButtonClick);