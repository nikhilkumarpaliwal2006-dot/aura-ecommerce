# AURA | Modern Luxury E-Commerce Platform

A production-grade, full-stack e-commerce web platform engineered with a clean separated architecture:
- **Backend**: Node.js, Express, RESTful APIs, JWT Auth, Bcrypt, and persistent atomic data layer.
- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, and Canvas Confetti animations.

---

## 🌟 Highlights & Key Features

### 🛍️ Client Shopping Experience
- **Luxury Visual Design**: Editorial photography, crisp typography (Plus Jakarta Sans), smooth micro-interactions.
- **Hero Showcase Slider**: Auto-rotating hero with high-impact visuals, value propositions, and direct CTA.
- **Real-Time Fuzzy Search**: Live auto-suggestions dropdown as you type.
- **Faceted Catalog Filtering**: Category pills (Electronics, Fashion, Living, Accessories), price range slider, rating filters, and in-stock toggle.
- **Product Experience**: Multi-image gallery with thumbnail selection, color & size variant selectors, inventory urgency indicator, specs list, and verified customer reviews.
- **Interactive Review System**: Customers can submit verified ratings and comments that instantly update the product's average score.
- **Slide-Over Cart Drawer**: Free shipping progress bar ($100 goal), quantity adjustments, promo coupons (`WELCOME10`, `AURA20`, `FLAT30`), item deletion, and live tax/shipping computation.
- **3-Step Checkout Flow**:
  1. Shipping & Contact information form.
  2. Delivery speed selector (Standard Free Ground vs. Express Priority 1-2 Days).
  3. Simulated payment methods (Credit Card, Apple Pay, Cash on Delivery).
- **Celebratory Order Placed**: Fireworks confetti, order reference tracking code, arrival date estimate, and printable invoice receipt.
- **Persistent Wishlist**: Save favorite items to localStorage and move directly to bag with one click.
- **Order Tracking**: Enter any Order ID (e.g. `ord_1001`) to see real-time delivery progress (`Pending` ➔ `Processing` ➔ `Shipped` ➔ `Delivered`).

### 👑 Store Administration & Inventory
- **KPI Metrics**: Real-time Gross Revenue, Order Volume, Active SKUs, and Low Stock (<15 units) alerts.
- **Order Dispatch Manager**: View all customer orders and advance shipping status via interactive selector.
- **Inventory Management**: Add new products to the live store with image URL, pricing, category, and stock counts. Inline delete and edit capabilities.
- **Category Sales Breakdown**: Visual revenue distribution charts across product verticals.

---

## 🔑 Pre-Configured Demo Accounts (1-Click Login Supported)

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Store Admin** | `admin@aura.com` | `admin123` | Full access to Admin Panel, orders, inventory, and revenue stats |
| **Customer** | `demo@aura.com` | `password123` | Shopping, cart, checkout, order tracking, writing reviews |

> *Tip: You can also register any new customer account or checkout as guest!*

---

## 🎟️ Active Promotional Coupon Codes

- `WELCOME10`: 10% off entire order (Min $50)
- `AURA20`: 20% off luxury orders over $150
- `FLAT30`: Flat $30 discount on orders over $200

---

## 🚀 Running the Project

### 1. Start the Backend API Server
```bash
cd backend
npm run dev
```
Backend runs on **http://localhost:5000**
- Health check: `http://localhost:5000/api/v1/health`
- Products API: `http://localhost:5000/api/v1/products`

### 2. Start the Frontend Application
In another terminal:
```bash
cd frontend
npm run dev
```
Frontend runs on **http://localhost:3000** (proxies `/api` calls directly to the Express server).

---

## 🏗️ Directory Architecture

```
aura-ecommerce/
├── backend/
│   ├── src/
│   │   ├── config/          # Environment & constants
│   │   ├── controllers/     # Auth, Products, Orders, Coupons, Admin
│   │   ├── db/              # Atomic JSON storage & realistic seed catalog
│   │   ├── middleware/      # JWT auth & Admin RBAC verification
│   │   ├── routes/          # Express route definitions
│   │   └── server.js        # Server bootstrap & CORS
│   ├── data/                # Persistent store.json database
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/             # Unified REST client with JWT interceptor
│   │   ├── components/      # Navbar, Hero, Cart, Checkout, Admin, etc.
│   │   ├── context/         # AuthContext & CartContext
│   │   ├── App.jsx          # Root view orchestrator
│   │   ├── index.css        # Tailwind styling & glassmorphism
│   │   └── main.jsx         # React DOM mount
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
└── README.md
```
