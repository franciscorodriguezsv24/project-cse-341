const router = require('express').Router();

router.get('/', (req, res) => {
  // Reflect the current login state so the OAuth flow is easy to verify.
  const status =
    req.isAuthenticated && req.isAuthenticated()
      ? `Logged in as ${req.user.username || req.user.displayName}. Log out at /logout.`
      : 'Not logged in. Log in at /login.';
  res.send(
    `CSE 341 Products API. ${status} ` +
      'Try GET /products or /categories, or view docs at /api-docs'
  );
});

router.use('/', require('./auth'));
router.use('/products', require('./products'));
router.use('/categories', require('./categories'));

module.exports = router;
