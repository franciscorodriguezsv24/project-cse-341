# CSE 341 Products API

REST API for managing products, built with Express and MongoDB. Full CRUD with
validation, error handling, and interactive Swagger documentation.

REST API for managing products, built with Express and MongoDB. Full CRUD with
validation, error handling, interactive Swagger documentation, and GitHub
OAuth authentication protecting the write routes.

## MVC Structure

```
server.js                 # App bootstrap: middleware, session, passport, routes, DB, listen
config/passport.js        # GitHub OAuth (passport-github2) strategy + session serialization
middleware/authenticate.js# ensureAuthenticated guard for protected routes
db/connect.js             # MongoDB connection (initDb / getDatabase)
routes/index.js           # Root router; mounts /auth, /products, /categories
routes/auth.js            # /login, /github/callback, /logout
routes/products.js        # Maps HTTP verbs to product controller functions
routes/categories.js      # Maps HTTP verbs to category controller functions
controllers/products.js   # Product CRUD logic, validation, and error handling
controllers/categories.js # Category CRUD logic, validation, and error handling
swagger.js                # Generates swagger-output.json from route annotations
```

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file (copy `.env.example`) and fill in your values:
   ```
   MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/cse341_products
   PORT=8080
   GITHUB_CLIENT_ID=<from your GitHub OAuth App>
   GITHUB_CLIENT_SECRET=<from your GitHub OAuth App>
   GITHUB_CALLBACK_URL=http://localhost:8080/github/callback
   SESSION_SECRET=<any long random string>
   ```
   Register a GitHub OAuth App at <https://github.com/settings/developers> with
   the callback URL `http://localhost:8080/github/callback` (and a second app or
   updated callback `https://<your-app>.onrender.com/github/callback` for Render).
3. Generate the Swagger docs:
   ```bash
   npm run swagger
   ```
4. Run the server:
   ```bash
   npm run dev      # with nodemon
   # or
   npm start
   ```

## Endpoints

| Method | Route            | Description            |
|--------|------------------|------------------------|
| GET    | `/products`        | Get all products        |
| GET    | `/products/:id`    | Get one product by id   |
| POST   | `/products`        | Create a product        |
| PUT    | `/products/:id`    | Update a product        |
| DELETE | `/products/:id`    | Delete a product        |
| GET    | `/categories`      | Get all categories      |
| GET    | `/categories/:id`  | Get one category by id  |
| POST   | `/categories`      | Create a category       |
| PUT    | `/categories/:id`  | Update a category       |
| DELETE | `/categories/:id`  | Delete a category       |

Interactive documentation: `GET /api-docs`

## Authentication (GitHub OAuth)

| Method | Route               | Description                          |
|--------|---------------------|--------------------------------------|
| GET    | `/login`            | Start GitHub OAuth login             |
| GET    | `/github/callback`  | OAuth callback (sets the session)    |
| GET    | `/logout`           | End the session                      |

- **Public:** all `GET` routes for products and categories.
- **Protected (login required):** every `POST`, `PUT`, and `DELETE`. Requests
  without a valid session get `401 Unauthorized`.
- Log in by visiting `/login` in the browser. After GitHub authorizes you, a
  session cookie is set; that same cookie authorizes the "Try it out" requests
  in Swagger UI (same origin).
- No passwords are stored — GitHub verifies the user — so bcrypt is not needed.

## Product fields (all required)

| Field        | Type   | Notes                 |
|--------------|--------|-----------------------|
| name         | string |                       |
| category     | string |                       |
| price        | number | >= 0                  |
| stock        | number | integer >= 0          |
| brand        | string |                       |
| description  | string |                       |
| sku          | string | stock-keeping unit    |

## Category fields (all required)

| Field        | Type    | Notes                |
|--------------|---------|----------------------|
| name         | string  |                      |
| description  | string  |                      |
| department   | string  |                      |
| displayOrder | number  | integer >= 0         |
| active       | boolean |                      |

## Deploying to Render

1. Push this repo to GitHub (`.env` is gitignored and must never be committed).
2. Create a new Web Service on Render pointing at the repo.
3. Build command: `npm install` — Start command: `npm start`.
4. Add these config vars in the Render dashboard: `MONGODB_URI`,
   `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `SESSION_SECRET`, and
   `GITHUB_CALLBACK_URL=https://<your-app>.onrender.com/github/callback`.
5. Make sure the GitHub OAuth App's callback URL matches the Render callback.
