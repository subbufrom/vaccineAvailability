'use strict';

module.exports = function(app) {
  // eslint-disable-next-line global-require
  const PassportConfigurator = require('loopback-component-passport').PassportConfigurator
  const passportConfigurator = new PassportConfigurator(app)
  let authProviderConfig = {};
  try {
    // eslint-disable-next-line global-require
    authProviderConfig = require('./auth-providers.json');
  } catch (err) {
    console.trace(err); // eslint-disable-line no-console
    process.exit(1);
  }

  passportConfigurator.init()

  passportConfigurator.setupModels({
    userModel: app.models.user,
    userIdentityModel: app.models.userIdentity,
    userCredentialModel: app.models.userCredential
  })
  
  for (let s in authProviderConfig) { // Configure providers based on providers.json config
    let c = authProviderConfig[s]
    c.session = c.session !== false
    passportConfigurator.configureProvider(s, c)
  }
};
