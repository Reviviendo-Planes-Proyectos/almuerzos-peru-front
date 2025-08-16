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

  // Serve static files from /browser - ORDEN IMPORTANTE
  server.get(
    '*.*', // Solo archivos con extensión
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

  // Start up the Node server
  const server = app();

  server.listen(port, () => {
    console.log(`🚀 Node Express server listening on http://localhost:${port}`);
    console.log(
      `📁 Serving from: ${resolve(dirname(fileURLToPath(import.meta.url)), '../almuerzos-peru-front/browser')}`
    );
    console.log(`🌍 Environment: ${process.env['NODE_ENV'] || 'development'}`);
  });

  // Manejo de errores del servidor
  server.on('error', (error: any) => {
    console.error('❌ Server error:', error);
  });
}

// Ejecutar el servidor
run();
