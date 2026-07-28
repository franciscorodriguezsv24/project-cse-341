const express = require('express');
const session = require('express-session');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');
const { initDb } = require('./db/connect');
const passport = require('./config/passport');

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());

// Session must be initialized before passport.session() so login state
// survives across requests via the session cookie. Require a real secret —
// never sign cookies with a static fallback.
const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error('SESSION_SECRET is required. Set it in .env (see .env.example).');
}
app.use(
  session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Remove the hard-coded host AND schemes so Swagger UI issues "Try it out"
// requests against whatever origin serves the page (http on localhost, https
// on Render). Leaving schemes with "http" first makes the https Render page
// send http requests, which the browser blocks as mixed content.
delete swaggerDocument.host;
delete swaggerDocument.schemes;

// Interactive Swagger documentation at /api-docs.
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/', require('./routes'));

initDb((err) => {
  if (err) {
    console.error('Failed to connect to database:', err);
    process.exit(1);
  }
  app.listen(port, () => {
    console.log(`Server running on port ${port}.`);
  });
});
