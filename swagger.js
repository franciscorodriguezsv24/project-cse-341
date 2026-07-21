const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'CSE 341 Products API',
    description: 'Products REST API with full CRUD, validation, and error handling.'
  },
  // host/schemes are stripped at runtime in server.js so "Try it out" works
  // on both localhost and Render. Values here are just sensible defaults.
  host: 'localhost:8080',
  schemes: ['http', 'https'],
  definitions: {
    Product: {
      name: 'Wireless Mouse',
      category: 'Electronics',
      price: 24.99,
      stock: 150,
      brand: 'Logitech',
      description: 'Ergonomic wireless mouse with USB receiver.'
    }
  }
};

const outputFile = './swagger-output.json';
const routes = ['./routes/index.js'];

// Generate swagger-output.json from the route annotations.
swaggerAutogen(outputFile, routes, doc);
