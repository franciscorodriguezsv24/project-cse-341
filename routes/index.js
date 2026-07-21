const router = require('express').Router();

router.get('/', (req, res) => {
  res.send('CSE 341 Products API. Try GET /products or view docs at /api-docs');
});

router.use('/products', require('./products'));

module.exports = router;
