import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express, { Request, Response, NextFunction } from 'express';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
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

  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });

  // Serve PWA files with correct headers
  server.get('/ngsw-worker.js', express.static(browserDistFolder, {
    maxAge: 0, // No cache para el service worker
    setHeaders: (res) => {
      res.setHeader('Service-Worker-Allowed', '/');
      res.setHeader('Content-Type', 'application/javascript');
    }
  }));

  server.get('/ngsw.json', express.static(browserDistFolder, {
    maxAge: 0 // No cache para la configuración
  }));

  server.get('/safety-worker.js', express.static(browserDistFolder, {
    maxAge: 0,
    setHeaders: (res) => {
      res.setHeader('Content-Type', 'application/javascript');
    }
  }));

  server.get('/manifest.webmanifest', express.static(browserDistFolder, {
    maxAge: '1y',
    setHeaders: (res) => {
      res.setHeader('Content-Type', 'application/manifest+json');
    }
  }));

  // Serve static files from /browser
  server.get(
    '**',
    express.static(browserDistFolder, {
      maxAge: '1y',
      index: false // Importante: no servir index.html automáticamente
    })
  );

  // All regular routes use the Angular engine
  server.get('**', (req: Request, res: Response, next: NextFunction) => {
    const { protocol, originalUrl, baseUrl, headers } = req;

    commonEngine
      .render({
        bootstrap,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: browserDistFolder,
        providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }]
      })
      .then((html: string) => res.send(html))
      .catch((err: unknown) => next(err));
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

run();
