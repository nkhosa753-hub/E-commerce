#!/usr/bin/env node
/**
 * Test script to verify admin user exists and password is correct
 * Usage: npx tsx test-auth.ts
 */

import 'dotenv/config';
import { db } from './server/db.ts';
import { users } from './shared/schema.ts';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';

async function testAuth() {
  console.log('🔐 Testing authentication setup...\n');

  try {
    // Test database connection
    console.log('📊 Database Connection:');
    const allUsers = await db.select().from(users);
    console.log(`   ✓ Connected to database`);
    console.log(`   ✓ Found ${allUsers.length} users\n`);

    if (allUsers.length === 0) {
      console.warn('   ⚠️  No users in database! Run "npm run seed" to create admin users.\n');
      return;
    }

    // Check for admin users
    console.log('👥 Users in database:');
    allUsers.forEach((user: any) => {
      console.log(`   • ${user.email} (role: ${user.role})`);
    });
    console.log();

    // Test login credentials
    const testCredentials = [
      { email: 'admin@pakshop.com', password: 'admin123' },
      { email: 'naveedkhosa2006@gmail.com', password: 'Cs1212**' },
    ];

    console.log('🔑 Testing login credentials:');
    for (const cred of testCredentials) {
      const [user] = await db.select().from(users).where(eq(users.email, cred.email));
      
      if (!user) {
        console.log(`   ✗ ${cred.email}`);
        console.log(`      → User not found in database\n`);
        continue;
      }

      const isValid = await bcrypt.compare(cred.password, user.passwordHash);
      console.log(`   ${isValid ? '✓' : '✗'} ${cred.email}`);
      console.log(`      → Password: ${isValid ? 'VALID ✓' : 'INVALID ✗'}`);
      console.log(`      → Role: ${user.role}\n`);
    }

    console.log('✅ Authentication test complete!\n');
    console.log('📝 To use in your app:');
    console.log('   POST /api/v1/auth/login');
    console.log('   Body: { "email": "admin@pakshop.com", "password": "admin123" }\n');

  } catch (error: any) {
    console.error('❌ Error:', error.message);
    console.error('\nTroubleshooting:');
    console.error('   1. Check DATABASE_URL in .env file');
    console.error('   2. Ensure database is running');
    console.error('   3. Run "npm run seed" to create admin users');
    console.error('   4. Check database logs for connection errors\n');
    process.exit(1);
  }
}

testAuth();
