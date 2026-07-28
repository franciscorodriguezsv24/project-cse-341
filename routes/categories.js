const router = require('express').Router();
const categoriesController = require('../controllers/categories');
const { ensureAuthenticated } = require('../middleware/authenticate');

router.get(
  '/',
  /*  #swagger.tags = ['Categories']
      #swagger.summary = 'Get all categories' */
  categoriesController.getAll
);

router.get(
  '/:id',
  /*  #swagger.tags = ['Categories']
      #swagger.summary = 'Get a single category by id' */
  categoriesController.getSingle
);

router.post(
  '/',
  /*  #swagger.tags = ['Categories']
      #swagger.summary = 'Create a new category (requires login)'
      #swagger.description = 'Protected route. Log in at /login first; the session cookie authorizes the request.'
      #swagger.security = [{ "githubOAuth": [] }]
      #swagger.parameters['body'] = {
        in: 'body',
        description: 'Category to create. All fields are required.',
        required: true,
        schema: { $ref: '#/definitions/Category' }
      }
      #swagger.responses[201] = { description: 'Category created; returns the new id.' }
      #swagger.responses[400] = { description: 'Missing or invalid field(s).' }
      #swagger.responses[401] = { description: 'Not logged in.' } */
  ensureAuthenticated,
  categoriesController.createCategory
);

router.put(
  '/:id',
  /*  #swagger.tags = ['Categories']
      #swagger.summary = 'Update an existing category by id (requires login)'
      #swagger.description = 'Protected route. Log in at /login first; the session cookie authorizes the request.'
      #swagger.security = [{ "githubOAuth": [] }]
      #swagger.parameters['body'] = {
        in: 'body',
        description: 'Updated category data. All fields are required.',
        required: true,
        schema: { $ref: '#/definitions/Category' }
      }
      #swagger.responses[204] = { description: 'Category updated successfully.' }
      #swagger.responses[400] = { description: 'Invalid id or missing/invalid field(s).' }
      #swagger.responses[401] = { description: 'Not logged in.' }
      #swagger.responses[404] = { description: 'Category not found.' } */
  ensureAuthenticated,
  categoriesController.updateCategory
);

router.delete(
  '/:id',
  /*  #swagger.tags = ['Categories']
      #swagger.summary = 'Delete a category by id (requires login)'
      #swagger.description = 'Protected route. Log in at /login first; the session cookie authorizes the request.'
      #swagger.security = [{ "githubOAuth": [] }]
      #swagger.responses[200] = { description: 'Category deleted successfully.' }
      #swagger.responses[400] = { description: 'Invalid category id.' }
      #swagger.responses[401] = { description: 'Not logged in.' }
      #swagger.responses[404] = { description: 'Category not found.' } */
  ensureAuthenticated,
  categoriesController.deleteCategory
);

module.exports = router;
