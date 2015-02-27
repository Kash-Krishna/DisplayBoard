
// <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
// <script src="/code.jquery.com/jquery-migrate-1.2.1.min.js"></script> -->

var Weather = {
	title:"Weather Underground",
	city:"default",
	//state:"default",
	zip:"default",
	tempString:"default",
	windString:"default",
	humidity:"default",
	feels:"default",
	pressure:"default",
	dewPoint:"default",
	lastUpdate:"default",
	
};

Weather.getCurrentWeather = function(){
	//make a wunderground api request
	//parse the json string into each field of weather obj
	$.ajax({
		url: "http://api.wunderground.com/api/cfe5ac04d6235cfd/conditions/q/pws:KCARIVER41.json",
		success: function(JSONString) {
			title = JSONString.current_observation.image.title;
			city = JSONString.current_observation.display_location.full;
			zip = JSONString.current_observation.display_location.zip;
			tempString = JSONString.current_observation.temperature_string;
			windString = JSONString.current_observation.wind_string;
			humidity = JSONString.current_observation.relative_humidity;
			feels = JSONString.current_observation.feelslike_string;
			pressure = JSONString.current_observation.pressure_in;
			dewPoint = JSONString.current_observation.dewpoint_string;
			lastUpdate = JSONString.current_observation.observation_time + JSONString.current_observation.local_time_rfc822;
			
			var weatherString = "";
			weatherString += title + "<br>";
			weatherString += city + "<br>";
			weatherString += zip + "<br>";
			weatherString += tempString + "<br>";
			weatherString += windString + "<br>";
			weatherString += humidity + "<br>";
			weatherString += feels + "<br>";
			weatherString += pressure + "<br>";
			weatherString += dewPoint + "<br>";
			weatherString += lastUpdate + "<br>";
			document.getElementById('weatherSlideInfo').innerHTML = weatherString;
		}
	});

	// JSONString = 'http://api.wunderground.com/api/cfe5ac04d6235cfd/conditions/q/pws:KCARIVER41.json';
}