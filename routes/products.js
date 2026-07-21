const router = require('express').Router();
const productsController = require('../controllers/products');

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
      #swagger.summary = 'Create a new product'
      #swagger.parameters['body'] = {
        in: 'body',
        description: 'Product to create. All fields are required.',
        required: true,
        schema: { $ref: '#/definitions/Product' }
      }
      #swagger.responses[201] = { description: 'Product created; returns the new id.' }
      #swagger.responses[400] = { description: 'Missing or invalid field(s).' } */
  productsController.createProduct
);

router.put(
  '/:id',
  /*  #swagger.tags = ['Products']
      #swagger.summary = 'Update an existing product by id'
      #swagger.parameters['body'] = {
        in: 'body',
        description: 'Updated product data. All fields are required.',
        required: true,
        schema: { $ref: '#/definitions/Product' }
      }
      #swagger.responses[204] = { description: 'Product updated successfully.' }
      #swagger.responses[400] = { description: 'Invalid id or missing/invalid field(s).' }
      #swagger.responses[404] = { description: 'Product not found.' } */
  productsController.updateProduct
);

router.delete(
  '/:id',
  /*  #swagger.tags = ['Products']
      #swagger.summary = 'Delete a product by id'
      #swagger.responses[200] = { description: 'Product deleted successfully.' }
      #swagger.responses[400] = { description: 'Invalid product id.' }
      #swagger.responses[404] = { description: 'Product not found.' } */
  productsController.deleteProduct
);

module.exports = router;
