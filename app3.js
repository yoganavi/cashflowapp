const express = require('express');
var expressLayouts = require('express-ejs-layouts');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');

const app = express();
// use ejs as view engine
app.set('view engine', 'ejs');
// use express layouts
app.use(expressLayouts);
// use static bild in middleware files
app.use(express.static('public'));
// use url-encoded middleware
app.use(express.urlencoded({ extended: true }));
// Configure session middleware
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: false
}));

// Initialize Passport and restore authentication state, if any, from the session
app.use(passport.initialize());
app.use(passport.session());

// Configure the LocalStrategy for Passport
passport.use(new LocalStrategy(
  function(username, password, done) {
    // Replace this with your own authentication logic
    console.log('sss');
    if (username === 'john' && password === 'secret') {
      return done(null, { id: 123, username: 'john' });
    } else {
      return done(null, false, { message: 'Invalid username or password' });
    }
  }
));

app.use('/',(req, res) => {
  res.render('login', {
    layout: 'main-login',
    jsfile: 'loginpage',
    cssfile: 'login',
    title: 'login',
  })
});

// Serialize user into session
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(function(id, done) {
  // Replace this with your own logic to retrieve user from database
  const user = { id: 123, username: 'john' };
  done(null, user);
});



// Define the login route
app.post('/login', passport.authenticate('local'), function(req, res) {
  // Authentication succeeded, redirect to home page or send success response
  console.log('hai');
  res.send('Login successful');
});

// Start the server
app.listen(3000, function() {
  console.log('Server listening on port 3000');
});
