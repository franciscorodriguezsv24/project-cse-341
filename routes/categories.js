const router = require('express').Router();
const categoriesController = require('../controllers/categories');

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
      #swagger.summary = 'Create a new category'
      #swagger.parameters['body'] = {
        in: 'body',
        description: 'Category to create. All fields are required.',
        required: true,
        schema: { $ref: '#/definitions/Category' }
      }
      #swagger.responses[201] = { description: 'Category created; returns the new id.' }
      #swagger.responses[400] = { description: 'Missing or invalid field(s).' } */
  categoriesController.createCategory
);

router.put(
  '/:id',
  /*  #swagger.tags = ['Categories']
      #swagger.summary = 'Update an existing category by id'
      #swagger.parameters['body'] = {
        in: 'body',
        description: 'Updated category data. All fields are required.',
        required: true,
        schema: { $ref: '#/definitions/Category' }
      }
      #swagger.responses[204] = { description: 'Category updated successfully.' }
      #swagger.responses[400] = { description: 'Invalid id or missing/invalid field(s).' }
      #swagger.responses[404] = { description: 'Category not found.' } */
  categoriesController.updateCategory
);

router.delete(
  '/:id',
  /*  #swagger.tags = ['Categories']
      #swagger.summary = 'Delete a category by id'
      #swagger.responses[200] = { description: 'Category deleted successfully.' }
      #swagger.responses[400] = { description: 'Invalid category id.' }
      #swagger.responses[404] = { description: 'Category not found.' } */
  categoriesController.deleteCategory
);

module.exports = router;
