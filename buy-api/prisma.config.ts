import { join } from "node:path";
import type { PrismaConfig } from "prisma";

export default {
  earlyAccess: true,
  schema: join("prisma", "schema.prisma"),
} satisfies PrismaConfig;
