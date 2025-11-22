import express, { type Express, type Request, type Response, type NextFunction } from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import viteConfig from "../vite.config";
import { nanoid } from "nanoid";

const viteLogger = createLogger();

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html",
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`,
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(process.cwd(), "dist-server", "dist");
  const distServerPath = path.resolve(process.cwd(), "dist-server");
  const rootPath = process.cwd();

  // Log directory structure for debugging
  console.log("\n📁 Directory Structure Debug:");
  console.log(`Root: ${rootPath}`);
  console.log(`Expected dist: ${distPath}`);
  console.log(`Expected dist-server: ${distServerPath}`);

  function logDirectoryContents(dirPath: string, label: string) {
    try {
      if (fs.existsSync(dirPath)) {
        const contents = fs.readdirSync(dirPath, { withFileTypes: true });
        console.log(`\n✓ ${label} exists:`);
        contents.forEach((item) => {
          const itemPath = path.join(dirPath, item.name);
          const stats = fs.statSync(itemPath);
          const size = stats.isFile() ? ` (${stats.size} bytes)` : " (dir)";
          console.log(`  - ${item.name}${size}`);
        });
      } else {
        console.log(`\n✗ ${label} NOT FOUND`);
      }
    } catch (err) {
      console.log(`\n✗ Error reading ${label}: ${err}`);
    }
  }

  logDirectoryContents(rootPath, "Root directory");
  logDirectoryContents(distPath, "Dist folder");
  logDirectoryContents(distServerPath, "Dist-server folder");

  if (!fs.existsSync(distPath)) {
    console.error("\n⚠️  Build Error: dist folder not found!");
    console.error("This usually means the client build failed or hasn't been run yet.\n");

    // Serve a helpful error page instead of crashing. For API routes, call next()
    app.use((req: Request, res: Response, next: NextFunction) => {
      if (req.path && req.path.startsWith('/api')) {
        // Let API routes handle the request
        return next();
      }

      res.status(503).send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Build Error</title>
            <style>
              body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: #333;
                margin: 0;
                padding: 20px;
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
              }
              .container {
                background: white;
                border-radius: 8px;
                padding: 40px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.1);
                max-width: 600px;
              }
              h1 { color: #e74c3c; margin-top: 0; }
              .error-code { 
                background: #f8f9fa; 
                padding: 15px; 
                border-left: 4px solid #e74c3c;
                margin: 20px 0;
                font-family: monospace;
                font-size: 14px;
                overflow-x: auto;
              }
              .info {
                background: #ecf0f1;
                padding: 15px;
                border-radius: 4px;
                margin: 20px 0;
                font-size: 14px;
              }
              .code {
                background: #f5f5f5;
                padding: 10px;
                border-radius: 4px;
                font-family: monospace;
                margin: 10px 0;
              }
              ul { margin: 10px 0; padding-left: 20px; }
              li { margin: 5px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>🚨 Build Error</h1>
              <p><strong>The dist folder was not found.</strong></p>
              
              <div class="error-code">
                Missing: ${distPath}
              </div>

              <div class="info">
                <strong>Possible causes:</strong>
                <ul>
                  <li>Client build failed or wasn't completed</li>
                  <li>Build files were not copied to deployment environment</li>
                  <li>Working directory mismatch</li>
                </ul>
              </div>

              <div class="info">
                <strong>To fix this:</strong>
                <ul>
                  <li>Run <span class="code">npm run build</span></li>
                  <li>Check build logs for errors</li>
                  <li>Ensure the dist folder is included in deployment</li>
                </ul>
              </div>

              <div class="info">
                <strong>Debug Info:</strong>
                <div class="code">Root: ${rootPath}</div>
                <div class="code">Node Env: ${process.env.NODE_ENV || 'not set'}</div>
              </div>
            </div>
          </body>
        </html>
      `);
    });

    return;
  }

  const indexPath = path.resolve(distPath, "index.html");
  if (!fs.existsSync(indexPath)) {
    console.warn(
      `\n⚠️  Warning: index.html not found in dist folder at ${indexPath}`,
    );
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    res.sendFile(indexPath, (err) => {
      if (err) {
        console.error(`Error serving index.html: ${err.message}`);
        res.status(404).send("index.html not found");
      }
    });
  });
}
