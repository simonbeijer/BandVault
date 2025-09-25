/**
 * Prisma Database Client Configuration
 * 
 * Properly typed Prisma client with global instance management
 * for development hot-reload prevention and production optimization.
 */

import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

/**
 * Global Prisma client instance
 * 
 * In development, we store the client on the global object to prevent
 * multiple instances being created during hot-reload cycles.
 */
const prisma = global.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV === 'development') {
  global.prisma = prisma;
}

export { prisma };
export default prisma;
