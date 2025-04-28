import { PrismaClient } from "@/app/generated/prisma";

const globalForPrisma = global as unknown as { prisma: PrismaClient }
//global is a huge object in node.js where you can temporarily store things that you want available everywhere (similar to window in browser Javascript)
// as unknown as { prisma: PrismaClient } 
// as unknown: Temporarily makes global type "unknown" (because you can't directly cast from global to a specific type).
// as { prisma: PrismaClient }: Now we tell TypeScript, "treat this global object as if it has a property called prisma of type PrismaClient."

const prisma = globalForPrisma.prisma || new PrismaClient()
// Try to reuse the existing Prisma client if it already exists (globalForPrisma.prisma).Otherwise (||), create a new instance of PrismaClient().

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
// Only in development: Save the Prisma client to the global object to avoid multiple connections.(hot reloading)

export default prisma