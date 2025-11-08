import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import bcrypt from "bcryptjs";
import { generateToken, authMiddleware, adminMiddleware } from "./middleware/auth";
import multer from "multer";
import path from "path";
import { z } from "zod";
import { insertProductSchema, insertCategorySchema, insertCollectionSchema } from "@shared/schema";

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    },
  }),
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const mimetype = allowedTypes.test(file.mimetype);
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Only image files are allowed"));
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Auth routes
  app.post("/api/v1/auth/login", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ success: false, error: "Email and password required" });
      }

      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ success: false, error: "Invalid credentials" });
      }

      const validPassword = await bcrypt.compare(password, user.passwordHash);
      if (!validPassword) {
        return res.status(401).json({ success: false, error: "Invalid credentials" });
      }

      const token = generateToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      res.json({
        success: true,
        data: {
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
        },
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Product routes
  app.get("/api/v1/products", async (req: Request, res: Response) => {
    try {
      const products = await storage.getProducts();
      res.json({ success: true, data: products });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.get("/api/v1/products/:slug", async (req: Request, res: Response) => {
    try {
      const product = await storage.getProductBySlug(req.params.slug);
      if (!product) {
        return res.status(404).json({ success: false, error: "Product not found" });
      }
      res.json({ success: true, data: product });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post("/api/v1/admin/products", authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const imageUrls = req.body.imageUrls || [];
      
      const product = await storage.createProduct(productData, imageUrls);
      res.json({ success: true, data: product });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ success: false, error: error.errors });
      }
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.put("/api/v1/admin/products/:id", authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
    try {
      const updates = req.body;
      const product = await storage.updateProduct(req.params.id, updates);
      
      if (!product) {
        return res.status(404).json({ success: false, error: "Product not found" });
      }
      
      res.json({ success: true, data: product });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.delete("/api/v1/admin/products/:id", authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
    try {
      await storage.deleteProduct(req.params.id);
      res.json({ success: true, data: { message: "Product deleted" } });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Upload route
  app.post("/api/v1/admin/upload", authMiddleware, adminMiddleware, upload.single("image"), (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, error: "No file uploaded" });
      }

      const imageUrl = `/uploads/${req.file.filename}`;
      res.json({ success: true, data: { url: imageUrl } });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Category routes
  app.get("/api/v1/categories", async (req: Request, res: Response) => {
    try {
      const categories = await storage.getCategories();
      res.json({ success: true, data: categories });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.get("/api/v1/categories/:slug", async (req: Request, res: Response) => {
    try {
      const category = await storage.getCategoryBySlug(req.params.slug);
      if (!category) {
        return res.status(404).json({ success: false, error: "Category not found" });
      }
      res.json({ success: true, data: category });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post("/api/v1/admin/categories", authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
    try {
      const categoryData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(categoryData);
      res.json({ success: true, data: category });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ success: false, error: error.errors });
      }
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.put("/api/v1/admin/categories/:id", authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
    try {
      const category = await storage.updateCategory(req.params.id, req.body);
      if (!category) {
        return res.status(404).json({ success: false, error: "Category not found" });
      }
      res.json({ success: true, data: category });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.delete("/api/v1/admin/categories/:id", authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
    try {
      await storage.deleteCategory(req.params.id);
      res.json({ success: true, data: { message: "Category deleted" } });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Collection routes
  app.get("/api/v1/collections", async (req: Request, res: Response) => {
    try {
      const collections = await storage.getCollections();
      res.json({ success: true, data: collections });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.get("/api/v1/collections/:slug", async (req: Request, res: Response) => {
    try {
      const collection = await storage.getCollectionBySlug(req.params.slug);
      if (!collection) {
        return res.status(404).json({ success: false, error: "Collection not found" });
      }
      res.json({ success: true, data: collection });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post("/api/v1/admin/collections", authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
    try {
      const collectionData = insertCollectionSchema.parse(req.body);
      const collection = await storage.createCollection(collectionData);
      res.json({ success: true, data: collection });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ success: false, error: error.errors });
      }
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.put("/api/v1/admin/collections/:id", authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
    try {
      const collection = await storage.updateCollection(req.params.id, req.body);
      if (!collection) {
        return res.status(404).json({ success: false, error: "Collection not found" });
      }
      res.json({ success: true, data: collection });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.delete("/api/v1/admin/collections/:id", authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
    try {
      await storage.deleteCollection(req.params.id);
      res.json({ success: true, data: { message: "Collection deleted" } });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
