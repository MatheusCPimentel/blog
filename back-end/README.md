# Simple Blog API

A simple blog API built with Node.js, TypeScript, Express, Prisma, and PostgreSQL. This project focuses on basic CRUD operations with user ownership validation for posts.

## Features

- **User Management**: Create, read, update, and delete users
- **Post Management**: Create, read, update, and delete posts
- **Ownership Validation**: Users can only edit/delete their own posts
- **Data Validation**: Input validation using Zod
- **Database**: PostgreSQL with Prisma ORM
- **TypeScript**: Full TypeScript support for type safety

## Tech Stack

- **Backend**: Node.js with Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Validation**: Zod
- **Testing**: Jest with Supertest

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd back-end
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
# Create .env file
DATABASE_URL="postgresql://username:password@localhost:5432/blog_db?schema=public"
PORT=3000
```

4. Set up the database:

```bash
# Generate Prisma client
npm run db:generate

# Push the schema to your database
npm run db:push

# Seed the database with sample data
npm run db:seed
```

5. Start the development server:

```bash
npm run dev
```

The API will be available at `http://localhost:3000`

## API Endpoints

### Users

- `POST /api/users` - Create a new user
- `GET /api/users` - Get all users (with pagination)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `GET /api/users/:id/stats` - Get user statistics

### Posts

- `POST /api/posts` - Create a new post
- `GET /api/posts` - Get all posts (with pagination)
- `GET /api/posts/published` - Get only published posts
- `GET /api/posts/:id` - Get post by ID
- `GET /api/posts/slug/:slug` - Get post by slug
- `PUT /api/posts/:id` - Update post (owner only)
- `DELETE /api/posts/:id` - Delete post (owner only)
- `GET /api/posts/author/:authorId` - Get posts by author

## Database Schema

### User

- `id`: String (Primary Key)
- `email`: String (Unique)
- `name`: String
- `bio`: String (Optional)
- `avatar`: String (Optional)
- `isActive`: Boolean
- `createdAt`: DateTime
- `updatedAt`: DateTime

### Post

- `id`: String (Primary Key)
- `title`: String
- `content`: String
- `excerpt`: String (Optional)
- `slug`: String (Unique, Optional)
- `published`: Boolean
- `viewCount`: Integer
- `publishedAt`: DateTime (Optional)
- `authorId`: String (Foreign Key)
- `createdAt`: DateTime
- `updatedAt`: DateTime

## Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the project
- `npm run start` - Start production server
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:seed` - Seed database with sample data
- `npm run db:studio` - Open Prisma Studio

### Testing

Run the test suite:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

## Ownership Validation

The API includes basic ownership validation for posts:

- Any user can create posts
- Users can only edit their own posts
- Users can only delete their own posts

**Note**: This is a simplified implementation. In a production application, you would implement proper authentication middleware to handle user sessions and authorization.

## Project Structure

```
src/
├── app.ts              # Express app setup
├── config/             # Configuration files
│   ├── index.ts        # Main config
│   └── database.ts     # Database connection
├── controllers/        # Route controllers
│   ├── userController.ts
│   └── postController.ts
├── middleware/         # Custom middleware
│   ├── errorHandler.ts
│   └── validation.ts
├── routes/             # API routes
│   ├── index.ts
│   ├── userRoutes.ts
│   └── postRoutes.ts
├── services/           # Business logic
│   ├── userService.ts
│   └── postService.ts
├── types/              # TypeScript type definitions
│   └── index.ts
└── tests/              # Test files
    ├── setup.ts
    ├── userController.test.ts
    └── userService.test.ts
```

## License

MIT
