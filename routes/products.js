const router = require('express').Router();
const productsController = require('../controllers/products');
const { ensureAuthenticated } = require('../middleware/authenticate');

router.get(
  '/',
  /*  #swagger.tags = ['Products']
      #swagger.summary = 'Get all products' */
  productsController.getAll
);

router.get(
  '/:id',
  /*  #swagger.tags = ['Products']
      #swagger.summary = 'Get a single product by id' */
  productsController.getSingle
);

router.post(
  '/',
  /*  #swagger.tags = ['Products']
      #swagger.summary = 'Create a new product (requires login)'
      #swagger.description = 'Protected route. Log in at /login first; the session cookie authorizes the request.'
      #swagger.security = [{ "githubOAuth": [] }]
      #swagger.parameters['body'] = {
        in: 'body',
        description: 'Product to create. All fields are required.',
        required: true,
        schema: { $ref: '#/definitions/Product' }
      }
      #swagger.responses[201] = { description: 'Product created; returns the new id.' }
      #swagger.responses[400] = { description: 'Missing or invalid field(s).' }
      #swagger.responses[401] = { description: 'Not logged in.' } */
  ensureAuthenticated,
  productsController.createProduct
);

router.put(
  '/:id',
  /*  #swagger.tags = ['Products']
      #swagger.summary = 'Update an existing product by id (requires login)'
      #swagger.description = 'Protected route. Log in at /login first; the session cookie authorizes the request.'
      #swagger.security = [{ "githubOAuth": [] }]
      #swagger.parameters['body'] = {
        in: 'body',
        description: 'Updated product data. All fields are required.',
        required: true,
        schema: { $ref: '#/definitions/Product' }
      }
      #swagger.responses[204] = { description: 'Product updated successfully.' }
      #swagger.responses[400] = { description: 'Invalid id or missing/invalid field(s).' }
      #swagger.responses[401] = { description: 'Not logged in.' }
      #swagger.responses[404] = { description: 'Product not found.' } */
  ensureAuthenticated,
  productsController.updateProduct
);

router.delete(
  '/:id',
  /*  #swagger.tags = ['Products']
      #swagger.summary = 'Delete a product by id (requires login)'
      #swagger.description = 'Protected route. Log in at /login first; the session cookie authorizes the request.'
      #swagger.security = [{ "githubOAuth": [] }]
      #swagger.responses[200] = { description: 'Product deleted successfully.' }
      #swagger.responses[400] = { description: 'Invalid product id.' }
      #swagger.responses[401] = { description: 'Not logged in.' }
      #swagger.responses[404] = { description: 'Product not found.' } */
  ensureAuthenticated,
  productsController.deleteProduct
);

module.exports = router;
