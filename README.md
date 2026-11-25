# NIKK AURA | Modern Luxury E-Commerce Platform

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-amber?style=for-the-badge&logo=vercel)](https://aura-ecommerce-eight-ashen.vercel.app/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github)](https://github.com/nikhilkumarpaliwal2006-dot/aura-ecommerce)

> **Live Store**: [https://aura-ecommerce-eight-ashen.vercel.app/](https://aura-ecommerce-eight-ashen.vercel.app/)  
> **GitHub Repository**: [https://github.com/nikhilkumarpaliwal2006-dot/aura-ecommerce](https://github.com/nikhilkumarpaliwal2006-dot/aura-ecommerce)

A production-grade, full-stack luxury e-commerce web platform engineered with a clean separated architecture:
- **Backend**: Node.js, Express, RESTful APIs, JWT Auth, Bcrypt, MongoDB Atlas / persistent atomic JSON store.
- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, Canvas Confetti, and Web Audio API synthesis.

---

## 🌟 Latest Updates & New Features

### 📦 Real-Time Order Tracking & Milestone Timeline
- **Live Logistics Tracking Modal**: Visual tracking timeline matching professional logistics interfaces with status cards:
  - 🟢 **Status Card**: `Order Shipped` / `Delivered` with live pulse radar indicator.
  - 🔵 **Estimated Delivery Date Card**: Clear date calculation based on dispatch schedule.
  - **Step-by-Step Vertical Milestones**:
    1. **Placed**: Order received & verified in NIKK AURA vault.
    2. **Processing**: White-glove inspection & tamper-proof luxury seal applied.
    3. **In Transit**: Dispatched via Blue Dart Air Priority Express with live location tracking.
    4. **Delivered**: Handover with contactless OTP verification.
- **Multi-Order Switcher & AWB Copy**: Switch between orders (`ord_7824`, `ord_6219`) with 1-click AWB copying and printable receipts.
- **Prominent Navigation Points**:
  - Top header `📦 Track Orders [LIVE]` glowing button.
  - Persistent bottom-left floating dock pill `TRACK ORDERS [LIVE 📍]`.
  - Direct 1-click tracking access from the Post-Purchase Celebration Popup.

### 🎨 Bidirectional Variant & Image Gallery Sync
- **Interactive Color & Variety Switching**: Clicking any color variety (e.g. *Silver Titanium*, *Matte Obsidian*, *Champagne Gold*) dynamically syncs to the corresponding product image.
- **Smooth Swiping Gallery Animation**: Smooth transition between gallery views with active indicators and arrow controls.
- **Similar & Complementary Products**: Curated recommended pieces placed below the product image with 1-click Direct Buy and Add to Bag.

### ⚡ Direct Buy & Audio Experience
- **1-Click Express Direct Buy**: Instant purchase modal bypassing the cart for fastest checkout.
- **Continuous Ambient & Sound Effects**: Toggleable high-fidelity sound synthesis and victory fanfare on order celebration.
- **Minimalist Monolith Wireless Charger**: Dedicated high-resolution imagery and direct catalog navigation.

---

## 🛍️ Core Shopping Experience
- **Luxury Visual Design**: Editorial photography, crisp typography (Plus Jakarta Sans & Playfair Display), smooth micro-interactions.
- **Hero Showcase Slider**: Auto-rotating hero with continuous video showcase, high-impact visuals, and direct CTA.
- **Real-Time Fuzzy Search & Direct Location**: Live auto-suggestions dropdown with direct scroll & highlight to the target product.
- **Faceted Catalog Filtering**: Category pills (Electronics, Fashion, Living, Accessories), price range buckets, rating filters, and in-stock toggle.
- **Interactive Review System**: Verified customer ratings, feedback submission, and real-time average calculation.
- **Royal Celebration Popup**: Gold confetti fireworks, order confirmation, and seamless transition to live tracking.
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
