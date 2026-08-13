import { PrismaClient } from "../../database/node_modules/@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://neondb_owner:npg_eWbjNVE7Ii5X@ep-still-flower-aztxplmg.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({ adapter });
