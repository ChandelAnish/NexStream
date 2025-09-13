import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient }; // This creates a type-safe way to attach the Prisma client to the Node.js global object. The TypeScript casting (as unknown as { prisma: PrismaClient }) is necessary because TypeScript doesn't recognize custom properties on the global object by default.
// We’re using the global object (like a shared memory) to store the Prisma client. This trick helps prevent creating a new database connection every time in development mode (like when the app hot reloads).

export const prisma = globalForPrisma.prisma || new PrismaClient(); // This line checks if there's already a Prisma client instance attached to the global object. If not, it creates a new one. This is the core of the singleton pattern - we only want one PrismaClient instance across our application.

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
/*
stores the client in the global object, but only in development mode.

Actually we use global just as a storage.

During development in Next.js, your code gets reloaded frequently as you make changes. Without this line, each reload would create a new Prisma client and a new database connection. This could quickly lead to too many database connections, causing errors.

By storing the Prisma client on the global object, we ensure that even when your code reloads during development, it will reuse the existing Prisma client instead of creating a new one each time.
*/


export default prisma;
// both a named export and a default export for prisma in the same file. It's providing flexibility for how other files can import the Prisma client. With this pattern, developers have two ways to import the Prisma client Using the default or named import