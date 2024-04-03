import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
dotenv.config();

// Better error handling or fallbacks for database URLs
const dataBaseURL =
  process.env.ENV === "test"
    ? process.env.TEST_DATABASE_URL
    : process.env.DATABASE_URL;

if (!dataBaseURL) {
  throw new Error("Database URL is not set.");
}

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: dataBaseURL,
    },
  },
});

export default prisma;
