const express = require('express');
const createError = require('http-errors');
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const passport = require('passport');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const { sequelize } = require('./models');
const routes = require('./routes');
const setupPassport = require('./utils/passport');
const config = require(path.resolve('config.js'));
const log = require('./utils/logger');
const sendBoosterReminders = require('./utils/sendBoosterReminders');
const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(config.get('SESSION_SECRET')));

// Enable session and connect to database using Sequelize where session information is stored
app.use(
  session({
    secret: config.get('SESSION_SECRET'),
    store: new SequelizeStore({
      db: sequelize,
      checkExpirationInterval: 5 * 60 * 1000, // The interval at which to cleanup expired sessions in milliseconds (5 minutes)
      expiration: 4 * 60 * 60 * 1000 // The maximum age (in milliseconds) of a valid session (4 hours)
    }),
    resave: false, // SequelizeStore supports the touch method so per the express-session docs this should be set to false
    saveUninitialized: true
  })
);

// Initialize booster email check
sendBoosterReminders(5);

// Setup passport
setupPassport(passport);
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

// Add API routes
app.use('/api', routes);

// Forward bare domain to apidoc
app.get('/', (req, res) => res.redirect('/apidoc/'));
app.use(express.static(path.join(__dirname, 'build')));

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  err.status = err.status || 500;

  if (err.status >= 500) {
    log.error(`Internal server error: `, err);
  }

  res.status(err.status);
  res.json({
    error: err.message
  });
});

module.exports = app;
