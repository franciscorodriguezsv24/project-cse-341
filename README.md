# CSE 341 Products API

REST API for managing products, built with Express and MongoDB. Full CRUD with
validation, error handling, and interactive Swagger documentation.

## MVC Structure

```
server.js              # App bootstrap: middleware, mounts routes, connects DB, listens
db/connect.js          # MongoDB connection (initDb / getDatabase)
routes/index.js        # Root router; mounts /products
routes/products.js     # Maps HTTP verbs to controller functions
controllers/products.js# CRUD logic, validation, and error handling
swagger.js             # Generates swagger-output.json from route annotations
```

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file (copy `.env.example`) and set your MongoDB connection
   string. Point it at a **new** database, e.g. `.../cse341_products`.
   ```
   MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/cse341_products
   PORT=8080
   ```
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
| GET    | `/products`      | Get all products       |
| GET    | `/products/:id`  | Get one product by id  |
| POST   | `/products`      | Create a product       |
| PUT    | `/products/:id`  | Update a product       |
| DELETE | `/products/:id`  | Delete a product       |

Interactive documentation: `GET /api-docs`

## Product fields (all required)

| Field        | Type   | Notes                 |
|--------------|--------|-----------------------|
| name         | string |                       |
| category     | string |                       |
| price        | number | >= 0                  |
| stock        | number | integer >= 0          |
| brand        | string |                       |
| description  | string |                       |

## Deploying to Render

1. Push this repo to GitHub (`.env` is gitignored and must never be committed).
2. Create a new Web Service on Render pointing at the repo.
3. Build command: `npm install` — Start command: `npm start`.
4. Add the `MONGODB_URI` config var in the Render dashboard.
