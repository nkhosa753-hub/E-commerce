import { db } from "./db";
import { users, categories, products, productImages } from "@shared/schema";
import bcrypt from "bcryptjs";

async function seed() {
  console.log("🌱 Seeding database...");

  try {
    const hashedPassword = await bcrypt.hash("admin123", 10);
    
    const [admin] = await db.insert(users).values({
      name: "Admin User",
      email: "admin@pakshop.com",
      passwordHash: hashedPassword,
      role: "admin",
    }).returning();
    
    console.log("✓ Created admin user (email: admin@pakshop.com, password: admin123)");

    const [electronics] = await db.insert(categories).values({
      name: "Electronics",
      slug: "electronics",
    }).returning();

    const [fashion] = await db.insert(categories).values({
      name: "Fashion",
      slug: "fashion",
    }).returning();

    const [accessories] = await db.insert(categories).values({
      name: "Accessories",
      slug: "accessories",
    }).returning();

    console.log("✓ Created categories");

    const sampleProducts = [
      {
        title: "Premium Blue Cotton T-Shirt",
        slug: "blue-cotton-tshirt",
        description: "Experience comfort and style with our premium blue cotton t-shirt. Made from 100% pure cotton, this t-shirt offers breathability and softness for all-day wear. Perfect for casual outings or everyday comfort.",
        pricePkr: 2499,
        categoryId: fashion.id,
      },
      {
        title: "Wireless Bluetooth Headphones",
        slug: "wireless-headphones",
        description: "High-quality wireless headphones with premium sound quality, comfortable ear cushions, and long battery life. Perfect for music lovers and professionals.",
        pricePkr: 8999,
        categoryId: electronics.id,
      },
      {
        title: "Luxury Leather Wristwatch",
        slug: "luxury-wristwatch",
        description: "Elegant timepiece with genuine leather strap and precision movement. A perfect accessory for any occasion.",
        pricePkr: 15999,
        categoryId: fashion.id,
      },
      {
        title: "Professional Laptop Backpack",
        slug: "laptop-backpack",
        description: "Durable laptop backpack with multiple compartments, padded laptop sleeve, and water-resistant material. Perfect for students and professionals.",
        pricePkr: 4999,
        categoryId: accessories.id,
      },
      {
        title: "Athletic Running Sneakers",
        slug: "running-sneakers",
        description: "Comfortable running shoes with cushioned soles and breathable material. Designed for performance and style.",
        pricePkr: 6499,
        categoryId: fashion.id,
      },
      {
        title: "Modern Smartphone with Premium Case",
        slug: "smartphone-case",
        description: "Latest smartphone with elegant protective case. High-quality display, powerful processor, and excellent camera.",
        pricePkr: 42999,
        categoryId: electronics.id,
      },
    ];

    const imageUrls = [
      "/uploads/sample-tshirt.jpg",
      "/uploads/sample-headphones.jpg",
      "/uploads/sample-watch.jpg",
      "/uploads/sample-backpack.jpg",
      "/uploads/sample-sneakers.jpg",
      "/uploads/sample-smartphone.jpg",
    ];

    for (let i = 0; i < sampleProducts.length; i++) {
      const [product] = await db.insert(products).values(sampleProducts[i]).returning();
      
      await db.insert(productImages).values([
        { productId: product.id, url: imageUrls[i] },
        { productId: product.id, url: imageUrls[i] },
        { productId: product.id, url: imageUrls[i] },
      ]);
    }

    console.log("✓ Created sample products with images");
    console.log("\n✅ Database seeded successfully!");
    console.log("\n📝 Admin credentials:");
    console.log("   Email: admin@pakshop.com");
    console.log("   Password: admin123");
    
  } catch (error: any) {
    console.error("❌ Error seeding database:", error.message);
    throw error;
  }
}

seed()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
