const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const githubKey = require('../keys/strategy-keys');

passport.use(new GitHubStrategy({
    clientID: githubKey.clientId,
    clientSecret: githubKey.clientSecret,
    callbackURL: "http://127.0.0.1:8000/auth/github/redirect"
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOrCreate({ githubId: profile.id }, function (err, user) {
      return done(err, user);
    });
  }
));