import 'dotenv/config';
import { db } from './server/db.ts';
import { users } from './shared/schema.ts';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';

const email = 'naveedkhosa2006@gmail.com';
const password = 'Cs1212**';
const name = 'Naveed Khosa';

async function createAdmin() {
  try {
    console.log('🔐 Creating admin account...');
    console.log(`   Connecting to database...`);
    
    // Test database connection first
    try {
      await db.select().from(users).limit(1);
      console.log('   ✓ Database connection successful');
    } catch (dbError: any) {
      console.error('❌ Database connection failed!');
      console.error('   Please check your DATABASE_URL in .env file');
      console.error('   Error:', dbError.message);
      if (dbError.code === 'ECONNREFUSED') {
        console.error('   Make sure your PostgreSQL database is running');
      }
      process.exit(1);
    }
    
    // Check if user already exists
    const [existingUser] = await db.select().from(users).where(eq(users.email, email));
    
    if (existingUser) {
      console.log(`⚠️  User with email ${email} already exists.`);
      console.log('   Updating password and ensuring admin role...');
      
      const hashedPassword = await bcrypt.hash(password, 10);
      
      await db.update(users)
        .set({
          passwordHash: hashedPassword,
          role: 'admin',
        })
        .where(eq(users.id, existingUser.id));
      
      console.log('✅ Admin account updated successfully!');
      console.log(`   Email: ${email}`);
      console.log(`   Password: ${password}`);
      console.log(`   Role: admin`);
    } else {
      // Create new admin user
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const [newUser] = await db.insert(users).values({
        name,
        email,
        passwordHash: hashedPassword,
        role: 'admin',
      }).returning();
      
      console.log('✅ Admin account created successfully!');
      console.log(`   Name: ${newUser.name}`);
      console.log(`   Email: ${newUser.email}`);
      console.log(`   Password: ${password}`);
      console.log(`   Role: ${newUser.role}`);
    }
    
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Error creating admin account:', error.message);
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

createAdmin();

