import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSchema, TableName } from './schema.js';
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

const DATA_DIR = path.join(process.cwd(), '.data');
const DB_FILE_PATH = path.join(DATA_DIR, 'tms-db.json');

class DatabaseEngine {
  private data: DatabaseSchema;
  private isInitialized = false;

  constructor() {
    this.data = this.getDefaultSchema();
  }

  private getDefaultSchema(): DatabaseSchema {
    return {
      users: SEED_USERS.map(({ passwordHash, ...user }) => user),
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
        seedVersion: '2026-Q3-PROMPT-1',
      },
    };
  }

  public async init(): Promise<void> {
    if (this.isInitialized) return;

    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE_PATH)) {
        const raw = fs.readFileSync(DB_FILE_PATH, 'utf-8');
        try {
          const parsed = JSON.parse(raw);
          if (parsed && parsed.systemMeta) {
            this.data = parsed;
            if (!this.data.salikTransactions) {
              this.data.salikTransactions = [...SEED_SALIK_TRANSACTIONS];
            }
            if (!this.data.trips || this.data.trips.length < SEED_TRIPS.length) {
              this.data.trips = [...SEED_TRIPS];
            }
            this.isInitialized = true;
            console.log('[Database] Loaded existing database from disk.');
            return;
          }
        } catch (parseErr) {
          console.warn('[Database] Corrupted database file detected, re-initializing from seeds.', parseErr);
        }
      }

      // Initialize with fresh seed data
      this.data = this.getDefaultSchema();
      this.persistSync();
      this.isInitialized = true;
      console.log('[Database] Initialized fresh TMS database with Dubai seeds.');
    } catch (err) {
      console.error('[Database] Failed to initialize database storage:', err);
      // Fallback to in-memory
      this.data = this.getDefaultSchema();
      this.isInitialized = true;
    }
  }

  private persistSync(): void {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      const tmpPath = `${DB_FILE_PATH}.tmp`;
      fs.writeFileSync(tmpPath, JSON.stringify(this.data, null, 2), 'utf-8');
      fs.renameSync(tmpPath, DB_FILE_PATH);
    } catch (err) {
      console.error('[Database] Error persisting data to disk:', err);
    }
  }

  // Generic CRUD Operations
  public getAll<T extends TableName>(table: T): DatabaseSchema[T] {
    return (this.data[table] || []) as DatabaseSchema[T];
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

    (this.data[table] as any[]).unshift(newRecord);
    this.persistSync();
    return newRecord;
  }

  public update<T extends TableName>(table: T, id: string, updates: Partial<any>): any | undefined {
    const list = this.data[table] as any[];
    const index = list.findIndex((item: any) => item.id === id);
    if (index === -1) return undefined;

    const now = new Date().toISOString();
    list[index] = {
      ...list[index],
      ...updates,
      id, // protect ID from accidental overwrite
      updatedAt: now,
    };

    this.persistSync();
    return list[index];
  }

  public delete<T extends TableName>(table: T, id: string): boolean {
    const list = this.data[table] as any[];
    const initialLen = list.length;
    this.data[table] = list.filter((item: any) => item.id !== id) as any;

    if (this.data[table].length !== initialLen) {
      this.persistSync();
      return true;
    }
    return false;
  }

  public count<T extends TableName>(table: T): number {
    return (this.data[table] || []).length;
  }

  // Password hash retrieval (users have hashed passwords in SEED_USERS or custom storage)
  public getUserPasswordHash(email: string): string | undefined {
    const seedUser = SEED_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (seedUser) return seedUser.passwordHash;
    // Default fallback hash for all newly registered mock users (matches 'admin123')
    return '$2a$10$w8FeqT4J8vFq8Uo00bA/Xevv.0wWv6Z6n5d8c3H3fJ1E0TzCq4w0e';
  }

  // Database System Metadata & Metrics
  public getSystemStats() {
    return {
      status: 'HEALTHY',
      version: this.data.systemMeta.version,
      initializedAt: this.data.systemMeta.initializedAt,
      seedVersion: this.data.systemMeta.seedVersion,
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
      },
    };
  }

  // Reset to initial seeds
  public resetToSeeds(): void {
    this.data = this.getDefaultSchema();
    this.persistSync();
    console.log('[Database] Database reset to initial seeds.');
  }
}

export const db = new DatabaseEngine();
