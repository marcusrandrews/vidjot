const express = require('express'); // require function brings in module
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const mongoose = require('mongoose');
const passport = require('passport');
const bodyParser = require('body-parser');


// INITILIZE APPLICAITON
const app = express();

// Load ROUTES
const ideas = require('./routes/ideas');
const users = require('./routes/users');

// Passport Config
require('./config/passport')(passport);
// DB Config
const db = require('./config/database');

// CONNECT TO MONGOOSE (DATABASE) mongoose helps create schema in application level
// map global promise - get rid of warning
mongoose.Promise = global.Promise
// this could be a remote database from mlab or local database
// db.mongoURI goes to if statment in config/database dev - prod
mongoose.connect(db.mongoURI, {  // defines and creates database
  useMongoClient: true
})
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));



// MIDDLEWARE
// EXPRESS_HANDLEBARS MIDDLEWARE
// telling the system we want o use the handlebars template engine
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
})); // setting the default layout to main
app.set('view engine', 'handlebars');


// BODY PARSER MIDDLEWARE
// Body Pasrser allows us to access whatever is submitted - 'get form values'
// add.handlebars has name of title and details for inputs
// Submit on add.handlebars then console logs an object with title and details
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Static Folder (public)
app.use(express.static(path.join(__dirname, 'public')));

// METHOD-OVERRIDE MIDDLEWARE
app.use(methodOverride('_method'));

// ExpressJS Session Middleware
app.use(session({
  secret: 'hector',
  resave: true,
  saveUninitialized: true
}));

// Passport MIDDLEWARE
app.use(passport.initialize());
app.use(passport.session());


// Connect Flash MIDDLEWARE
app.use(flash());

// Global Variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error'); // this is for later on for passport
  res.locals.user = req.user || null;
  next();
});



// MIDDLEWARE TUTORIAL
/*
// How middleware works
app.use(function(req, res, next) {
  // console.log(Date.now());
  req.name = 'Marcus Andrews';
  next();
});
*/



// CREATING ROUTES
// index route
app.get('/', (req, res) => { // req, res contin methods
  // seems to be where you put things when the page is refreshed - get - and they happen
  // this is how a lot of node modules work with authentification
  const title = "Welcome"
  console.log(req.name);
  res.render('index', { // insert data from database into view here
    title: title
  }); // .send ->  sends something to the browser | render renders html handlebars view
});

// About Route
app.get('/about', (req, res) => {
  res.render('about'); // in this case ABOUT is being sent tot he browser
});


// Use ROUTES
app.use('/ideas', ideas);
app.use('/users', users);



// SETTING THE PORT
const port = process.env.PORT || 5000; // set the port number

app.listen(port, () => { // listens on a certain port -> in a variable
  console.log(`Server started on port ${port}`); // [Back ticks! -> es6 way of things]
  // console.log('Server started on port '+ port); -> same as above
});
