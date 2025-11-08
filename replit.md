# PakShop E-Commerce Platform

## Project Overview

A full-stack e-commerce platform built specifically for the Pakistan market, featuring WhatsApp-based purchasing, admin product management, and a modern responsive UI.

## Core Features Implemented

### Public Features
- **Product Catalog**: Browse products with filtering by categories
- **Product Detail Pages**: Full product information with image gallery
- **WhatsApp Integration**: Direct "Buy on WhatsApp" buttons that pre-fill purchase messages
- **Floating WhatsApp Button**: Always accessible customer support
- **Category Pages**: Browse products by category (Electronics, Fashion, Accessories)
- **Responsive Design**: Mobile-optimized for Pakistan's mobile-first market

### Admin Features
- **Secure Login**: JWT-based authentication for admin access
- **Product Management**: Full CRUD operations for products
- **Multi-Image Upload**: Upload and manage multiple product images
- **Category Management**: Create and organize product categories
- **Collection Management**: Group products into featured collections

## Tech Stack

### Frontend
- React 18 with Vite
- TypeScript
- TailwindCSS + Shadcn UI
- TanStack Query (data fetching)
- Wouter (routing)

### Backend
- Express.js (Node.js)
- PostgreSQL (Neon)
- Drizzle ORM
- JWT authentication
- Multer (file uploads)
- bcryptjs (password hashing)

## Database Schema

### Tables
1. **users** - Admin and customer accounts
2. **categories** - Product categories
3. **products** - Product listings
4. **product_images** - Multiple images per product
5. **collections** - Featured product collections
6. **product_collections** - Junction table for products in collections

## API Endpoints

### Public
- `GET /api/v1/products` - List all products
- `GET /api/v1/products/:slug` - Get product details
- `GET /api/v1/categories` - List categories
- `GET /api/v1/collections` - List collections

### Admin (requires JWT token)
- `POST /api/v1/auth/login` - Admin login
- `POST /api/v1/admin/products` - Create product
- `PUT /api/v1/admin/products/:id` - Update product
- `DELETE /api/v1/admin/products/:id` - Delete product
- `POST /api/v1/admin/upload` - Upload product image
- Category/Collection CRUD endpoints

## Environment Variables

Required:
- `DATABASE_URL` - PostgreSQL connection string
- `SESSION_SECRET` - JWT signing secret (required for security)
- `PORT` - Server port (default: 5000)

## Development Setup

1. Install dependencies: `npm install`
2. Push database schema: `npm run db:push`
3. Seed database: `tsx server/seed.ts`
4. Start development server: `npm run dev`

## Admin Credentials

After seeding:
- Email: `admin@pakshop.com`
- Password: `admin123`

**⚠️ Change these in production!**

## WhatsApp Configuration

Default WhatsApp number: `923001234567`

To change:
- Update in `client/src/components/WhatsAppButton.tsx`
- Update in `client/src/components/Header.tsx`

## File Storage

Product images are stored in the `/uploads` directory. In production, consider migrating to cloud storage (S3, Cloudinary, etc.)

## Recent Changes

- Fixed collection removal bug (now properly removes from specific collection)
- Enforced SESSION_SECRET environment variable requirement
- Added comprehensive README and deployment guide
- Seeded database with sample products and admin user
- Implemented full authentication flow with JWT
- Created responsive UI with WhatsApp integration

## Deployment Notes

### Frontend (Vercel/Netlify)
- Build command: `npm run build`
- Deploy: `dist/public` folder
- Set `VITE_API_URL` to backend URL

### Backend (Render/Railway)
- Build: `npm install`
- Start: `npm start`
- Set environment variables (DATABASE_URL, SESSION_SECRET)

### Database
- Use Railway PostgreSQL or Neon
- Ensure `DATABASE_URL` is properly configured

## Security Considerations

✅ Implemented:
- JWT authentication for admin routes
- Password hashing with bcryptjs
- File upload validation (images only, 5MB limit)
- CORS configuration

⚠️ For Production:
- Use strong SESSION_SECRET
- Enable HTTPS
- Add rate limiting
- Configure proper CORS origins
- Change default admin credentials
- Regular security updates

## Project Structure

```
├── client/              # Frontend React app
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components
│   │   └── lib/         # API client, auth utilities
├── server/              # Backend Express app
│   ├── middleware/      # Auth middleware
│   ├── routes.ts        # API routes
│   ├── storage.ts       # Database operations
│   └── seed.ts          # Database seeding
├── shared/              # Shared TypeScript types
│   └── schema.ts        # Drizzle ORM schema
└── uploads/             # Product image storage
```

## Future Enhancements

Potential additions:
- Product search functionality
- Inventory management
- Order tracking via WhatsApp
- Customer reviews and ratings
- Analytics dashboard
- Cloud storage integration (S3/MinIO)
- Multi-language support (Urdu)
- Advanced filtering and sorting
- Product variants (sizes, colors)
- Email notifications

## Support

For issues or questions, refer to README.md for detailed setup instructions.
