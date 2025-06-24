# OpsBoard Backend API

This directory contains the Node.js/Express backend API for the OpsBoard application. It provides a secure, versioned REST API for all data and business logic.

## ✨ Features

- **Robust REST API**: Built with Express.js for handling all HTTP requests.
- **Database Integration**: Uses Mongoose ODM for elegant and powerful interaction with a MongoDB database.
- **API Versioning**: All API routes are prefixed with `/api/v1` for future-proofing.
- **Secure Endpoints**: Middleware for JWT authentication (`protect`) and role-based authorization (`admin`).
- **Scalable Architecture**: Code is organized by feature (routes, controllers, models) with a clean separation of concerns.
- **Best Practices**:
  - Centralized error handling.
  - `asyncHandler` utility to avoid repetitive `try/catch` blocks.
  - HTTP request logging with Morgan.
  - Comprehensive environment variable management with `dotenv`.
- **Interactive API Docs**: Integrated with Swagger UI for live API testing and documentation, available at the `/api-docs` endpoint.

---

## 🔧 Tech Stack

| Layer             | Technology                |
| :---------------- | :------------------------ |
| Runtime           | **Node.js**               |
| Framework         | **Express.js**            |
| Database          | **MongoDB**               |
| ODM               | **Mongoose**              |
| Authentication    | **JSON Web Tokens (JWT)** |
| API Documentation | **Swagger**               |
| Logging           | **Morgan**                |
| Package Manager   | **pnpm**                  |

---

## 🚀 Setup & Running Locally

### Prerequisites

- Node.js (v22 or later)
- pnpm (`npm install -g pnpm`)
- Access to a MongoDB database (e.g., a free cluster from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)).

### 1. Installation

Navigate to this directory and install the dependencies.

```bash
cd opsboard-server
pnpm install
```

### 2. Environment Variables

Create a `.env` file in the root of the `opsboard-server` directory. This file stores your secret keys and database connection string. **This file should not be committed to Git.**

```.env
# api/.env

PORT=5000
NODE_ENV=development

# Get this connection string from your MongoDB Atlas cluster
MONGO_URI="your_mongodb_connection_string"

# Generate a strong, random string for your JWT secret
JWT_SECRET="your_super_secret_jwt_key"
```

### 3. Running the Development Server

Start the Express server using Nodemon, which will automatically restart on file changes.

```bash
pnpm run dev
```

The API server will be available at [http://localhost:5000/api/v1](http://localhost:5000/api/v1)

- **API Status**: [http://localhost:5000/](http://localhost:5000/)
- **API Docs**: [http://localhost:5000/api/v1/api-docs](http://localhost:5000/api/v1/api-docs)
