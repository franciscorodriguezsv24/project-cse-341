const router = require('express').Router();
const passport = require('passport');

router.get(
  '/login',
  /*  #swagger.tags = ['Auth']
      #swagger.summary = 'Start GitHub OAuth login'
      #swagger.description = 'Redirects to GitHub to authorize the app. On success you are redirected back and a session cookie is set.' */
  passport.authenticate('github')
);

router.get(
  '/github/callback',
  /*  #swagger.tags = ['Auth']
      #swagger.summary = 'GitHub OAuth callback'
      #swagger.description = 'GitHub redirects here after authorization. Establishes the login session, then redirects to /.' */
  passport.authenticate('github', { failureRedirect: '/api-docs', session: true }),
  (req, res) => {
    res.redirect('/');
  }
);

router.get(
  '/logout',
  /*  #swagger.tags = ['Auth']
      #swagger.summary = 'Log out'
      #swagger.description = 'Ends the session and redirects to /.' */
  (req, res, next) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      res.redirect('/');
    });
  }
);

module.exports = router;
