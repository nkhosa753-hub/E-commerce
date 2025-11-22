## 🔐 Admin Authentication Guide

### Problem Solved
The 401 "Invalid credentials" errors on Render deployment were caused by the **admin user not being created in the deployed database**. The build process was only running schema migrations (`drizzle-kit push`) but not seeding the admin user.

### Solution Implemented
1. **Auto-seed on deploy**: Added `npm run seed` to the build chain
2. **Build script sequence**:
   ```bash
   build:client → build:server → db:setup → seed
   ```
3. **Detailed logging**: Added authentication logs to debug future issues

### Admin Credentials

#### Default Admin Account
```
Email: admin@pakshop.com
Password: admin123
```

#### Naveed Khosa Account
```
Email: naveedkhosa2006@gmail.com
Password: Cs1212**
```

### Testing Authentication Locally
Run the test script to verify admin setup:
```bash
npx tsx test-auth.ts
```

Expected output:
```
✓ admin@pakshop.com
   → Password: VALID ✓
   → Role: admin

✓ naveedkhosa2006@gmail.com
   → Password: VALID ✓
   → Role: admin
```

### Login Endpoint
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "admin@pakshop.com",
  "password": "admin123"
}
```

**Success Response (200)**:
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Admin User",
      "email": "admin@pakshop.com",
      "role": "admin"
    }
  }
}
```

**Error Responses**:
- **400**: Missing email or password
- **401**: User not found or invalid password
- **500**: Internal server error

### Debugging Auth Issues

#### Check Database Users
```bash
npx tsx test-auth.ts
```

#### Check Server Logs (Render)
```bash
# Admin user creation logs
"✓ Created admin user (email: admin@pakshop.com)"

# Login attempts
"[AUTH] Login attempt for email: admin@pakshop.com"
"[AUTH] User found: admin@pakshop.com, role: admin"
"[AUTH] ✓ Login successful for user: admin@pakshop.com, role: admin"
```

### How Seeding Works

The `npm run seed` command:
1. Creates or updates `admin@pakshop.com` with password `admin123`
2. Creates or updates `naveedkhosa2006@gmail.com` with password `Cs1212**`
3. Creates sample categories (Electronics, Fashion, Home, etc.)
4. Creates sample products with images
5. Creates collections linked to categories

This runs **automatically** during deployment via the build script.

### Deployment Fix Summary

**Before Fix:**
- Build completes ✓
- Server starts ✓
- Login returns 401 ✗ (no admin user in DB)

**After Fix:**
- Build completes ✓
- Migrations apply ✓
- Admin user created ✓
- Login returns 200 ✓

### Future Admin User Management

To add more admin users, edit `server/seed.ts`:

```typescript
// Add new admin account
const [newAdmin] = await db.insert(users).values({
  name: "New Admin Name",
  email: "newadmin@example.com",
  passwordHash: await bcrypt.hash("password123", 10),
  role: "admin",
}).returning();
```

Then run:
```bash
npm run seed
```

Or manually insert via database client:
```sql
INSERT INTO users (name, email, password_hash, role)
VALUES ('Admin Name', 'admin@example.com', bcrypt_hash, 'admin');
```
