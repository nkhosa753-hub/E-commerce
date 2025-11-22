import 'dotenv/config';
import * as schema from "@shared/schema";
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

const databaseUrl = process.env.DATABASE_URL;

// Detect if it's a Neon database (cloud) or local PostgreSQL
const isNeonDatabase = databaseUrl.includes('neon.tech') || databaseUrl.includes('ep-');

// Initialize database connection
let db: any;
let pool: any;

// Use standard pg driver for local PostgreSQL (default)
if (!isNeonDatabase) {
  const { Pool } = require('pg');
  const { drizzle } = require('drizzle-orm/node-postgres');
  
  pool = new Pool({ connectionString: databaseUrl });
  db = drizzle({ client: pool, schema });
} else {
  // Use Neon serverless driver for cloud Neon databases
  const { Pool, neonConfig } = require('@neondatabase/serverless');
  const { drizzle } = require('drizzle-orm/neon-serverless');
  const ws = require("ws");
  
  neonConfig.webSocketConstructor = ws;
  pool = new Pool({ connectionString: databaseUrl });
  db = drizzle({ client: pool, schema });
}

export { pool, db };
