import { 
  type User, 
  type InsertUser, 
  type Product, 
  type InsertProduct,
  type ProductImage,
  type InsertProductImage,
  type Category,
  type InsertCategory,
  type Collection,
  type InsertCollection,
  type InsertProductCollection,
  users,
  products,
  productImages,
  categories,
  collections,
  productCollections
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getProducts(): Promise<(Product & { images: ProductImage[]; category: Category | null })[]>;
  getProductBySlug(slug: string): Promise<(Product & { images: ProductImage[]; category: Category | null }) | undefined>;
  createProduct(product: InsertProduct, imageUrls: string[]): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<boolean>;
  
  getCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: string): Promise<boolean>;
  
  getCollections(): Promise<Collection[]>;
  getCollectionBySlug(slug: string): Promise<Collection | undefined>;
  createCollection(collection: InsertCollection): Promise<Collection>;
  updateCollection(id: string, collection: Partial<InsertCollection>): Promise<Collection | undefined>;
  deleteCollection(id: string): Promise<boolean>;
  
  addProductToCollection(productId: string, collectionId: string): Promise<void>;
  removeProductFromCollection(productId: string, collectionId: string): Promise<void>;
}

export class DbStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getProducts(): Promise<(Product & { images: ProductImage[]; category: Category | null })[]> {
    const allProducts = await db.select().from(products).orderBy(desc(products.createdAt));
    
    const productsWithDetails = await Promise.all(
      allProducts.map(async (product) => {
        const images = await db.select().from(productImages).where(eq(productImages.productId, product.id));
        let category = null;
        if (product.categoryId) {
          const [cat] = await db.select().from(categories).where(eq(categories.id, product.categoryId));
          category = cat || null;
        }
        return { ...product, images, category };
      })
    );

    return productsWithDetails;
  }

  async getProductBySlug(slug: string): Promise<(Product & { images: ProductImage[]; category: Category | null }) | undefined> {
    const [product] = await db.select().from(products).where(eq(products.slug, slug));
    if (!product) return undefined;

    const images = await db.select().from(productImages).where(eq(productImages.productId, product.id));
    let category = null;
    if (product.categoryId) {
      const [cat] = await db.select().from(categories).where(eq(categories.id, product.categoryId));
      category = cat || null;
    }

    return { ...product, images, category };
  }

  async createProduct(product: InsertProduct, imageUrls: string[]): Promise<Product> {
    const [newProduct] = await db.insert(products).values(product).returning();
    
    if (imageUrls.length > 0) {
      await db.insert(productImages).values(
        imageUrls.map(url => ({ productId: newProduct.id, url }))
      );
    }

    return newProduct;
  }

  async updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined> {
    const [updated] = await db.update(products).set(product).where(eq(products.id, id)).returning();
    return updated;
  }

  async deleteProduct(id: string): Promise<boolean> {
    const result = await db.delete(products).where(eq(products.id, id));
    return true;
  }

  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories).orderBy(categories.name);
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.slug, slug));
    return category;
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [newCategory] = await db.insert(categories).values(category).returning();
    return newCategory;
  }

  async updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category | undefined> {
    const [updated] = await db.update(categories).set(category).where(eq(categories.id, id)).returning();
    return updated;
  }

  async deleteCategory(id: string): Promise<boolean> {
    await db.delete(categories).where(eq(categories.id, id));
    return true;
  }

  async getCollections(): Promise<Collection[]> {
    return await db.select().from(collections).orderBy(collections.name);
  }

  async getCollectionBySlug(slug: string): Promise<Collection | undefined> {
    const [collection] = await db.select().from(collections).where(eq(collections.slug, slug));
    return collection;
  }

  async createCollection(collection: InsertCollection): Promise<Collection> {
    const [newCollection] = await db.insert(collections).values(collection).returning();
    return newCollection;
  }

  async updateCollection(id: string, collection: Partial<InsertCollection>): Promise<Collection | undefined> {
    const [updated] = await db.update(collections).set(collection).where(eq(collections.id, id)).returning();
    return updated;
  }

  async deleteCollection(id: string): Promise<boolean> {
    await db.delete(collections).where(eq(collections.id, id));
    return true;
  }

  async addProductToCollection(productId: string, collectionId: string): Promise<void> {
    await db.insert(productCollections).values({ productId, collectionId });
  }

  async removeProductFromCollection(productId: string, collectionId: string): Promise<void> {
    await db.delete(productCollections)
      .where(eq(productCollections.productId, productId))
      .where(eq(productCollections.collectionId, collectionId));
  }
}

export const storage = new DbStorage();
