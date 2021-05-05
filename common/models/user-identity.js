"use strict";

const randomstring = require("randomstring");

module.exports = function (UserIdentity) {
  UserIdentity.loginOrSignUp = async (
    provider,
    authScheme,
    profile,
    credentials
  ) => {
    const foundUser = await User.findOne({
      where: {
        provider,
        email: profile.email,
      },
    });

    if (foundUser) return foundUser;

    const password = randomstring.generate({
      charset: "abcdefghijklmnopqrstuvwxyz0123456789",
      length: 10,
    });

    return User.create({
      username: profile.name,
      email: profile.email,
      password,
      emailverified: true,
      createdAt: new Date(),
    });
  };
};
