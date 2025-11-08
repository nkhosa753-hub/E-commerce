# Design Guidelines: Pakistan E-Commerce Platform

## Design Approach

**Reference-Based Approach**: Drawing inspiration from Shopify's clean product displays, Amazon's information density, and Daraz.pk's Pakistan-market sensibility. This e-commerce platform prioritizes visual product showcase with clear conversion paths and prominent WhatsApp integration.

## Core Design Elements

### Typography
- **Primary Font**: Inter or Poppins (Google Fonts CDN) - modern, highly legible
- **Headings**: Bold (700) for H1/H2, Semibold (600) for H3/H4
- **Body**: Regular (400) for descriptions, Medium (500) for prices/CTAs
- **Sizes**: H1 (text-4xl lg:text-5xl), H2 (text-3xl lg:text-4xl), Body (text-base lg:text-lg), Price displays (text-2xl lg:text-3xl font-bold)

### Layout System
**Spacing primitives**: Tailwind units of 4, 6, 8, 12, 16, 20
- Component padding: p-4 to p-8
- Section spacing: py-12 to py-20
- Grid gaps: gap-4 to gap-8
- Container: max-w-7xl mx-auto px-4

### Component Library

**Navigation Header**
- Sticky top navigation with site logo, search bar (prominent), cart icon, admin login link
- WhatsApp floating action button (fixed bottom-right, z-50) with icon and "Contact Us" label
- Mobile: Hamburger menu, collapsible search

**Product Grid (Home & Category Pages)**
- 4-column grid on desktop (grid-cols-1 md:grid-cols-2 lg:grid-cols-4)
- Product cards with: Primary image, title (2-line truncate), price in PKR, category badge
- Hover state: Subtle lift effect (transform scale)

**Product Detail Page**
- Two-column layout: Image gallery (60%) + Details sidebar (40%)
- Image gallery: Main large image with thumbnail strip below (4-5 thumbnails, horizontal scroll on mobile)
- Details sidebar includes: Title, price (large, bold), category badge, description, WhatsApp "Buy Now" button (large, prominent with WhatsApp icon)
- Related products carousel at bottom

**Admin Panel**
- Sidebar navigation (fixed left) with: Dashboard, Products, Categories, Collections
- Main content area with data tables, action buttons, forms
- Product form: Multi-image uploader with drag-drop area, preview thumbnails with delete option
- Table views with edit/delete actions per row

**Homepage Sections**
1. Hero banner with featured product/collection (80vh, large image background, centered CTA overlay with blurred button backgrounds)
2. Featured collections grid (3-column, collection cards with image + title + product count)
3. Best sellers product grid (4-column, 8 products)
4. Category showcase (2-column split with image + description per category)
5. Trust signals footer section (free shipping, cash on delivery, WhatsApp support icons with text)

**Footer**
- 4-column layout: About/Categories/Customer Service/Contact
- Newsletter signup form, social media links, WhatsApp business number prominently displayed
- Payment method icons, trust badges

### Icons
**Heroicons CDN** (outline and solid variants)
- Shopping cart, search, user, menu, WhatsApp logo
- Category icons, edit/delete/upload actions

### Images

**Hero Section**: Large lifestyle product image showing featured collection in use (Pakistani context - home setting, local models if applicable)

**Product Images**: Multiple high-quality product photos per item - front view, detail shots, lifestyle context shots

**Collection Cards**: Curated collection header images showing product category aesthetic

**Category Pages**: Banner images representing each category

**Trust Section**: Icons for delivery truck, cash payment, WhatsApp support (use icon library, not photos)

Image placement: Hero (full-width), product grids (square aspect ratio cards), product detail (large primary + thumbnails), collection banners (16:9 ratio)

### Key UI Patterns

**WhatsApp Integration**
- Floating button: Large circular button with WhatsApp icon, pulse animation
- Product detail "Buy Now": Full-width button with WhatsApp icon + text, prominent placement above fold
- Pre-filled message format clearly indicated

**Product Cards**
- Image-first design, minimal text overlay
- Clear price display in PKR with comma separators (e.g., Rs. 2,499)
- Quick view option on hover (optional magnifying glass icon)

**Admin Forms**
- Clean, spacious forms with clear labels above inputs
- Multi-image upload area: Dashed border dropzone with upload icon
- Image previews in grid with small delete buttons overlay

**Mobile Optimizations**
- Single column product grids
- Hamburger navigation
- Bottom sticky WhatsApp button
- Simplified hero with smaller text sizing
- Touch-friendly button sizes (min h-12)

### Animations
Use sparingly:
- Subtle product card hover lift (transform: scale(1.02))
- WhatsApp floating button gentle pulse
- Page transitions: Simple fade-in
- No scroll-triggered animations

This Pakistan-focused e-commerce design balances modern web aesthetics with local market expectations for clear pricing, prominent contact options (WhatsApp), and trust-building elements while maintaining clean, product-forward layouts that drive conversions.