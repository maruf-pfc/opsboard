# OpsBoard: The All-in-One Task & Team Management Dashboard

![OpsBoard API Status](https://img.shields.io/website?label=API%20Status&style=for-the-badge&url=http%3A%2F%2Flocalhost%3A5000)
![Tech Stack](https://img.shields.io/badge/Tech-MERN%2BNext.js-blue.svg?style=for-the-badge)
![License](https://img.shields.io/badge/License-ISC-green.svg?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-22+-green.svg?style=for-the-badge)

**OpsBoard** is a comprehensive, full-featured internal management dashboard designed to bring clarity and efficiency to team workflows. Built as a reusable and scalable solution, it provides a centralized platform for task management, scheduling, payments, and internal communication, inspired by modern tools like Notion and ClickUp.

This repository contains the complete monorepo-style project, housing both the backend API and the frontend client application.

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 22
- **pnpm** >= 9.0.0
- **MongoDB** (local or cloud instance)

### Installation & Setup

1. **Clone the repository:**

   ```bash
   git clone <your-repo-url>
   cd opsboard
   ```

2. **Install dependencies:**

   ```bash
   pnpm install
   ```

3. **Set up environment variables:**

   ```bash
   # Copy environment files
   cp apps/api/.env.example apps/api/.env
   cp apps/dashboard/.env.example apps/dashboard/.env
   ```

4. **Configure environment variables:**

   ```env
   # apps/api/.env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/opsboard
   JWT_SECRET=your-super-secret-jwt-key
   NODE_ENV=development
   ```

5. **Start development servers:**

   ```bash
   # Start both frontend and backend
   pnpm dev

   # Or start individually
   pnpm --filter api dev
   pnpm --filter dashboard dev
   ```

6. **Access the applications:**
   - **Frontend Dashboard:** http://localhost:3000
   - **Backend API:** http://localhost:5000
   - **API Documentation:** http://localhost:5000/api/v1/docs

---

## ✨ Core Features

### 🔐 Authentication & Authorization

- **JWT-based Authentication** with secure token management
- **Role-Based Access Control (RBAC)** with three tiers:
  - `ADMIN`: Full system access
  - `MANAGER`: Limited administrative access
  - `MEMBER`: Basic user access
- **Protected Routes** on both frontend and backend
- **Session Management** with automatic token refresh

### 📋 Task Management

- **Kanban Board** with drag-and-drop functionality
- **Task Statuses**: TODO, IN_PROGRESS, IN_REVIEW, COMPLETED, BLOCKED
- **Priority Levels**: LOW, NORMAL, HIGH
- **Subtasks** and **Comments** system
- **Assignment** and **Reporting** to users
- **Estimated Time** tracking
- **Real-time Updates** with optimistic UI

### 🎯 Contest Management

- **Contest Creation** and **Assignment**
- **Platform Integration**: Leetcode, Vjudge
- **Status Tracking** with visual progress indicators
- **Priority Management** and **Time Estimation**
- **User Assignment** and **Reporting**

### 💻 Problem Solving

- **Problem Tracking** with Online Judge integration
- **Platform Support**: Leetcode, Vjudge
- **Location Management**: Google Classroom, Website
- **Status-based Organization** with drag-and-drop
- **Priority and Time Management**

### 👥 User Management

- **User Registration** and **Profile Management**
- **Role Assignment** and **Permissions**
- **Profile Images** with Cloudinary integration
- **User Statistics** and **Activity Tracking**

### 💰 Payment Management

- **Payment Tracking** with detailed records
- **Course Integration**: CPC, JIPC, Bootcamp
- **Batch Management** and **Class Organization**
- **Payment Status** tracking
- **Required Fields**: Course, Batch, Class validation

### 📧 Email Marketing

- **Campaign Management** with task assignment
- **User Assignment** and **Reporting**
- **Status Tracking** and **Progress Monitoring**
- **Priority Management** and **Time Estimation**

### 📚 Class Management

- **Class Scheduling** and **Organization**
- **Course Management**: CPC, JIPC, Bootcamp
- **Batch Organization** and **Class Numbers**
- **Status Tracking** and **Assignment**

### 🎥 Video Management

- **Video Organization** and **Categorization**
- **Platform Integration** and **URL Management**
- **Status Tracking** and **Assignment**
- **Priority Management** and **Time Estimation**

### 📊 Dashboard Analytics

- **Real-time Statistics** across all modules
- **User Activity** tracking and **Performance Metrics**
- **Payment Analytics** and **Revenue Tracking**
- **Task Completion** rates and **Progress Monitoring**
- **Interactive Charts** with Chart.js integration

---

## 🏗️ Project Architecture

### Monorepo Structure

```
opsboard/
├── apps/
│   ├── api/                 # Backend REST API
│   ├── dashboard/           # Frontend Next.js App
│   └── docs/               # Documentation Site
├── packages/
│   ├── ui/                 # Shared UI Components
│   ├── eslint-config/      # Shared ESLint Config
│   └── typescript-config/  # Shared TypeScript Config
└── turbo.json              # Turborepo Configuration
```

### Backend Architecture (`/apps/api`)

- **Framework**: Express.js with ES Modules
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with bcrypt password hashing
- **Validation**: Zod schema validation
- **Documentation**: Swagger/OpenAPI integration
- **Logging**: Winston logger with structured logging
- **File Upload**: Cloudinary integration

**Key Components:**

- **Models**: User, Task, Contest, Problem, Payment, Marketing, Class, Video, Comment
- **Controllers**: RESTful API controllers with async/await
- **Middleware**: Authentication, Authorization, Error handling
- **Routes**: Modular route organization
- **Utils**: Async handler, logger utilities

### Frontend Architecture (`/apps/dashboard`)

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS with custom components
- **State Management**: React Context + Custom Hooks
- **Forms**: React Hook Form with Zod validation
- **UI Components**: Headless UI + Heroicons
- **Charts**: Chart.js with react-chartjs-2
- **Drag & Drop**: @hello-pangea/dnd for Kanban boards

**Key Features:**

- **Responsive Design**: Mobile-first approach
- **Dark/Light Mode**: Theme support
- **Real-time Updates**: Optimistic UI patterns
- **Error Handling**: Toast notifications
- **Loading States**: Skeleton loaders
- **Accessibility**: ARIA labels and keyboard navigation

---

## 🛠️ Technology Stack

### Backend (`/apps/api`)

- **Runtime**: Node.js 18+
- **Framework**: Express.js 5.x
- **Database**: MongoDB with Mongoose 8.x
- **Authentication**: JWT + bcrypt
- **Validation**: Zod 3.x
- **Documentation**: Swagger/OpenAPI
- **File Storage**: Cloudinary
- **Logging**: Winston
- **Development**: Nodemon

### Frontend (`/apps/dashboard`)

- **Framework**: Next.js 15.x (App Router)
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 4.x
- **UI Components**: Headless UI + Heroicons
- **Forms**: React Hook Form + Zod
- **Charts**: Chart.js + react-chartjs-2
- **Drag & Drop**: @hello-pangea/dnd
- **Animations**: Framer Motion
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast

### Development Tools

- **Package Manager**: pnpm 9.x
- **Monorepo**: Turborepo
- **Linting**: ESLint with shared configs
- **Formatting**: Prettier
- **Type Checking**: TypeScript
- **Build Tool**: Next.js + Turborepo

---

## 📁 API Endpoints

### Authentication

- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/profile` - Get user profile
- `PUT /api/v1/auth/profile` - Update user profile

### Users

- `GET /api/v1/users` - Get all users (Admin/Manager)
- `GET /api/v1/users/:id` - Get user by ID
- `PUT /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user (Admin)

### Tasks

- `GET /api/v1/tasks` - Get all tasks
- `POST /api/v1/tasks` - Create task
- `GET /api/v1/tasks/:id` - Get task by ID
- `PUT /api/v1/tasks/:id` - Update task
- `DELETE /api/v1/tasks/:id` - Delete task

### Contests

- `GET /api/v1/contests` - Get all contests
- `POST /api/v1/contests` - Create contest
- `GET /api/v1/contests/:id` - Get contest by ID
- `PUT /api/v1/contests/:id` - Update contest
- `DELETE /api/v1/contests/:id` - Delete contest

### Problems

- `GET /api/v1/problems` - Get all problems
- `POST /api/v1/problems` - Create problem
- `GET /api/v1/problems/:id` - Get problem by ID
- `PUT /api/v1/problems/:id` - Update problem
- `DELETE /api/v1/problems/:id` - Delete problem

### Payments

- `GET /api/v1/payments` - Get all payments (Admin/Manager)
- `POST /api/v1/payments` - Create payment
- `GET /api/v1/payments/:id` - Get payment by ID
- `PUT /api/v1/payments/:id` - Update payment
- `DELETE /api/v1/payments/:id` - Delete payment

### Marketing

- `GET /api/v1/marketing` - Get all marketing tasks
- `POST /api/v1/marketing` - Create marketing task
- `GET /api/v1/marketing/:id` - Get marketing task by ID
- `PUT /api/v1/marketing/:id` - Update marketing task
- `DELETE /api/v1/marketing/:id` - Delete marketing task

### Classes

- `GET /api/v1/classes` - Get all classes
- `POST /api/v1/classes` - Create class
- `GET /api/v1/classes/:id` - Get class by ID
- `PUT /api/v1/classes/:id` - Update class
- `DELETE /api/v1/classes/:id` - Delete class

### Videos

- `GET /api/v1/videos` - Get all videos
- `POST /api/v1/videos` - Create video
- `GET /api/v1/videos/:id` - Get video by ID
- `PUT /api/v1/videos/:id` - Update video
- `DELETE /api/v1/videos/:id` - Delete video

### Statistics

- `GET /api/v1/stats/dashboard` - Dashboard statistics
- `GET /api/v1/stats/tasks` - Task statistics
- `GET /api/v1/stats/payments` - Payment statistics
- `GET /api/v1/stats/users` - User statistics

---

## 🔧 Development

### Available Scripts

**Root Level:**

```bash
pnpm dev          # Start all applications in development mode
pnpm build        # Build all applications
pnpm lint         # Lint all applications
pnpm format       # Format code with Prettier
pnpm check-types  # Type check all applications
```

**API (`/apps/api`):**

```bash
pnpm dev          # Start development server with nodemon
pnpm start        # Start production server
```

**Dashboard (`/apps/dashboard`):**

```bash
pnpm dev          # Start development server on port 3000
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm check-types  # Type check
```

### Environment Variables

**Backend (`/apps/api/.env`):**

```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/opsboard
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=development
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

**Frontend (`/apps/dashboard/.env`):**

```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api/v1
```

### Database Schema

**User Model:**

```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: Enum ['ADMIN', 'MANAGER', 'MEMBER'],
  profileImage: String (Cloudinary URL),
  createdAt: Date,
  updatedAt: Date
}
```

**Task Model:**

```javascript
{
  title: String,
  description: String,
  status: Enum ['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'COMPLETED', 'BLOCKED'],
  priority: Enum ['LOW', 'NORMAL', 'HIGH'],
  assignedTo: ObjectId (ref: User),
  reportedTo: ObjectId (ref: User),
  estimatedTime: String,
  subtasks: Array,
  comments: Array,
  createdAt: Date,
  updatedAt: Date
}
```

**Contest Model:**

```javascript
{
  courseName: Enum ['CPC', 'JIPC', 'Bootcamp'],
  batchNo: Number,
  contestName: String,
  platform: Enum ['Leetcode', 'Vjudge'],
  status: Enum ['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'COMPLETED', 'BLOCKED'],
  priority: Enum ['LOW', 'NORMAL', 'HIGH'],
  assignedTo: ObjectId (ref: User),
  reportedTo: ObjectId (ref: User),
  estimatedTime: String,
  createdAt: Date,
  updatedAt: Date
}
```

**Problem Model:**

```javascript
{
  courseName: Enum ['CPC', 'JIPC', 'Bootcamp'],
  batchNo: Number,
  problemName: String,
  onlineJudge: Enum ['Leetcode', 'Vjudge'],
  status: Enum ['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'COMPLETED', 'BLOCKED'],
  priority: Enum ['LOW', 'NORMAL', 'HIGH'],
  assignedTo: ObjectId (ref: User),
  reportedTo: ObjectId (ref: User),
  estimatedTime: String,
  platform: Enum ['Google Classroom', 'Website'],
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🚀 Deployment

### Docker Deployment

```bash
# Build the Docker image
docker build -t opsboard .

# Run the container
docker run -p 3000:3000 -p 5001:5001 opsboard
```

### Manual Deployment

**Backend:**

```bash
cd apps/api
npm install --production
npm start
```

**Frontend:**

```bash
cd apps/dashboard
npm install --production
npm run build
npm start
```

### Environment Setup for Production

1. Set `NODE_ENV=production`
2. Configure MongoDB connection string
3. Set secure JWT secret
4. Configure Cloudinary credentials
5. Set up reverse proxy (nginx) if needed

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Code Style

- Use Prettier for code formatting
- Follow ESLint rules
- Write meaningful commit messages
- Add TypeScript types where applicable

---

## 📄 License

This project is licensed under the ISC License. See the [LICENSE](LICENSE) file for details.

---

## 🆘 Support

- **Documentation**: Check the `/docs` directory for detailed guides
- **Issues**: Report bugs and feature requests via GitHub Issues
- **Discussions**: Join our GitHub Discussions for community support

---

**Tagline:** _OpsBoard: Where Teams Work in Sync._

---

<div align="center">
  <p>Built with ❤️ using Next.js, Express, MongoDB, and TypeScript</p>
  <p>Made for teams who want to work smarter, not harder.</p>
</div>
