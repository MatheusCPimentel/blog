# Blog Application

A full-stack blog application built with modern web technologies. This project consists of a React/Next.js frontend and a Node.js/Express backend with SQLite database.

## 🚀 Technologies Used

### Frontend

- **React 19** - Modern React with latest features
- **Next.js 15.3.4** - React framework with Turbopack for fast development
- **TypeScript** - Type-safe JavaScript
- **TanStack React Query** - Data fetching and state management
- **Tailwind CSS 4** - Utility-first CSS framework
- **Axios** - HTTP client for API requests
- **Zod** - Schema validation
- **Lucide React** - Beautiful SVG icons
- **React Toastify** - Toast notifications
- **Jest & React Testing Library** - Testing framework

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **TypeScript** - Type-safe JavaScript
- **Prisma ORM** - Database toolkit and ORM
- **SQLite** - Lightweight database
- **Zod** - Schema validation
- **CORS** - Cross-origin resource sharing
- **Jest & Supertest** - Testing framework

## 📁 Project Structure

```
blog/
├── front-end/          # Next.js React application
│   ├── src/
│   │   ├── app/        # Next.js app router
│   │   ├── components/ # React components
│   │   ├── hooks/      # Custom React hooks
│   │   ├── lib/        # Utility functions and API client
│   │   └── types/      # TypeScript type definitions
│   └── package.json
├── back-end/           # Express.js API server
│   ├── src/
│   │   ├── controllers/# Request handlers
│   │   ├── services/   # Business logic
│   │   ├── routes/     # API routes
│   │   ├── middleware/ # Custom middleware
│   │   └── types/      # TypeScript type definitions
│   ├── prisma/         # Database schema and seeds
│   └── package.json
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites

- Node.js 18+ installed on your system
- npm or yarn package manager

### 1. Clone the Repository

```bash
git clone https://github.com/MatheusCPimentel/blog
cd blog
```

### 2. Install Dependencies

Install backend dependencies:

```bash
cd back-end
npm install
```

Install frontend dependencies:

```bash
cd ../front-end
npm install
```

### 3. Database Setup

Navigate to the backend directory and set up the database:

```bash
cd back-end

# Generate Prisma client
npm run db:generate

# Create database and apply schema
npm run db:push

# Seed the database with sample data
npm run db:seed
```

## 🚀 Running the Application

### Development Mode

You need to run both frontend and backend servers simultaneously.

**Terminal 1 - Backend (API Server):**

```bash
cd back-end
npm run dev
```

The API server will start on `http://localhost:3001`

**Terminal 2 - Frontend (Next.js App):**

```bash
cd front-end
npm run dev
```

The frontend application will start on `http://localhost:3000`

### Production Mode

**Backend:**

```bash
cd back-end
npm run build
npm start
```

**Frontend:**

```bash
cd front-end
npm run build
npm start
```

## 🎯 Features

- **Post Management**: Create, read, update, and delete blog posts
- **Pagination**: View posts with pagination (3 posts per page)
- **Responsive Design**: Mobile-friendly interface
- **Real-time Updates**: Optimistic updates with React Query
- **Type Safety**: Full TypeScript support across the stack
- **Modern UI**: Clean and intuitive user interface with Tailwind CSS

## 📊 Database

The application uses SQLite as the database with the following model:

- **Post**: Blog posts with title, content, excerpt, slug, and view count

### Database Commands

```bash
cd back-end

# View database in Prisma Studio
npm run db:studio

# Reset database (recreate and reseed)
npm run db:push
npm run db:seed

# Generate Prisma client after schema changes
npm run db:generate
```

## 🧪 Testing

### Backend Tests

```bash
cd back-end
npm test                # Run tests once
npm run test:watch      # Run tests in watch mode
npm run test:coverage   # Run tests with coverage report
```

### Frontend Tests

```bash
cd front-end
npm test                # Run tests once
npm run test:watch      # Run tests in watch mode
npm run test:coverage   # Run tests with coverage report
```

## 🔧 API Endpoints

### Posts

- `GET /api/posts` - Get paginated list of posts
- `GET /api/posts/:id` - Get a specific post
- `POST /api/posts` - Create a new post
- `PUT /api/posts/:id` - Update a post
- `DELETE /api/posts/:id` - Delete a post

## 📝 Development Notes

- The backend runs on port 3001 to avoid conflicts with the Next.js frontend on port 3000
- SQLite database file is located at `back-end/prisma/dev.db`
- The seed script creates 5 sample posts to demonstrate pagination
- React Query is configured with optimistic updates for better UX
- All API responses are type-safe with shared TypeScript interfaces
