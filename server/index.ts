import 'dotenv/config';
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import cors from "cors";
import path from "path";
import fs from "fs";

const app = express();

app.use(cors());

declare module 'http' {
  interface IncomingMessage {
    rawBody: unknown
  }
}

// ✅ ADD BACK THE BODY SIZE LIMITS (CRITICAL FOR FILE UPLOADS)
app.use(express.json({
  limit: '10mb',
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

app.use("/uploads", express.static("uploads"));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    console.error("Error:", err);
    res.status(status).json({ message });
  });

  // ✅ ADD DEBUGGING FOR PRODUCTION
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    // Debug the static file serving
    const distPath = path.join(process.cwd(), 'dist');
    console.log('Production: Looking for dist folder at:', distPath);
    console.log('Directory exists:', fs.existsSync(distPath));
    
    if (fs.existsSync(distPath)) {
      console.log('Dist folder contents:', fs.readdirSync(distPath));
    }
    
    serveStatic(app);
  }

  const port = parseInt(process.env.PORT || '3000', 10); // ✅ Change to 3000 for Render
  const host = process.env.HOST || '0.0.0.0'; // ✅ Change to 0.0.0.0 for Render

  server.listen({
    port,
    host,
    ...(process.platform !== 'win32' ? { reusePort: true } : {}),
  }, () => {
    log(` Serving on http://${host}:${port}`);
  });
})();

