const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;

// Configure the GitHub OAuth strategy. Register an OAuth App at
// https://github.com/settings/developers and put the credentials in .env
// (and in Render's config vars for the deployed site).
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL
    },
    // We don't store credentials ourselves — GitHub verifies the user, so no
    // passwords ever touch our database and bcrypt isn't needed. The GitHub
    // profile becomes the logged-in user.
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    }
  )
);

// Persist the whole profile in the session (small enough for this project).
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

module.exports = passport;
