const { ObjectId } = require('mongodb');
const { getDatabase } = require('../db/connect');

const COLLECTION = 'products';
const REQUIRED_FIELDS = ['name', 'category', 'price', 'stock', 'brand', 'description', 'sku'];

// Validate that every required field is present and non-empty.
const getMissingFields = (body) =>
  REQUIRED_FIELDS.filter((field) => body[field] === undefined || body[field] === '');

// Basic type validation for the numeric fields.
const getTypeErrors = (body) => {
  const errors = [];
  if (body.price !== undefined && (typeof body.price !== 'number' || body.price < 0)) {
    errors.push('price must be a number >= 0');
  }
  if (body.stock !== undefined && (!Number.isInteger(body.stock) || body.stock < 0)) {
    errors.push('stock must be an integer >= 0');
  }
  return errors;
};

// Build a clean product object from the request body.
const buildProduct = (body) => ({
  name: body.name,
  category: body.category,
  price: body.price,
  stock: body.stock,
  brand: body.brand,
  description: body.description,
  sku: body.sku
});

// GET /products -> all products
const getAll = async (req, res) => {
  try {
    const products = await getDatabase()
      .collection(COLLECTION)
      .find()
      .toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /products/:id -> single product by id
const getSingle = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid product id.' });
    }
    const product = await getDatabase()
      .collection(COLLECTION)
      .findOne({ _id: new ObjectId(req.params.id) });

    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /products -> create a new product
const createProduct = async (req, res) => {
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
      .insertOne(buildProduct(req.body));

    if (!result.acknowledged) {
      return res.status(500).json({ error: 'Failed to create product.' });
    }
    res.status(201).json({ id: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /products/:id -> update an existing product
const updateProduct = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid product id.' });
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
      .replaceOne({ _id: new ObjectId(req.params.id) }, buildProduct(req.body));

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Product not found.' });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /products/:id -> remove a product
const deleteProduct = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid product id.' });
    }

    const result = await getDatabase()
      .collection(COLLECTION)
      .deleteOne({ _id: new ObjectId(req.params.id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Product not found.' });
    }
    res.status(200).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAll,
  getSingle,
  createProduct,
  updateProduct,
  deleteProduct
};
