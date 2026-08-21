import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Connection string from environment variable
const connectionString = process.env.DATABASE_URL || process.env.DATABASE_DIRECT_URL;

// Parse SSL requirements based on environment or connection string
const isProduction = process.env.NODE_ENV === 'production';
const requiresSsl = connectionString?.includes('sslmode=') || connectionString?.includes('supabase') || connectionString?.includes('neon') || isProduction;

let pool: pg.Pool | null = null;

export function getPool(): pg.Pool | null {
  if (!connectionString) {
    return null;
  }

  if (!pool) {
    try {
      pool = new Pool({
        connectionString,
        max: 20, // maximum connection pool size
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 10000,
        ssl: requiresSsl ? { rejectUnauthorized: false } : undefined,
      });

      pool.on('error', (err) => {
        console.error('[PostgreSQL Pool Error]', err.message);
      });
    } catch (err: any) {
      console.error('[PostgreSQL Pool Init Error]', err.message);
      pool = null;
    }
  }

  return pool;
}

/**
 * Parameterized query helper with sanitized logging and graceful failure
 */
export async function query<T = any>(text: string, params: any[] = []): Promise<pg.QueryResult<T>> {
  const p = getPool();
  if (!p) {
    throw new Error('Database connection pool is not initialized. Check DATABASE_URL configuration.');
  }

  const start = Date.now();
  try {
    const res = await p.query<T>(text, params);
    const duration = Date.now() - start;
    if (duration > 1000) {
      console.warn(`[Slow Query] (${duration}ms) ${text.substring(0, 100)}...`);
    }
    return res;
  } catch (err: any) {
    console.error(`[Query Error] ${err.message}`);
    throw err;
  }
}

/**
 * Execute atomic multi-step database operations in a transaction
 */
export async function withTransaction<T>(callback: (client: pg.PoolClient) => Promise<T>): Promise<T> {
  const p = getPool();
  if (!p) {
    throw new Error('Database connection pool is not initialized. Check DATABASE_URL configuration.');
  }

  const client = await p.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

/**
 * Health check for PostgreSQL connectivity
 */
export async function checkPostgresHealth(): Promise<{ isConnected: boolean; latencyMs?: number; error?: string }> {
  if (!connectionString) {
    return { isConnected: false, error: 'DATABASE_URL not configured' };
  }

  const start = Date.now();
  try {
    const res = await query('SELECT 1 as health_check');
    const latencyMs = Date.now() - start;
    return {
      isConnected: res.rows.length > 0,
      latencyMs,
    };
  } catch (err: any) {
    return {
      isConnected: false,
      error: err.message,
    };
  }
}
