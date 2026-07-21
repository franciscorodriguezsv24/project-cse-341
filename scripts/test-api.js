/*
 * API walkthrough / validation demo script.
 *
 * Exercises full CRUD plus validation failures for both collections so the
 * grading video can show correct status codes and DB updates. Requires Node 18+
 * (uses the global fetch).
 *
 * Usage:
 *   npm run test:api                                  # hits http://localhost:8080
 *   BASE_URL=https://your-app.onrender.com npm run test:api   # hits deployed link
 */

const BASE_URL = (process.env.BASE_URL || 'http://localhost:8080').replace(/\/$/, '');

let passed = 0;
let failed = 0;

// Perform one request and assert the expected HTTP status.
const step = async (label, method, path, { body, expect } = {}) => {
  const options = { method, headers: { 'Content-Type': 'application/json' } };
  if (body !== undefined) options.body = JSON.stringify(body);

  const res = await fetch(`${BASE_URL}${path}`, options);
  const text = await res.text();
  let payload = text;
  try {
    payload = text ? JSON.parse(text) : '';
  } catch {
    /* leave as raw text */
  }

  const ok = res.status === expect;
  ok ? passed++ : failed++;

  console.log(`${ok ? '✅' : '❌'} ${label}`);
  console.log(`   ${method} ${path} -> ${res.status} (expected ${expect})`);
  if (payload !== '') {
    console.log(`   body: ${JSON.stringify(payload)}`);
  }
  console.log('');
  return payload;
};

const validProduct = {
  name: 'Wireless Mouse',
  category: 'Electronics',
  price: 24.99,
  stock: 150,
  brand: 'Logitech',
  description: 'Ergonomic wireless mouse with USB receiver.'
};

const validCategory = {
  name: 'Electronics',
  description: 'Devices, gadgets, and accessories.',
  department: 'Technology',
  displayOrder: 1,
  active: true
};

const run = async () => {
  console.log(`Running API walkthrough against ${BASE_URL}\n`);

  /* ============ PRODUCTS ============ */
  console.log('=========== PRODUCTS ===========\n');

  // --- Validation failures (POST) ---
  await step('POST product missing required fields -> 400', 'POST', '/products', {
    body: { name: 'Incomplete' },
    expect: 400
  });
  await step('POST product with bad types (price/stock) -> 400', 'POST', '/products', {
    body: { ...validProduct, price: -5, stock: 3.5 },
    expect: 400
  });

  // --- Happy-path CRUD ---
  const created = await step('POST valid product -> 201', 'POST', '/products', {
    body: validProduct,
    expect: 201
  });
  const productId = created && created.id;

  await step('GET all products -> 200', 'GET', '/products', { expect: 200 });
  await step('GET single product -> 200', 'GET', `/products/${productId}`, { expect: 200 });

  // --- Validation failure (PUT) ---
  await step('PUT product missing fields -> 400', 'PUT', `/products/${productId}`, {
    body: { name: 'Only a name' },
    expect: 400
  });

  await step('PUT valid product update -> 204', 'PUT', `/products/${productId}`, {
    body: { ...validProduct, price: 19.99, stock: 200 },
    expect: 204
  });

  await step('GET product after update -> 200', 'GET', `/products/${productId}`, { expect: 200 });
  await step('DELETE product -> 200', 'DELETE', `/products/${productId}`, { expect: 200 });
  await step('GET deleted product -> 404', 'GET', `/products/${productId}`, { expect: 404 });

  /* ============ CATEGORIES ============ */
  console.log('=========== CATEGORIES ===========\n');

  // --- Validation failures (POST) ---
  await step('POST category missing required fields -> 400', 'POST', '/categories', {
    body: { name: 'Incomplete' },
    expect: 400
  });
  await step('POST category with bad types (displayOrder/active) -> 400', 'POST', '/categories', {
    body: { ...validCategory, displayOrder: 1.5, active: 'yes' },
    expect: 400
  });

  // --- Happy-path CRUD ---
  const createdCat = await step('POST valid category -> 201', 'POST', '/categories', {
    body: validCategory,
    expect: 201
  });
  const categoryId = createdCat && createdCat.id;

  await step('GET all categories -> 200', 'GET', '/categories', { expect: 200 });
  await step('GET single category -> 200', 'GET', `/categories/${categoryId}`, { expect: 200 });

  // --- Validation failure (PUT) ---
  await step('PUT category with bad types -> 400', 'PUT', `/categories/${categoryId}`, {
    body: { ...validCategory, displayOrder: -1 },
    expect: 400
  });

  await step('PUT valid category update -> 204', 'PUT', `/categories/${categoryId}`, {
    body: { ...validCategory, displayOrder: 5, active: false },
    expect: 204
  });

  await step('GET category after update -> 200', 'GET', `/categories/${categoryId}`, { expect: 200 });
  await step('DELETE category -> 200', 'DELETE', `/categories/${categoryId}`, { expect: 200 });
  await step('GET deleted category -> 404', 'GET', `/categories/${categoryId}`, { expect: 404 });

  /* ============ SUMMARY ============ */
  console.log('================================');
  console.log(`Results: ${passed} passed, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
};

run().catch((err) => {
  console.error('Script failed to run:', err.message);
  process.exit(1);
});
