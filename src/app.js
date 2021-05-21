const path = require('path'); //core node module (built-in)
const express = require('express'); //needs to be installed by npm
const hbs = require('hbs'); //needed for using partial views
const getWeatherForecast = require('./utils/forecast');


const app = express(); //initializes the webserver
const port = process.env.PORT || 3000;
//heroku port or 3000 for localhost

// ======================== STATIC DIR ======================== //
const publicDir = path.join(__dirname, '../public');
//console.log(publicDir); //goes up one dir and then into the public dir
//console.log(__dirname); //complete path (absolute path) to the directory of THIS particular file
//console.log(__filename); //abs path to THIS particular file


// ======================== VIEW ENGINE STUFF ======================== //
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

app.set('view engine', 'hbs'); //using handlebars (hbs is a version that works with express)
app.set('views', viewsPath); //optional: allows us to use another directory instead of "views"
hbs.registerPartials(partialsPath); //lets us use partial views!


// ======================== WEB SERVER CONFIG ======================== //
//app.use() allows us to customize our webserver
app.use(express.static(publicDir)); //tells express/our app to serve up the contents of this publicDir


// ======================== ROUTES ======================== //
app.get('', (req, res) => {
    // what happens when someone visits the home page (ie: sends a request to GET the main route: app.com)
    //res = response: res.send returns the response to the client with whatever we give it (usually html or json)
    //res.send('<h1>Hello, express!</h1>'); 

    res.render('index', {
        title: 'HOME PAGE!',
        name: 'AnnieB'
    }); 
    //this will automatically send back our handlebars view (bc we set up a view engine)
    //first arg is the VIEW, second is the values we want the view to have access to!
    //** partials have access to whatever values the view it is rendered in has access to! */
}); 
//once we use app.use(express.static(publicDir)), AND if we have an index.html file in that dir,
//express will IGNORE app.get('', ....) calls, because it will have already found our index.html to serve up
//it will still serve these other routes 
// (ie: /help --> instead of the help.html file unless we add the .html to the end...)
app.get('/help', (req, res) => {
    res.render('help', {
        title: 'HELP',
        helpText: 'This is some useful text for you',
        name: 'AnnieB'
    });
});

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'ABOUT ME',
        name: 'AnnieB'
    });
})

app.get('/weather', (req, res) => {
    console.log(req.query); // object from query string params/values
    if (!req.query.location) {
        return res.send({
            error: 'You must provide a location'
        });
    }

    getWeatherForecast(req.query.location, (result) => {
        if (!result || result.error) {
            return res.send({
                error: result ? result.error : 'something went wrong'
            });
        }
        res.send({
            forecast: result.forecast,
            location: req.query.location,
            address: result.place,
            icon: result.icon
        });
    });
});

// special error page for help-related page
app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404 Not Found',
        name: 'AnnieB',
        errorMsg: 'nope, cannot find that help article'
    });
})

// Catch-all ERROR PAGE (has to go last!!!!!! - match anything that hasn't already been matched above)
app.get('*', (req, res) => {
    res.render('404', {
        title: '404 Not Found',
        name: 'AnnieB',
        errorMsg: 'No can do, bro - page not found'
    });
})


// ======================== SERVER - heroku port OR localhost:3000 ======================== //
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
}); 
//once app.js is run, this express server will stay running until we ctrl+c to stop it 
//needs to be restarted when making changes to the file, UNLESS we use something like nodemon 
//instead of "node src/app.js", we use "nodemon src/app.js" (will restart automatically when changes are saved)

//IN ORDER to track changes to .hbs files, we need to add something to our command:
//new: "nodemon src/app.js -e js,hbs" <<-- added to package.json scripts as "watch"
