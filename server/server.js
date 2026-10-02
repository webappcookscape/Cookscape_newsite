import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/apiRoutes.js';

import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from root or server directory
const rootEnv = path.resolve(__dirname, '../.env');
const serverEnv = path.resolve(__dirname, '.env');
if (fs.existsSync(rootEnv)) {
  dotenv.config({ path: rootEnv });
} else if (fs.existsSync(serverEnv)) {
  dotenv.config({ path: serverEnv });
} else {
  dotenv.config();
}

const app = express();
const PORT = process.env.PORT || 5005;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api', apiRoutes);

// Serve Frontend Static Build if present (Unified Full-Stack Deployment)
const distPath = path.resolve(__dirname, '../dist');
if (fs.existsSync(distPath)) {
  console.log(`✓ Serving static frontend from: ${distPath}`);
  app.use(express.static(distPath));

  // SPA fallback for React Router (all non-API routes)
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  // Fallback if dist hasn't been built yet
  app.get('/', (req, res) => {
    res.json({ message: 'Cookscape Backend API Server is running. Run `npm run build` to serve frontend.' });
  });
}

// Start Server
app.listen(PORT, () => {
  console.log(`✓ Cookscape Full-Stack Server running on http://localhost:${PORT}`);
});

export default app;
