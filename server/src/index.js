import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/database.js';
import authRoutes from './routes/auth.routes.js';
import noteRoutes from './routes/note.routes.js';
import userRoutes from './routes/user.routes.js';
import { errorHandler } from './middleware/error.middleware.js';

const app = express();
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function firstExistingPath(paths) {
  for (const p of paths) {
    if (!p) continue;
    try {
      if (fs.existsSync(p)) return p;
    } catch {
      // ignore
    }
  }
  return null;
}

const clientDistPath = firstExistingPath([
  process.env.CLIENT_DIST, // optional override for deployments
  path.resolve(__dirname, '../../front-end/dist'),
  path.resolve(__dirname, '../dist'),
  path.resolve(process.cwd(), 'front-end/dist'),
  path.resolve(process.cwd(), '../front-end/dist'),
  path.resolve(process.cwd(), 'dist'),
]);

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/users', userRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', message: 'PinNote API running' }));

// Serve frontend (SPA) if dist exists on this server
if (clientDistPath) {
  console.log(`🧩 Serving frontend from ${clientDistPath}`);
  app.use(express.static(clientDistPath));
  app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
} else {
  console.log('🧩 Frontend dist not found; SPA refresh will 404 on non-/ routes');
}

// Error handler
app.use(errorHandler);

// Start
connectDB().then(() => {
  app.listen(PORT, () => console.log(`🗺️  PinNote API running on http://localhost:${PORT}`));
});