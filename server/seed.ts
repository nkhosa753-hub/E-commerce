import 'dotenv/config';
import { db } from "./db";
import { users, categories, products, productImages, collections } from "@shared/schema";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

async function seed() {
  console.log("🌱 Seeding database...");

  try {
    // Create main admin account
    const [existingAdmin] = await db.select().from(users).where(eq(users.email, "admin@pakshop.com"));
    
    if (existingAdmin) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      await db.update(users)
        .set({
          passwordHash: hashedPassword,
          role: "admin",
        })
        .where(eq(users.id, existingAdmin.id));
      console.log("✓ Updated admin user (email: admin@pakshop.com, password: admin123)");
    } else {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      const [admin] = await db.insert(users).values({
        name: "Admin User",
        email: "admin@pakshop.com",
        passwordHash: hashedPassword,
        role: "admin",
      }).returning();
      console.log("✓ Created admin user (email: admin@pakshop.com, password: admin123)");
    }

    // Create Naveed Khosa admin account
    const naveedPassword = await bcrypt.hash("Cs1212**", 10);
    const [existingNaveed] = await db.select().from(users).where(eq(users.email, "naveedkhosa2006@gmail.com"));
    
    if (existingNaveed) {
      await db.update(users)
        .set({
          passwordHash: naveedPassword,
          role: "admin",
        })
        .where(eq(users.id, existingNaveed.id));
      console.log("✓ Updated Naveed Khosa admin account (email: naveedkhosa2006@gmail.com, password: Cs1212**)");
    } else {
      const [naveedAdmin] = await db.insert(users).values({
        name: "Naveed Khosa",
        email: "naveedkhosa2006@gmail.com",
        passwordHash: naveedPassword,
        role: "admin",
      }).returning();
      console.log("✓ Created Naveed Khosa admin account (email: naveedkhosa2006@gmail.com, password: Cs1212**)");
    }

    // Create categories (check if they exist first)
    const [existingElectronics] = await db.select().from(categories).where(eq(categories.slug, "electronics"));
    let electronics;
    if (existingElectronics) {
      electronics = existingElectronics;
      console.log("✓ Electronics category already exists");
    } else {
      [electronics] = await db.insert(categories).values({
        name: "Electronics",
        slug: "electronics",
      }).returning();
      console.log("✓ Created Electronics category");
    }

    const [existingFashion] = await db.select().from(categories).where(eq(categories.slug, "fashion"));
    let fashion;
    if (existingFashion) {
      fashion = existingFashion;
      console.log("✓ Fashion category already exists");
    } else {
      [fashion] = await db.insert(categories).values({
        name: "Fashion",
        slug: "fashion",
      }).returning();
      console.log("✓ Created Fashion category");
    }

    const [existingAccessories] = await db.select().from(categories).where(eq(categories.slug, "accessories"));
    let accessories;
    if (existingAccessories) {
      accessories = existingAccessories;
      console.log("✓ Accessories category already exists");
    } else {
      [accessories] = await db.insert(categories).values({
        name: "Accessories",
        slug: "accessories",
      }).returning();
      console.log("✓ Created Accessories category");
    }

    const [existingBeauty] = await db.select().from(categories).where(eq(categories.slug, "beauty"));
    let beauty;
    if (existingBeauty) {
      beauty = existingBeauty;
      console.log("✓ Beauty & Personal Care category already exists");
    } else {
      [beauty] = await db.insert(categories).values({
        name: "Beauty & Personal Care",
        slug: "beauty",
      }).returning();
      console.log("✓ Created Beauty & Personal Care category");
    }

    const [existingSports] = await db.select().from(categories).where(eq(categories.slug, "sports"));
    let sports;
    if (existingSports) {
      sports = existingSports;
      console.log("✓ Sports & Fitness category already exists");
    } else {
      [sports] = await db.insert(categories).values({
        name: "Sports & Fitness",
        slug: "sports",
      }).returning();
      console.log("✓ Created Sports & Fitness category");
    }

    const [existingHome] = await db.select().from(categories).where(eq(categories.slug, "home"));
    let home;
    if (existingHome) {
      home = existingHome;
      console.log("✓ Home & Living category already exists");
    } else {
      [home] = await db.insert(categories).values({
        name: "Home & Living",
        slug: "home",
      }).returning();
      console.log("✓ Created Home & Living category");
    }

    // Create collections for each category
    const [existingElectronicsCollection] = await db.select().from(collections).where(eq(collections.slug, "electronics"));
    if (!existingElectronicsCollection) {
      await db.insert(collections).values({
        name: "Electronics",
        slug: "electronics",
        description: "Best electronics and gadgets",
      });
      console.log("✓ Created Electronics collection");
    }

    const [existingFashionCollection] = await db.select().from(collections).where(eq(collections.slug, "fashion"));
    if (!existingFashionCollection) {
      await db.insert(collections).values({
        name: "Fashion & Apparel",
        slug: "fashion",
        description: "Latest fashion and apparel items",
      });
      console.log("✓ Created Fashion collection");
    }

    const [existingAccessoriesCollection] = await db.select().from(collections).where(eq(collections.slug, "accessories"));
    if (!existingAccessoriesCollection) {
      await db.insert(collections).values({
        name: "Accessories",
        slug: "accessories",
        description: "Premium accessories for everyone",
      });
      console.log("✓ Created Accessories collection");
    }

    const [existingBeautyCollection] = await db.select().from(collections).where(eq(collections.slug, "beauty"));
    if (!existingBeautyCollection) {
      await db.insert(collections).values({
        name: "Beauty & Personal Care",
        slug: "beauty",
        description: "Beauty and personal care products",
      });
      console.log("✓ Created Beauty & Personal Care collection");
    }

    const [existingSportsCollection] = await db.select().from(collections).where(eq(collections.slug, "sports"));
    if (!existingSportsCollection) {
      await db.insert(collections).values({
        name: "Sports & Fitness",
        slug: "sports",
        description: "Sports and fitness equipment",
      });
      console.log("✓ Created Sports & Fitness collection");
    }

    const [existingHomeCollection] = await db.select().from(collections).where(eq(collections.slug, "home"));
    if (!existingHomeCollection) {
      await db.insert(collections).values({
        name: "Home & Living",
        slug: "home",
        description: "Home and living essentials",
      });
      console.log("✓ Created Home & Living collection");
    }

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

    // Create sample products (skip if they already exist)
    let productsCreated = 0;
    for (let i = 0; i < sampleProducts.length; i++) {
      const [existingProduct] = await db.select().from(products).where(eq(products.slug, sampleProducts[i].slug));
      
      if (!existingProduct) {
        const [product] = await db.insert(products).values(sampleProducts[i]).returning();
        
        await db.insert(productImages).values([
          { productId: product.id, url: imageUrls[i] },
          { productId: product.id, url: imageUrls[i] },
          { productId: product.id, url: imageUrls[i] },
        ]);
        productsCreated++;
      }
    }

    if (productsCreated > 0) {
      console.log(`✓ Created ${productsCreated} sample products with images`);
    } else {
      console.log("✓ Sample products already exist");
    }

    console.log("\n✅ Database seeded successfully!");
    console.log("\n📝 Admin credentials:");
    console.log("   1. Email: admin@pakshop.com");
    console.log("      Password: admin123");
    console.log("   2. Email: naveedkhosa2006@gmail.com");
    console.log("      Password: Cs1212**");
    
  } catch (error: any) {
    console.error("❌ Error seeding database:");
    console.error("   Message:", error?.message || "Unknown error");
    console.error("   Stack:", error?.stack || "No stack trace");
    console.error("   Full error:", error);
    throw error;
  }
}

seed()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
