# VOLT — Full-Stack E-Commerce Engine

A secure, full-stack e-commerce web application built with the MERN stack, featuring JWT authentication, a persistent shopping cart, and Stripe-powered checkout with real-time inventory management.

> Built as part of a full-stack development internship task — expanded into a portfolio-ready project.

---

## Features

- **Secure Authentication** — User registration and login with hashed passwords (bcrypt) and JWT-based session management
- **Product Catalog** — Browse products with real-time stock indicators and category organization
- **Persistent Shopping Cart** — Cart state is saved per-user in the database, not just in browser memory
- **Stripe Checkout Integration** — Secure payment processing via Stripe's sandbox environment; card data never touches the backend
- **Server-Side Price Verification** — Order totals are always recalculated on the backend from live database prices, never trusted from the client
- **Automatic Inventory Adjustment** — Product stock is only reduced after the backend independently verifies payment success with Stripe
- **Responsive, Branded UI** — Custom dark-themed design system with a consistent visual identity across every page

---

## Tech Stack

**Frontend**
- React (via Vite)
- React Router
- Axios
- Stripe.js / React Stripe.js
- Custom CSS design system

**Backend**
- Node.js / Express
- MongoDB with Mongoose
- JSON Web Tokens (JWT)
- bcrypt.js
- Stripe API (sandbox/test mode)

---

## Project Structure

```
E-Commerce Engine/
├── server/               # Express backend
│   ├── models/           # Mongoose schemas (User, Product, Cart)
│   ├── routes/           # API routes (auth, products, cart, checkout)
│   ├── middleware/       # JWT auth middleware
│   ├── public/images/    # Product images (served statically)
│   ├── seed.js           # Database seed script
│   └── index.js          # App entry point
│
└── client/               # React frontend
    ├── src/
    │   ├── api/           # Axios instance with auth interceptor
    │   ├── context/       # Global auth context
    │   ├── components/    # Navbar and shared UI
    │   └── pages/         # Products, Cart, Checkout, Login, Register
    └── index.html
```

---

## Getting Started

### Prerequisites

- Node.js (v18 or later recommended)
- A free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster
- A free [Stripe](https://dashboard.stripe.com/register) account (sandbox/test mode)

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd "E-Commerce Engine"

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 2. Configure Environment Variables

**`server/.env`**
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_random_secret_string
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
PORT=5000
```

**`client/.env`**
```
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

### 3. Add Product Images

Place your product photos in `server/public/images/` (see `seed.js` for expected filenames), then seed the database:

```bash
cd server
node seed.js
```

### 4. Run the App

```bash
# Terminal 1 — backend
cd server
npm run dev

# Terminal 2 — frontend
cd client
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## Testing Payments

This project uses **Stripe's sandbox (test mode)** — no real transactions occur. Use these official test cards:

| Scenario | Card Number | Expected Result |
|---|---|---|
| Successful payment | `4242 4242 4242 4242` | Payment succeeds, stock decreases, cart clears |
| Card declined | `4000 0000 0000 0002` | Clean error shown, no inventory change |
| Insufficient funds | `4000 0000 0000 9995` | Clean error shown, no inventory change |

For all test cards: use any future expiry date, any 3-digit CVC, and any 5-digit ZIP code.

---

## Security Notes

- Passwords are hashed with bcrypt before storage — plain-text passwords are never saved
- JWTs are used to authenticate protected routes (cart, checkout) via middleware
- Card details are captured entirely within Stripe's hosted `CardElement` — they never pass through this application's backend
- Checkout totals are always calculated server-side from current database prices, preventing client-side price tampering
- Inventory is only adjusted after the backend independently re-verifies payment status directly with Stripe's API

---

## Roadmap / Future Improvements

- [ ] Migrate inventory confirmation to Stripe **webhooks** for production-grade reliability
- [ ] Product search and category filtering
- [ ] Order history for logged-in users
- [ ] Admin dashboard for managing products and stock
- [ ] Deployment (Vercel for frontend, Render/Railway for backend)

---

## License

This project was built for educational and portfolio purposes.
