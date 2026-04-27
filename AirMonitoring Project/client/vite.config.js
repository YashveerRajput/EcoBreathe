import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Absolute path to the /motion folder in the project root (one level up from /client)
const MOTION_DIR = path.resolve(__dirname, '..', 'motion');
const COMPONENTS_DIR = path.resolve(__dirname, '..', 'components');

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'serve-motion-frames',
      configureServer(server) {
        server.middlewares.use('/motion', (req, res, next) => {
          // req.url here is e.g. "/ezgif-frame-001.jpg"
          const filePath = path.join(MOTION_DIR, req.url);
          if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            res.setHeader('Content-Type', 'image/jpeg');
            res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
            fs.createReadStream(filePath).pipe(res);
          } else {
            next();
          }
        });
        
        server.middlewares.use('/components', (req, res, next) => {
          const filePath = path.join(COMPONENTS_DIR, req.url);
          if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            res.setHeader('Content-Type', 'image/png');
            res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
            fs.createReadStream(filePath).pipe(res);
          } else {
            next();
          }
        });
      },
    },
  ],
  server: {
    port: 5173,
  },
});
