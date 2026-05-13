import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/database.js';
import authRoutes from './routes/auth.routes.js';
import noteRoutes from './routes/note.routes.js';
import userRoutes from './routes/user.routes.js';
import { errorHandler } from './middleware/error.middleware.js';

if (!process.env.JWT_SECRET) {
  console.warn('⚠️  JWT_SECRET is not set — auth tokens will be insecure');
}
if (!process.env.CLIENT_URL) {
  console.warn('⚠️  CLIENT_URL is not set — CORS may block the web app');
}

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/users', userRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', message: 'PinNote API running' }));

// Error handler
app.use(errorHandler);

// Start
connectDB().then(() => {
  app.listen(PORT, () => console.log(`🗺️  PinNote API running on http://localhost:${PORT}`));
});