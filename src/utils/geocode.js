const request = require('postman-request');

//Geocoding api (using Mapbox api)
// user gives address > we convert to lat/lon > we give the weather
const getLatLon = (location, callback) => {
    const mapboxURL = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(location)}.json?access_token=pk.eyJ1IjoiYWJ2b2xhdGlsZSIsImEiOiJjanY4bjgzZDIwMWFjNDRvMHp6Nm0wMXBoIn0.S-c4NHo4Dj6cB8mDniwUyQ&limit=1`;
    request({url: mapboxURL, json:true}, (err, {body}={}) => {
        if (err) {
            callback('Unable to connect to location service', undefined);
        } else if (!body.features) {
            callback('Unable to find lat/lon for this location', undefined); 
        } else {
            const feature = body.features[0];
            const lat = feature?.center[1];
            const lon = feature?.center[0];
            const place = feature?.place_name;
            !lat || !lon ? callback('Something went wrong getting lat/lon for "' + location + '"', undefined) : callback(undefined, {lat, lon, place});
        }
    });
};

module.exports = getLatLon;