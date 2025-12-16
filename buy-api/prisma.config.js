import { join } from "path";
import { config } from "dotenv";

config();

export default {
  earlyAccess: true,
  schema: join("prisma", "schema.prisma"),
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
};
