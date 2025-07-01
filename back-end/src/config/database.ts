import { PrismaClient } from "@prisma/client";

export const db = new PrismaClient({
  log: ["error"],
});

process.on("beforeExit", async () => {
  await db.$disconnect();
});
