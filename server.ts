import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express, { Request, Response, NextFunction } from 'express';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync } from 'node:fs';
import bootstrap from './src/main.server';

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');

  const commonEngine = new CommonEngine();

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  // Configurar CORS y headers para PWA
  server.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');

    // IMPORTANTE: Configurar MIME types para archivos JavaScript
    if (req.url.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    } else if (req.url.endsWith('.mjs')) {
      res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    } else if (req.url.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css; charset=utf-8');
    } else if (req.url.endsWith('.json')) {
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
    }

    next();
  });

  // Serve PWA files with correct headers
  server.get(
    '/ngsw-worker.js',
    express.static(browserDistFolder, {
      maxAge: 0, // No cache para el service worker
      setHeaders: (res) => {
        res.setHeader('Service-Worker-Allowed', '/');
        res.setHeader('Content-Type', 'application/javascript');
      }
    })
  );

  server.get(
    '/ngsw.json',
    express.static(browserDistFolder, {
      maxAge: 0 // No cache para la configuración
    })
  );

  server.get(
    '/safety-worker.js',
    express.static(browserDistFolder, {
      maxAge: 0,
      setHeaders: (res) => {
        res.setHeader('Content-Type', 'application/javascript');
      }
    })
  );

  server.get(
    '/manifest.webmanifest',
    express.static(browserDistFolder, {
      maxAge: '1y',
      setHeaders: (res) => {
        res.setHeader('Content-Type', 'application/manifest+json');
      }
    })
  );

  // Serve translation files - CRÍTICO para i18n
  server.get('/messages/:lang.json', (req: Request, res: Response) => {
    const lang = req.params['lang'];
    const filePath = join(browserDistFolder, 'messages', `${lang}.json`);

    if (!existsSync(filePath)) {
      console.error(`Translation file not found: ${filePath}`);
      res.status(404).json({ error: 'Translation file not found' });
      return;
    }

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.sendFile(filePath);
  });

  // Serve API health check - TEMPORAL hasta que el backend esté funcionando
  server.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env['NODE_ENV'] || 'development',
      message: 'Frontend server running - backend not connected'
    });
  });

  // Health check para el environment correcto
  server.get('/api/v1/health', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env['NODE_ENV'] || 'development',
      message: 'Frontend server running - backend not connected'
    });
  });

  // Ruta específica para diagnóstico de Zone.js
  server.get('/zone-diagnostic', (req, res) => {
    res.sendFile(join(serverDistFolder, '../../src', 'zone-diagnostic.html'));
  });

  // Ruta específica para pruebas de módulos
  server.get('/test-modules', (req, res) => {
    res.sendFile(join(serverDistFolder, '../../src', 'test-modules.html'));
  });

  // Serve static files from /browser - ORDEN IMPORTANTE
  // CRÍTICO: Configurar Express para servir archivos JS con MIME correcto
  server.get(
    '*.js', // Archivos JavaScript
    express.static(browserDistFolder, {
      maxAge: '1y',
      index: false,
      setHeaders: (res) => {
        res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
      }
    })
  );

  server.get(
    '*.css', // Archivos CSS
    express.static(browserDistFolder, {
      maxAge: '1y',
      index: false,
      setHeaders: (res) => {
        res.setHeader('Content-Type', 'text/css; charset=utf-8');
      }
    })
  );

  server.get(
    '*.*', // Otros archivos con extensión
    express.static(browserDistFolder, {
      maxAge: '1y',
      index: false
    })
  );

  // All regular routes use the Angular engine - CRÍTICO para navegación SPA
  server.get('**', (req: Request, res: Response, next: NextFunction) => {
    const { protocol, originalUrl, baseUrl, headers } = req;

    // Log para debugging en producción
    console.log(`SSR Request: ${req.method} ${originalUrl}`);

    commonEngine
      .render({
        bootstrap,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: browserDistFolder,
        providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }]
      })
      .then((html: string) => {
        console.log(`SSR Success: ${originalUrl}`);
        res.send(html);
      })
      .catch((err: unknown) => {
        console.error(`SSR Error for ${originalUrl}:`, err);
        next(err);
      });
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;
  const nodeEnv = process.env['NODE_ENV'] || 'development';
  const isProduction = nodeEnv === 'production';

  // Start up the Node server
  const server = app();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');

  // Configuraciones específicas para Render en producción
  if (isProduction) {
    // Optimizaciones para Render
    server.set('trust proxy', 1);

    // Headers adicionales para mejor rendimiento en Render
    server.use((req: Request, res: Response, next: NextFunction) => {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      if (req.url.includes('/api/') || req.url.includes('.html')) {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      }
      next();
    });
  }

  server.listen(port, () => {
    console.log(`🚀 Node Express server listening on http://localhost:${port}`);
    console.log(`📁 Serving from: ${browserDistFolder}`);
    console.log(`🌍 Environment: ${nodeEnv}`);
    console.log(`⚡ Production optimizations: ${isProduction ? 'enabled' : 'disabled'}`);
  });

  // Manejo de errores del servidor
  server.on('error', (error: any) => {
    console.error('❌ Server error:', error);
  });
}

// Ejecutar el servidor
run();
