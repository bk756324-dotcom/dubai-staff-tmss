import { TableName, DatabaseSchema } from './schema.js';
import { getPool, query, withTransaction } from './pool.js';
import { runMigrations } from './migrations.js';
import { seedPostgres } from './seed-pg.js';
import {
  SEED_USERS,
  SEED_VEHICLES,
  SEED_DRIVERS,
  SEED_CLIENTS,
  SEED_PASSENGERS,
  SEED_ROUTES,
  SEED_TRIPS,
  SEED_LOCATIONS,
  SEED_MAINTENANCE,
  SEED_DOCUMENTS,
  SEED_NOTIFICATIONS,
  SEED_INQUIRIES,
  SEED_SALIK_TRANSACTIONS,
} from './seeds.js';

// Table name mapping: camelCase (TypeScript) -> snake_case (PostgreSQL)
const TABLE_SQL_MAP: Record<TableName, string> = {
  users: 'users',
  vehicles: 'vehicles',
  drivers: 'drivers',
  clients: 'clients',
  passengers: 'passengers',
  routes: 'routes',
  trips: 'trips',
  locations: 'locations',
  maintenance: 'maintenance',
  documents: 'documents',
  notifications: 'notifications',
  inquiries: 'inquiries',
  salikTransactions: 'salik_transactions',
};

// Helper: Convert snake_case DB row to camelCase JS object
export function fromPgRow(row: Record<string, any>): any {
  if (!row || typeof row !== 'object') return row;
  const result: Record<string, any> = {};

  for (const [key, val] of Object.entries(row)) {
    const camelKey = key.replace(/_([a-z0-9])/g, (_, letter) => letter.toUpperCase());

    // Numerical conversions for NUMERIC types from pg (which returns string)
    if (
      (key.endsWith('_aed') ||
        key.endsWith('_km') ||
        key.endsWith('_km_h') ||
        key === 'safety_rating' ||
        key === 'distance_km' ||
        key === 'current_mileage_km' ||
        key === 'odometer_reading' ||
        key === 'cost_aed' ||
        key === 'monthly_billing_aed' ||
        key === 'quoted_amount_aed' ||
        key === 'amount_aed') &&
      val !== null &&
      val !== undefined &&
      typeof val === 'string'
    ) {
      result[camelKey] = parseFloat(val);
    } else if (
      (key.endsWith('_count') ||
        key === 'capacity' ||
        key === 'year' ||
        key === 'total_trips_completed' ||
        key === 'estimated_duration_min' ||
        key === 'stop_count' ||
        key === 'passenger_count' ||
        key === 'boarded_passenger_count' ||
        key === 'delay_minutes' ||
        key === 'estimated_passengers') &&
      val !== null &&
      val !== undefined &&
      typeof val === 'string'
    ) {
      result[camelKey] = parseInt(val, 10);
    } else if (val instanceof Date) {
      result[camelKey] = val.toISOString();
    } else {
      result[camelKey] = val;
    }
  }

  return result;
}

// Helper: Convert camelCase JS object to snake_case DB columns and values
export function toPgRow(obj: Record<string, any>): { columns: string[]; values: any[]; placeholders: string[] } {
  const columns: string[] = [];
  const values: any[] = [];
  const placeholders: string[] = [];

  let idx = 1;
  for (const [key, val] of Object.entries(obj)) {
    // Map camelCase to snake_case
    const snakeKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
    columns.push(snakeKey);

    // If val is an object or array and not a Date/Buffer, stringify for JSONB columns
    if (val !== null && typeof val === 'object' && !(val instanceof Date)) {
      values.push(JSON.stringify(val));
    } else {
      values.push(val);
    }

    placeholders.push(`$${idx}`);
    idx++;
  }

  return { columns, values, placeholders };
}

export class PostgresDatabaseEngine {
  private inMemoryCache: DatabaseSchema;
  private isPostgresConnected = false;
  private isInitialized = false;

  constructor() {
    this.inMemoryCache = this.getDefaultSchema();
  }

  public getDefaultSchema(): DatabaseSchema {
    return {
      users: SEED_USERS.map(({ passwordHash, ...user }) => user as any),
      vehicles: [...SEED_VEHICLES],
      drivers: [...SEED_DRIVERS],
      clients: [...SEED_CLIENTS],
      passengers: [...SEED_PASSENGERS],
      routes: [...SEED_ROUTES],
      trips: [...SEED_TRIPS],
      locations: [...SEED_LOCATIONS],
      maintenance: [...SEED_MAINTENANCE],
      documents: [...SEED_DOCUMENTS],
      notifications: [...SEED_NOTIFICATIONS],
      inquiries: [...SEED_INQUIRIES],
      salikTransactions: [...SEED_SALIK_TRANSACTIONS],
      systemMeta: {
        initializedAt: new Date().toISOString(),
        version: '1.0.0',
        seedVersion: '2026-Q3-PROMPT-9-PG',
      },
    };
  }

  public async init(): Promise<void> {
    if (this.isInitialized) return;

    const pool = getPool();
    if (pool) {
      try {
        console.log('[PostgresDatabase] Testing connection to PostgreSQL...');
        const migrationResult = await runMigrations();
        if (migrationResult.success) {
          this.isPostgresConnected = true;

          // Check if database is empty, if so, seed it
          const countRes = await query<{ count: string }>('SELECT COUNT(*) as count FROM users');
          const userCount = parseInt(countRes.rows[0]?.count || '0', 10);
          if (userCount === 0) {
            console.log('[PostgresDatabase] Empty database detected. Seeding initial Dubai TMS dataset...');
            await seedPostgres();
          }

          // Hydrate in-memory cache from PostgreSQL
          await this.refreshCacheFromPostgres();
          this.isInitialized = true;
          console.log('[PostgresDatabase] Successfully connected & synchronized with PostgreSQL.');
          return;
        } else {
          console.warn('[PostgresDatabase] Migration check failed:', migrationResult.error);
        }
      } catch (err: any) {
        console.warn('[PostgresDatabase] PostgreSQL connection failed. Falling back to local cache mode:', err.message);
      }
    } else {
      console.log('[PostgresDatabase] DATABASE_URL not supplied. Running in high-performance in-memory mode.');
    }

    this.isInitialized = true;
  }

  /**
   * Synchronize cache from PostgreSQL database
   */
  public async refreshCacheFromPostgres(): Promise<void> {
    if (!this.isPostgresConnected) return;

    try {
      const tables: TableName[] = [
        'users',
        'vehicles',
        'drivers',
        'clients',
        'passengers',
        'routes',
        'trips',
        'locations',
        'maintenance',
        'documents',
        'notifications',
        'inquiries',
        'salikTransactions',
      ];

      for (const t of tables) {
        const sqlTable = TABLE_SQL_MAP[t];
        const res = await query(`SELECT * FROM ${sqlTable} ORDER BY created_at DESC`);
        (this.inMemoryCache[t] as any[]) = res.rows.map(fromPgRow);
      }
    } catch (err: any) {
      console.error('[PostgresDatabase] Error refreshing cache from PostgreSQL:', err.message);
    }
  }

  // --- CRUD METHODS MATCHING EXISTING SIGNATURES ---

  public getAll<T extends TableName>(table: T): DatabaseSchema[T] {
    return (this.inMemoryCache[table] || []) as DatabaseSchema[T];
  }

  public getById<T extends TableName>(table: T, id: string): any | undefined {
    const list = this.getAll(table);
    return list.find((item: any) => item.id === id);
  }

  public find<T extends TableName>(table: T, predicate: (item: any) => boolean): any[] {
    const list = this.getAll(table);
    return list.filter(predicate);
  }

  public findOne<T extends TableName>(table: T, predicate: (item: any) => boolean): any | undefined {
    const list = this.getAll(table);
    return list.find(predicate);
  }

  public create<T extends TableName>(table: T, record: any): any {
    const now = new Date().toISOString();
    const newRecord = {
      ...record,
      id: record.id || `${table.slice(0, 3)}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: record.createdAt || now,
      updatedAt: now,
    };

    // Update in-memory cache instantly
    (this.inMemoryCache[table] as any[]).unshift(newRecord);

    // Asynchronously persist to PostgreSQL with parameterized query
    if (this.isPostgresConnected) {
      const sqlTable = TABLE_SQL_MAP[table];
      const { columns, values, placeholders } = toPgRow(newRecord);
      const sql = `INSERT INTO ${sqlTable} (${columns.join(', ')}) VALUES (${placeholders.join(', ')}) ON CONFLICT (id) DO UPDATE SET ${columns
        .filter((c) => c !== 'id')
        .map((c) => `${c} = EXCLUDED.${c}`)
        .join(', ')}`;

      query(sql, values).catch((err) => {
        console.error(`[PostgresDatabase Create Error] on ${sqlTable}:`, err.message);
      });
    }

    return newRecord;
  }

  public update<T extends TableName>(table: T, id: string, updates: Partial<any>): any | undefined {
    const list = this.inMemoryCache[table] as any[];
    const index = list.findIndex((item: any) => item.id === id);
    if (index === -1) return undefined;

    const now = new Date().toISOString();
    const updatedRecord = {
      ...list[index],
      ...updates,
      id, // protect ID from alteration
      updatedAt: now,
    };

    list[index] = updatedRecord;

    // Asynchronously persist update to PostgreSQL with parameterized query
    if (this.isPostgresConnected) {
      const sqlTable = TABLE_SQL_MAP[table];
      const { columns, values, placeholders } = toPgRow({ ...updates, updatedAt: now });

      const setClauses = columns.map((col, idx) => `${col} = $${idx + 1}`).join(', ');
      const sql = `UPDATE ${sqlTable} SET ${setClauses} WHERE id = $${columns.length + 1}`;

      query(sql, [...values, id]).catch((err) => {
        console.error(`[PostgresDatabase Update Error] on ${sqlTable}:`, err.message);
      });
    }

    return updatedRecord;
  }

  public delete<T extends TableName>(table: T, id: string): boolean {
    const list = this.inMemoryCache[table] as any[];
    const initialLen = list.length;
    this.inMemoryCache[table] = list.filter((item: any) => item.id !== id) as any;

    const removed = this.inMemoryCache[table].length !== initialLen;

    if (removed && this.isPostgresConnected) {
      const sqlTable = TABLE_SQL_MAP[table];
      query(`DELETE FROM ${sqlTable} WHERE id = $1`, [id]).catch((err) => {
        console.error(`[PostgresDatabase Delete Error] on ${sqlTable}:`, err.message);
      });
    }

    return removed;
  }

  public count<T extends TableName>(table: T): number {
    return (this.inMemoryCache[table] || []).length;
  }

  public getUserPasswordHash(email: string): string | undefined {
    const seedUser = SEED_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (seedUser) return seedUser.passwordHash;
    // Default fallback hash for created users (matches 'admin123')
    return '$2a$10$w8FeqT4J8vFq8Uo00bA/Xevv.0wWv6Z6n5d8c3H3fJ1E0TzCq4w0e';
  }

  public getSystemStats() {
    return {
      status: this.isPostgresConnected ? 'HEALTHY_POSTGRES' : 'HEALTHY_LOCAL',
      databaseEngine: this.isPostgresConnected ? 'PostgreSQL' : 'In-Memory Engine',
      version: this.inMemoryCache.systemMeta.version,
      initializedAt: this.inMemoryCache.systemMeta.initializedAt,
      seedVersion: this.inMemoryCache.systemMeta.seedVersion,
      counts: {
        users: this.count('users'),
        vehicles: this.count('vehicles'),
        drivers: this.count('drivers'),
        clients: this.count('clients'),
        passengers: this.count('passengers'),
        routes: this.count('routes'),
        trips: this.count('trips'),
        locations: this.count('locations'),
        maintenance: this.count('maintenance'),
        documents: this.count('documents'),
        notifications: this.count('notifications'),
        inquiries: this.count('inquiries'),
        salikTransactions: this.count('salikTransactions'),
      },
    };
  }

  public async resetToSeeds(): Promise<void> {
    this.inMemoryCache = this.getDefaultSchema();
    if (this.isPostgresConnected) {
      await seedPostgres();
      await this.refreshCacheFromPostgres();
    }
    console.log('[PostgresDatabase] Database reset to initial Dubai seeds.');
  }

  // --- DIRECT ASYNC / TRANSACTION OPERATIONS ---
  public async asyncQuery<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    const res = await query<T>(sql, params);
    return res.rows.map(fromPgRow);
  }

  public async transaction<T>(callback: (client: any) => Promise<T>): Promise<T> {
    return withTransaction(callback);
  }
}

export const db = new PostgresDatabaseEngine();
