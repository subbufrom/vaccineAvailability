'use strict';

const Passport = require('passport').Passport;

const passportLink = new Passport();
const passportLogin = new Passport();

const config = require('../auth-providers.json');


module.exports = function(app) {
  app.use(passportLogin.initialize());
  app.use(passportLink.initialize());

  app.use(passportLogin.session());

  passportLogin.serializeUser((user, callback) => {
    callback(null, user);
  });

  passportLogin.deserializeUser((user, callback) => {
    callback(null, user);
  });

  /* eslint-disable global-require */
  require('./google-auth')(app, passportLogin, passportLink, config);
  /* eslint-enable global-require */
};
