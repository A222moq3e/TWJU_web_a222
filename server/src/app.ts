import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import mediaRoutes from './routes/mediaRoutes';
import adminRoutes from './routes/adminRoutes';
import studentRoutes from './routes/studentRoutes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import { logger } from './lib/logger';
import path from 'path';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Routes (prefixed with /api)
app.use('/api/auth', authRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/students', studentRoutes);

// Health check (under /api)
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// ---------- Serve built SPA in production ----------
if (process.env.NODE_ENV === 'production') {
  // After tsc, __dirname === server/dist
  const clientDist = path.resolve(__dirname, '..', '..', 'web', 'dist');
  logger.info(`Serving static client from: ${clientDist}`);

  // Serve hashed assets
  app.use(express.static(clientDist, { maxAge: '1y', immutable: true }));

  // SPA fallback for non-API routes
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}
// ---------------------------------------------------

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
