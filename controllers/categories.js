const { ObjectId } = require('mongodb');
const { getDatabase } = require('../db/connect');

const COLLECTION = 'categories';
const REQUIRED_FIELDS = ['name', 'description', 'department', 'displayOrder', 'active'];

// Validate that every required field is present and non-empty.
const getMissingFields = (body) =>
  REQUIRED_FIELDS.filter((field) => body[field] === undefined || body[field] === '');

// Basic type validation for the non-string fields.
const getTypeErrors = (body) => {
  const errors = [];
  if (body.displayOrder !== undefined && (!Number.isInteger(body.displayOrder) || body.displayOrder < 0)) {
    errors.push('displayOrder must be an integer >= 0');
  }
  if (body.active !== undefined && typeof body.active !== 'boolean') {
    errors.push('active must be a boolean');
  }
  return errors;
};

// Build a clean category object from the request body.
const buildCategory = (body) => ({
  name: body.name,
  description: body.description,
  department: body.department,
  displayOrder: body.displayOrder,
  active: body.active
});

// GET /categories -> all categories
const getAll = async (req, res) => {
  try {
    const categories = await getDatabase()
      .collection(COLLECTION)
      .find()
      .toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /categories/:id -> single category by id
const getSingle = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid category id.' });
    }
    const category = await getDatabase()
      .collection(COLLECTION)
      .findOne({ _id: new ObjectId(req.params.id) });

    if (!category) {
      return res.status(404).json({ error: 'Category not found.' });
    }
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /categories -> create a new category
const createCategory = async (req, res) => {
  try {
    const missing = getMissingFields(req.body);
    if (missing.length > 0) {
      return res
        .status(400)
        .json({ error: `Missing required field(s): ${missing.join(', ')}.` });
    }

    const typeErrors = getTypeErrors(req.body);
    if (typeErrors.length > 0) {
      return res.status(400).json({ error: typeErrors.join('; ') });
    }

    const result = await getDatabase()
      .collection(COLLECTION)
      .insertOne(buildCategory(req.body));

    if (!result.acknowledged) {
      return res.status(500).json({ error: 'Failed to create category.' });
    }
    res.status(201).json({ id: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /categories/:id -> update an existing category
const updateCategory = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid category id.' });
    }

    const missing = getMissingFields(req.body);
    if (missing.length > 0) {
      return res
        .status(400)
        .json({ error: `Missing required field(s): ${missing.join(', ')}.` });
    }

    const typeErrors = getTypeErrors(req.body);
    if (typeErrors.length > 0) {
      return res.status(400).json({ error: typeErrors.join('; ') });
    }

    const result = await getDatabase()
      .collection(COLLECTION)
      .replaceOne({ _id: new ObjectId(req.params.id) }, buildCategory(req.body));

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Category not found.' });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /categories/:id -> remove a category
const deleteCategory = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid category id.' });
    }

    const result = await getDatabase()
      .collection(COLLECTION)
      .deleteOne({ _id: new ObjectId(req.params.id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Category not found.' });
    }
    res.status(200).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAll,
  getSingle,
  createCategory,
  updateCategory,
  deleteCategory
};
