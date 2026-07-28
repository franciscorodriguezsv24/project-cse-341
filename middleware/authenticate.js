// Guard for routes that require a logged-in user. Passport adds
// req.isAuthenticated() once the session middleware and passport.session()
// are wired up in server.js.
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({
    error: 'Unauthorized. Log in at /login before performing this action.'
  });
};

module.exports = { ensureAuthenticated };
