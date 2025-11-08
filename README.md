# PakShop - E-Commerce Platform for Pakistan

A full-stack e-commerce platform built with React, Express.js, PostgreSQL, and WhatsApp integration for direct customer purchases.

## Features

- 🛍️ **Product Catalog** - Browse products by categories and collections
- 💬 **WhatsApp Integration** - Direct "Buy on WhatsApp" button on product pages
- 🔐 **Admin Panel** - Secure JWT-based authentication for managing products
- 📸 **Multi-Image Upload** - Support for multiple product images
- 🏷️ **Categories & Collections** - Organize products effectively
- 💳 **Mobile Responsive** - Optimized for desktop and mobile devices
- 🎨 **Modern UI** - Built with TailwindCSS and Shadcn components

## Tech Stack

### Frontend
- React with Vite
- TypeScript
- TailwindCSS
- Shadcn UI Components
- TanStack Query (React Query)
- Wouter (Routing)

### Backend
- Express.js (Node.js)
- PostgreSQL (Neon-backed)
- Drizzle ORM
- JWT Authentication
- Multer (File uploads)
- bcryptjs (Password hashing)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database (or use the built-in Replit database)

### Environment Variables

Create a `.env` file in the root directory:

\`\`\`env
DATABASE_URL=postgresql://user:password@host:5432/database
SESSION_SECRET=your-secret-key-for-jwt
PORT=5000
\`\`\`

### Installation

1. **Install Dependencies**
   \`\`\`bash
   npm install
   \`\`\`

2. **Set Up Database**
   \`\`\`bash
   npm run db:push
   \`\`\`

3. **Seed Database** (Optional - creates admin user and sample products)
   \`\`\`bash
   tsx server/seed.ts
   \`\`\`
   
   Default admin credentials:
   - Email: `admin@pakshop.com`
   - Password: `admin123`

4. **Start Development Server**
   \`\`\`bash
   npm run dev
   \`\`\`

   The app will be available at `http://localhost:5000`

## Project Structure

\`\`\`
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── lib/           # Utilities (API, auth, queryClient)
│   │   └── App.tsx        # Main app component
│   └── index.html
│
├── server/                # Backend Express application
│   ├── middleware/        # Auth middleware
│   ├── routes.ts          # API route definitions
│   ├── storage.ts         # Database operations
│   ├── seed.ts            # Database seeding script
│   └── index.ts           # Server entry point
│
├── shared/                # Shared types and schemas
│   └── schema.ts          # Drizzle schema definitions
│
└── uploads/               # Uploaded product images
\`\`\`

## API Endpoints

### Authentication
- `POST /api/v1/auth/login` - Admin login

### Products (Public)
- `GET /api/v1/products` - Get all products
- `GET /api/v1/products/:slug` - Get product by slug

### Products (Admin - requires JWT)
- `POST /api/v1/admin/products` - Create product
- `PUT /api/v1/admin/products/:id` - Update product
- `DELETE /api/v1/admin/products/:id` - Delete product

### File Upload (Admin)
- `POST /api/v1/admin/upload` - Upload product image

### Categories
- `GET /api/v1/categories` - Get all categories
- `GET /api/v1/categories/:slug` - Get category by slug
- `POST /api/v1/admin/categories` - Create category (Admin)
- `PUT /api/v1/admin/categories/:id` - Update category (Admin)
- `DELETE /api/v1/admin/categories/:id` - Delete category (Admin)

### Collections
- `GET /api/v1/collections` - Get all collections
- `GET /api/v1/collections/:slug` - Get collection by slug
- `POST /api/v1/admin/collections` - Create collection (Admin)
- `PUT /api/v1/admin/collections/:id` - Update collection (Admin)
- `DELETE /api/v1/admin/collections/:id` - Delete collection (Admin)

## WhatsApp Integration

The platform includes a floating WhatsApp button and "Buy on WhatsApp" functionality on product pages.

To configure your WhatsApp number:
1. Update the phone number in `client/src/components/WhatsAppButton.tsx`
2. Default: `923001234567` (format: country code + number without +)

## Database Schema

### Users
- id, name, email, passwordHash, role, createdAt

### Categories
- id, name, slug, createdAt

### Products
- id, title, slug, description, pricePkr, categoryId, createdAt

### Product Images
- id, productId, url, createdAt

### Collections
- id, name, slug, description, createdAt

### Product Collections (Junction table)
- productId, collectionId

## Deployment

### Frontend (Vercel/Netlify)

1. Build the frontend:
   \`\`\`bash
   npm run build
   \`\`\`

2. Deploy the `dist/public` folder to Vercel or Netlify

3. Set environment variable:
   - `VITE_API_URL`: Your backend API URL

### Backend (Render/Railway)

1. Connect your GitHub repository to Render or Railway

2. Set environment variables:
   - `DATABASE_URL`: PostgreSQL connection string
   - `SESSION_SECRET`: JWT secret key
   - `PORT`: 5000 (or platform default)

3. Build command: `npm install`
4. Start command: `npm start`

### Database (Railway/Neon)

Use Railway's built-in PostgreSQL or connect to a Neon database.

## Admin Panel Access

1. Navigate to `/admin/login`
2. Use your admin credentials
3. Manage products, categories, and collections

## Development Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run db:push` - Push database schema changes
- `tsx server/seed.ts` - Seed database with sample data

## Security Notes

⚠️ **Important for Production:**

1. Change `SESSION_SECRET` to a strong random value
2. Update admin password after first login
3. Configure CORS for your specific domain
4. Use HTTPS in production
5. Enable rate limiting for API endpoints
6. Set up proper file upload validation

## License

MIT

## Support

For issues or questions, contact support@pakshop.com
