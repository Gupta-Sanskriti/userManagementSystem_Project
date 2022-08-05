const express = require('express');
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const mysql = require('mysql')

require('dotenv').config();

// initialising express app
const app = express();
// create the port
const port = process.env.PORT || 3000;

// Parsing middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extend: false}))

// Parse application/json
app.use(bodyParser.json());

// Static files
app.use(express.static('public'));

// Templating Engine
app.engine('hbs', exphbs.engine({extname : '.hbs'}))
app.set('view engine', 'hbs')





// Tell the app.js where will be all our router and servers
const routes = require('./server/routes/user')
app.use('/', routes);





// listening on the port
app.listen(port, ()=>{
    console.log(`Server is running on ${port}`)
})