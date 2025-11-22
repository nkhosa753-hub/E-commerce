#!/usr/bin/env node

/**
 * Setup script to create .env file with required environment variables
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.join(__dirname, '.env');

// Check if .env already exists
if (fs.existsSync(envPath)) {
  console.log('⚠️  .env file already exists. Skipping creation.');
  console.log('   If you need to regenerate it, delete .env and run this script again.');
  process.exit(0);
}

// Generate a secure random secret
const sessionSecret = crypto.randomBytes(32).toString('hex');

// Default .env content
const envContent = `# Database Configuration
# Replace with your PostgreSQL connection string
# Format: postgresql://user:password@host:port/database
# For Neon: postgresql://user:password@ep-xxx-xxx.region.aws.neon.tech/dbname?sslmode=require
# For local PostgreSQL: postgresql://postgres:password@localhost:5432/ecommerce_pakistan
DATABASE_URL=postgresql://user:password@localhost:5432/ecommerce_pakistan

# JWT Secret Key (auto-generated secure random key)
SESSION_SECRET=${sessionSecret}

# Server Port (optional, defaults to 5000)
PORT=5000
`;

try {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env file created successfully!');
  console.log('');
  console.log('⚠️  IMPORTANT: Please update the DATABASE_URL with your actual database connection string.');
  console.log('   The SESSION_SECRET has been auto-generated and is secure.');
  console.log('');
  console.log('📝 Next steps:');
  console.log('   1. Edit .env and set your DATABASE_URL');
  console.log('   2. Run: npm run db:push (to set up database schema)');
  console.log('   3. Run: tsx server/seed.ts (to seed sample data)');
  console.log('   4. Run: npm run dev (to start the server)');
} catch (error) {
  console.error('❌ Error creating .env file:', error.message);
  process.exit(1);
}

