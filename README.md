# 📚 BookHeaven - Full Stack Online Bookstore

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

**BookHeaven** is a feature-rich, responsive full-stack MERN (MongoDB, Express.js, React, Node.js) web application designed for online book shopping. It provides seamless user authentication, role-based access control (User and Admin), interactive book browsing, wishlisting, cart management, Razorpay payment gateway integration, and real-time order tracking.

---

## ✨ Features

### 👤 User Features
- **User Authentication & Profiles**: Secure registration, login, JWT token authentication, and profile management.
- **Book Discovery**: Explore an extensive catalog with detailed book information, titles, authors, pricing, and descriptions.
- **Favourites & Wishlist**: Easily add or remove favorite books for quick access.
- **Cart Management**: Add books to cart, modify quantities, view itemized price calculations, and clear cart items.
- **Payment Gateway Integration**: Secure and interactive checkout powered by Razorpay.
- **Order History & Tracking**: Track orders with status updates (*Placed*, *Out for Delivery*, *Delivered*, *Canceled*).

### 🛡️ Admin Features
- **Role-Based Access Control (RBAC)**: Dedicated admin controls for managing the bookstore platform.
- **Catalog Management**: Add new books, update existing book details, and delete out-of-stock or discontinued titles.
- **Order Dashboard**: View all user orders, update delivery statuses in real time, and manage customer fulfillment.

---

## 🛠️ Tech Stack

| Category | Technology / Library |
| :--- | :--- |
| **Frontend Framework** | React 19, Vite |
| **State Management** | Redux Toolkit, React-Redux |
| **Routing & UI** | React Router v7, React Icons, React Toastify |
| **Styling** | Tailwind CSS, PostCSS, Autoprefixer |
| **Backend Framework** | Node.js, Express.js (v5) |
| **Database & ORM** | MongoDB, Mongoose |
| **Authentication** | JSON Web Tokens (JWT), Bcrypt.js |
| **Payments** | Razorpay Node.js SDK & Frontend Checkout |
| **Development Tools** | Nodemon, ESLint |

---

## 📁 Repository Architecture

```
bookheaven/
├── backend/                  # Express.js REST API Server
│   ├── conn/                 # MongoDB Database Connection
│   ├── middleware/           # JWT & Auth Middlewares
│   ├── models/               # Mongoose Data Schemas (User, Book, Order)
│   ├── routes/               # API Route Handlers
│   │   ├── user.js           # Auth & User Routes
│   │   ├── book.js           # Book CRUD Operations
│   │   ├── favourite.js      # Wishlist Operations
│   │   ├── cart.js           # Shopping Cart Operations
│   │   ├── order.js          # Order Management
│   │   └── payment.js        # Razorpay Payment Gateway Routes
│   ├── scripts/              # Database Seed & Utility Scripts
│   ├── .env.example          # Sample Backend Environment Variables
│   └── app.js                # Express Application Entry Point
│
└── frontend/                 # React Frontend Application (Vite)
    ├── src/
    │   ├── components/       # Reusable UI Components
    │   ├── constants/        # App-wide Constants (Order Statuses, etc.)
    │   ├── pages/            # Views (Home, AllBooks, Cart, Profile, Admin, etc.)
    │   ├── store/            # Redux Store Configuration & Slices
    │   ├── App.jsx           # Root Application Component
    │   └── main.jsx          # React DOM Mount Entry Point
    ├── .env.example          # Sample Frontend Environment Variables
    ├── tailwind.config.js    # Tailwind CSS Configuration
    └── vite.config.js        # Vite Build Tool Configuration
```

---

## 🌐 REST API Endpoint Summary

All API endpoints are prefixed with `/api/v1`.

### 🔑 Auth & User Routes (`/api/v1`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/sign-up` | Register a new user | No |
| `POST` | `/sign-in` | Authenticate user & receive JWT token | No |
| `GET` | `/get-user-information` | Fetch current authenticated user info | Yes |
| `PUT` | `/update-address` | Update user shipping address | Yes |

### 📖 Book Routes (`/api/v1`)
| Method | Endpoint | Description | Role / Auth |
| :--- | :--- | :--- | :--- |
| `POST` | `/add-book` | Add a new book to the catalog | Admin |
| `PUT` | `/update-book` | Update details of an existing book | Admin |
| `DELETE` | `/delete-book` | Remove a book from the catalog | Admin |
| `GET` | `/get-all-books` | Retrieve list of all available books | Public |
| `GET` | `/get-recent-books` | Get recent addition books for showcase | Public |
| `GET` | `/get-book-by-id/:id` | Fetch detailed information for a specific book | Public |

### ❤️ Favourites & 🛒 Cart Routes (`/api/v1`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `PUT` | `/add-book-to-favourite` | Add book to user's favorites | Yes |
| `PUT` | `/remove-book-from-favourite` | Remove book from favorites | Yes |
| `GET` | `/get-favourite-books` | Fetch list of favorite books | Yes |
| `PUT` | `/add-to-cart` | Add book to user's cart | Yes |
| `PUT` | `/remove-from-cart/:bookid` | Remove item from cart | Yes |
| `GET` | `/get-user-cart` | Retrieve user cart items | Yes |

### 📦 Order & 💳 Payment Routes (`/api/v1`)
| Method | Endpoint | Description | Auth / Role |
| :--- | :--- | :--- | :--- |
| `POST` | `/place-order` | Place a direct order | User |
| `GET` | `/get-order-history` | Fetch user order history | User |
| `GET` | `/get-all-orders` | Fetch all orders in the system | Admin |
| `PUT` | `/update-status/:id` | Update order fulfillment status | Admin |
| `POST` | `/payment/create-order` | Create a Razorpay order ID | User |
| `POST` | `/payment/verify` | Verify Razorpay payment signature | User |

---

## 🚀 Getting Started

Follow these instructions to set up and run BookHeaven locally.

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas cluster)
- [Razorpay Account](https://razorpay.com/) (For test Key ID & Secret)

---

### 1. Clone the Repository

```bash
git clone https://github.com/vaibhavi466/BookHeaven.git
cd BookHeaven
```

---

### 2. Backend Setup

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the `backend/` directory by copying `.env.example`:
   ```bash
   cp .env.example .env
   ```
   Fill in your configuration details:
   ```env
   PORT=1000
   MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/bookheaven?retryWrites=true&w=majority
   JWT_SECRET=your_jwt_secret_key_here
   CLIENT_ORIGIN=http://localhost:5173
   NODE_ENV=development
   RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxxxx
   RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx
   ```

4. **Seed Sample Data** *(Optional)*:
   Populate your MongoDB database with sample book items:
   ```bash
   npm run seed
   ```

5. **Start Development Server**:
   ```bash
   npm run dev
   ```
   The backend API will run at `http://localhost:1000`.

---

### 3. Frontend Setup

1. **Navigate to the frontend directory**:
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the `frontend/` directory by copying `.env.example`:
   ```bash
   cp .env.example .env
   ```
   Fill in your environment values:
   ```env
   VITE_BASE_URL=http://localhost:1000/api/v1
   VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxxxx
   ```

4. **Start Development Server**:
   ```bash
   npm run dev
   ```
   The application will be accessible at `http://localhost:5173`.

---

## 📜 Available NPM Scripts

### Backend (`/backend`)
- `npm run dev` – Starts the API server with `nodemon` for auto-reloading.
- `npm start` – Runs the Express server in production mode.
- `npm run seed` – Populates the database with initial sample bookstore dataset.

### Frontend (`/frontend`)
- `npm run build` – Builds production-ready asset bundle into `dist/`.
- `npm run dev` – Starts Vite development server.
- `npm run preview` – Locally previews the production build.
- `npm run lint` – Runs ESLint check across source files.

---

## 📄 License

This project is open-source and licensed under the [ISC License](LICENSE).

---

Made with ❤️ by the **BookHeaven Team**.
