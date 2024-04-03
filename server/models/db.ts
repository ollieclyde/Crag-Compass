import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
dotenv.config();

const dataBaseURL =
  process.env.ENV === "test"
    ? process.env.TEST_DATABASE_URL
    : process.env.DATABASE_URL;

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: dataBaseURL,
    },
  },
});

export default prisma;
