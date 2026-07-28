const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'CSE 341 Products API',
    description:
      'Products REST API with full CRUD, validation, and error handling. ' +
      'Write routes (POST/PUT/DELETE) are protected by GitHub OAuth — log in ' +
      'at /login first, then the session cookie authorizes your requests.'
  },
  // host/schemes are stripped at runtime in server.js so "Try it out" works
  // on both localhost and Render. Values here are just sensible defaults.
  host: 'localhost:8080',
  schemes: ['http', 'https'],
  securityDefinitions: {
    githubOAuth: {
      type: 'oauth2',
      flow: 'implicit',
      authorizationUrl: 'https://github.com/login/oauth/authorize',
      description:
        'GitHub OAuth. In practice, open /login in the browser to sign in; ' +
        'the resulting session cookie authorizes protected routes.',
      scopes: {}
    }
  },
  definitions: {
    Product: {
      name: 'Wireless Mouse',
      category: 'Electronics',
      price: 24.99,
      stock: 150,
      brand: 'Logitech',
      description: 'Ergonomic wireless mouse with USB receiver.',
      sku: 'LOG-WM-001'
    },
    Category: {
      name: 'Electronics',
      description: 'Devices, gadgets, and accessories.',
      department: 'Technology',
      displayOrder: 1,
      active: true
    }
  }
};

const outputFile = './swagger-output.json';
const routes = ['./routes/index.js'];

// Generate swagger-output.json from the route annotations.
swaggerAutogen(outputFile, routes, doc);
