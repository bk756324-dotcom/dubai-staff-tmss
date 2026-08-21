import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import { db } from '../src/server/db/database.js';
import { apiRouter } from '../src/server/routes/api.routes.js';

dotenv.config();

const app = express();

let isDbReady = false;
async function ensureDb() {
  if (!isDbReady) {
    await db.init();
    isDbReady = true;
  }
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure DB is initialized before handling requests
app.use(async (_req: Request, _res: Response, next: NextFunction) => {
  try {
    await ensureDb();
    next();
  } catch (err) {
    next(err);
  }
});

// Mount API router
app.use('/api', apiRouter);

// Error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[Vercel Serverless API Error]', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal Server Error',
  });
});

export default app;
