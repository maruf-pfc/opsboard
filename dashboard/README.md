# OpsBoard: The All-in-One Task & Team Management Dashboard

![OpsBoard API Status](https://img.shields.io/website?label=API%20Status&style=for-the-badge&url=http%3A%2F%2Flocalhost%3A5001)
![Tech Stack](https://img.shields.io/badge/Tech-MERN%2BNext.js-blue.svg?style=for-the-badge)

**OpsBoard** is a full-featured, internal management dashboard designed to bring clarity and efficiency to team workflows. Built as a reusable and scalable solution, it provides a centralized platform for task management, scheduling, payments, and internal communication, inspired by modern tools like Notion and ClickUp.

This repository contains the complete monorepo-style project, housing both the backend API and the frontend client application.

---

## ✨ Core Features

- **✅ Full Task Management**: Create, assign, and track tasks on a dynamic Kanban board. Includes support for subtasks, comments, priorities, and statuses (`TODO`, `IN_PROGRESS`, `IN_REVIEW`, `COMPLETED`, `BLOCKED`).
- **🔐 Robust Authentication**: Secure JWT-based authentication with user registration, login, and logout.
- **🛡️ Role-Based Access Control**: Three-tiered user roles (`ADMIN`, `MANAGER`, `MEMBER`) to protect routes and features on both the frontend and backend.
- **📊 Dynamic Dashboard**: An at-a-glance overview of key statistics across tasks, users, payments, and classes.
- **🗂️ Module-Based Features**: Dedicated pages for managing:
  - Classes & Schedules
  - Problem Solving Videos
  - Contests
  - Trainer Payments
  - Email Marketing Campaigns
- **👑 Admin Panel**: A secure area for administrators to manage users and system settings.
- **📄 API Documentation**: Integrated Swagger UI for interactive and comprehensive API documentation.

---

## 🏛️ Project Architecture

This project is architected with a decoupled frontend and backend for maximum scalability and maintainability.

- **`/opsboard-server`**: A robust REST API built with Node.js, Express, and MongoDB. It handles all business logic, database interactions, and authentication.
- **`/opsboard-client`**: A modern, fast, and interactive frontend built with Next.js (App Router) and styled with Tailwind CSS. It consumes data from the backend API.

See the README files within each directory for specific setup and technical details.

## 🚀 Getting Started

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd opsboard-final-project
    ```
2.  **Set up the Backend:** Navigate to the `opsboard-server` directory and follow the instructions in its `README.md` file.
3.  **Set up the Frontend:** Navigate to the `opsboard-client` directory and follow the instructions in its `README.md` file.
4.  Run both applications concurrently to experience the full platform.

---

**Tagline:** _OpsBoard: Where Teams Work in Sync._

````

---

#### **2. Frontend README (`/opsboard-client/README.md`)**

```markdown
# OpsBoard Frontend Client

This directory contains the Next.js frontend application for OpsBoard, built with the App Router, TypeScript, and Tailwind CSS.

## ✨ Features

-   **Modern UI/UX**: Built with Next.js 14 (App Router) for optimal performance and developer experience.
-   **Type-Safe**: Fully written in TypeScript to ensure code quality and reduce bugs.
-   **Styled with Tailwind CSS**: A utility-first CSS framework for rapid, clean, and responsive UI development.
-   **Smooth Animations**: Utilizes Framer Motion for delightful and meaningful UI animations.
-   **Component-Based Architecture**: UI is broken down into reusable and logical components (e.g., Pages, Tables, Modals, Cards).
-   **Protected Routes**: Implements client-side route guards (`ProtectedRoute`, `AdminRoute`) to protect pages based on user authentication and role.
-   **Global State Management**: Uses React Context (`AuthContext`) for managing user authentication state across the application.

---

## 🔧 Tech Stack

| Layer | Technology |
| :--- | :--- |
| Framework | **Next.js (App Router)** |
| Language | **TypeScript** |
| Styling | **Tailwind CSS** |
| Animation | **Framer Motion** |
| API Communication | **Axios** |
| Form Management | **React Hook Form** (recommended for future use) |
| Notifications | **React Hot Toast** |
| Date Formatting | **date-fns** |
| Package Manager | **pnpm** |

---

## 🚀 Setup & Running Locally

### Prerequisites

-   Node.js (v18 or later)
-   pnpm (`npm install -g pnpm`)
-   A running instance of the `opsboard-server` backend.

### 1. Installation

Navigate to this directory and install the dependencies.

```bash
cd opsboard-client
pnpm install
````

### 2. Environment Variables

Create a `.env.local` file in the root of the `opsboard-client` directory. This file tells the frontend where to find the backend API.

```.env
# opsboard-client/.env.local

# URL should point to your backend's versioned API endpoint
NEXT_PUBLIC_API_URL=http://localhost:5001/api/v1
```

### 3. Running the Development Server

Start the Next.js development server.

```bash
pnpm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000). The page will auto-reload if you make edits.
