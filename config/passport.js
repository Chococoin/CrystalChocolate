const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const githubStrategy = require('passport-github2'):
const mongoose = require('mongoose');
const User = require('../models/Users');
const key = require('./key');

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = key;

function passport(){
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      console.log(jwt_payload);
  }));

  passport.use(
	new GithubStrategy({
	// option for the github strategy
	clientID: key.github.clientID,
	clientSecret: key.github.clientSecret,	
	callbackURL: "/auth/github/redirect"
	}, () => {
	// passport callback function
	console.log('passport callback function fired');
	}
));
}

module.exports = passport();