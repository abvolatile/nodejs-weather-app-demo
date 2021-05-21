const request = require('postman-request');
const getLatLon = require('./geocode');

//WeatherStack api: "http://api.weatherstack.com/current?access_key=f21bf6a35afc44b5e93f5071164ddaef&query=Seattle&units=f"
//current weather only - 250 calls per month free

const getWeatherForecast = (location, callback) => {
    getLatLon(location, (err, {lat, lon, place}={}) => {
        if (err) {
            callback({error: err});
        } else {
            const url = `http://api.weatherstack.com/current?access_key=f21bf6a35afc44b5e93f5071164ddaef&query=${encodeURIComponent(lat)},${encodeURIComponent(lon)}&units=f`;
            request({ url: url, json: true }, (err, {body}={}) => {
                if (err) {
                    callback({ error: 'Unable to connect to weather service' });
                } else if (body.error) {
                    callback({ error: 'Unable to find location' });
                } else {
                    callback({ 
                        forecast: `It is ${body.current.temperature} degrees, ${body.current.weather_descriptions[0]}, and there is a ${body.current.precip}% chance of rain`,
                        place: place
                    });
                }
            });
        }
    });
};

module.exports = getWeatherForecast;