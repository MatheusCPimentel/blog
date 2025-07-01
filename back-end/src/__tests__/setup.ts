// Mock environment variables
process.env.NODE_ENV = "test";
process.env.DATABASE_URL = "file:./test.db";

// Mock Prisma database
jest.mock("../config/database", () => ({
  db: {
    post: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  },
}));
