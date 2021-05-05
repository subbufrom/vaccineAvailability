"use strict";

const GoogleStrategy = require("passport-google-oauth20").Strategy;
const request = require("request");

module.exports = function (app, passportLogin, passportLink, config) {
  const google = config["google-login"];
  const passportCB = function (accessToken, refreshToken, profile, done) {
    process.nextTick(() => done(null, profile));
  };

  const getAccessTokenURL = function () {
    return "https://accounts.google.com/o/oauth2/token";
  };

  const googleCallback = function (req, res) {
    let redirectPath = "login-redirect";
    let cbUrl = google.callbackURL;

    if (req.query.type && req.query.type.toUpperCase() === "LINK") {
      redirectPath = "link-redirect";
      cbUrl = google.linkCallbackURL;
    }

    if (req.query.error) {
      res.redirect(config[redirectPath]);
      return;
    }
    const aurl = getAccessTokenURL();
    const opts = {
      form: {
        code: req.query.code,
        client_id: google.clientID,
        client_secret: google.clientSecret,
        redirect_uri: config.baseURL + cbUrl,
        grant_type: "authorization_code",
      },
    };
    request.post(aurl, opts, async (err, resObj, body) => {
      if (err) {
        return res.redirect(config[redirectPath]);
      }
      const token = {};
      body = JSON.parse(body); // eslint-disable-line no-param-reassign

      token.accessToken = body.access_token;
      token.type = body.token_type;
      token.expiry_date = Date.now() + body.expires_in * 1000;
      token.id_token = body.id_token;
      token.refresh_token = body.refresh_token;

      // eslint-disable-next-line no-use-before-define
      retrieveUserProfile({ req, token, apiResponse: body, res });
      return undefined;
    });
  };

  const retrieveUserProfile = function ({ req, token, res }) {
    request(
      `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token.accessToken}`,
      async function (err, resObj, body) {
        body = JSON.parse(body); // eslint-disable-line no-param-reassign
        if (err) {
          throw err;
        }

        const profile = {};
        profile.email = body.email;
        profile.displayName = body.given_name;
        profile.name = body.name;
        profile.family_name = body.family_name;
        profile.picture = body.picture;

        await UserIdentity.loginOrSignUp('google-login', 'oAuth 2.0', profile, token);

        res.redirect(`/register?email=${profile.email}`);

        // res.send(`<h1>${JSON.stringify(profile)}'s Profile Page</h1>`);

        return undefined;
      }
    );
  };

  passportLogin.use(
    new GoogleStrategy(
      {
        clientID: google.clientID,
        clientSecret: google.clientSecret,
        callbackURL: config.baseURL + google.callbackURL,
      },
      passportCB
    )
  );

  app.get(
    google.authPath,
    passportLogin.authenticate("google", {
      scope: ["profile", "email"],
    })
  );

  app.get(google.callbackURL, googleCallback);
};
