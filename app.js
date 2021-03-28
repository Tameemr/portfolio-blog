const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const Article = require('./models/article')
const methodOverride = require('method-override')


const app = express();

// Passport Config
require('./config/passport')(passport);


// Connect to MongoDB
  mongoose.connect('mongodb://localhost/blognew', {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useUnifiedTopology: true
})

// Set public folder for styling
app.use(express.static('public'));

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Express body parser
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))

// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Routes
app.use('/', require('./routes/index.js'));
app.use('/users', require('./routes/users.js'));
app.use('/articles', require('./routes/articles.js'));



//listening to port 5000
const port = process.env.PORT || 5000;
const server = app.listen(port, () => console.log(`Listening on port ${port}...`));
module.exports = server;
