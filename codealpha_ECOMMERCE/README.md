# CodeAlphaStore

CodeAlphaStore is a complete, basic e-commerce application built with a responsive
HTML/CSS/vanilla JavaScript frontend and an Express, MongoDB, and Mongoose
backend.

## Features

- Product browsing, search, category filtering, and product details
- LocalStorage shopping cart with quantity and stock limits
- User registration with bcrypt password hashing
- JWT login and protected checkout/order APIs
- Checkout with shipping information and stock-aware order creation
- Authenticated order history
- Admin dashboard for product and order management
- Responsive mobile navigation and loading/error/empty states

## Technology

Node.js, Express.js, MongoDB, Mongoose, bcryptjs, JSON Web Tokens, HTML5,
CSS3, and vanilla JavaScript.

## Installation

1. Install Node.js 18+ and MongoDB (local service or MongoDB Atlas).
2. Install dependencies:

   ```bash
   cd backend
   npm install
   ```

3. From the `backend` directory, copy `.env.example` to `.env` and set the values:

   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/codealphastore
   JWT_SECRET=replace_with_a_long_random_secret
   ```

4. Start from the backend directory and seed sample products:

   ```bash
   cd backend
   npm run seed
   ```

5. Start the server from `backend`:

   ```bash
   cd backend
   npm start
   ```

Open <http://localhost:5000>. The Express server serves the `frontend`
directory, so no separate frontend server is required. For development, use
`npm run dev` if nodemon is installed.

## Admin dashboard

Run `npm run seed` once to create the sample administrator:

```text
Email: admin@example.com
Password: Admin123!
```

Open `http://localhost:5000/login.html` and sign in with that account. Admin
users are redirected to `admin.html`, where they can add, edit, and delete
products and update order statuses. The dashboard is protected in both the
browser and the backend; product and admin-order API requests require an admin
JWT.

## API endpoints

### Authentication

- `POST /api/auth/register`
- `POST /api/auth/login`

### Products

- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/products`
- `PUT /api/products/:id`
- `PATCH /api/products/:id`
- `DELETE /api/products/:id`

Product write endpoints require a valid JWT.

### Orders

- `POST /api/orders` (authenticated)
- `GET /api/orders` (authenticated)
- `GET /api/orders/:id` (authenticated)

Send the token as `Authorization: Bearer <token>`.

## Project structure

```text
frontend/                 Static pages, styles, and browser JavaScript
backend/server.js         Express application
backend/package.json      Backend dependencies and scripts
backend/config/           MongoDB connection
backend/models/            User, Product, and Order schemas
backend/controllers/      Request handlers
backend/routes/            API routes
backend/middleware/       Authentication and error middleware
backend/seed/              Sample product importer
```
