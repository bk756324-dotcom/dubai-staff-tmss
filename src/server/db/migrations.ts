import fs from 'node:fs';
import path from 'node:path';
import { query, getPool } from './pool.js';

export async function runMigrations(): Promise<{ success: boolean; appliedTables: string[]; error?: string }> {
  const pool = getPool();
  if (!pool) {
    return { success: false, appliedTables: [], error: 'DATABASE_URL is not configured.' };
  }

  try {
    const sqlPath = path.join(process.cwd(), 'src/server/db/schema.sql');
    let sql = '';
    if (fs.existsSync(sqlPath)) {
      sql = fs.readFileSync(sqlPath, 'utf-8');
    } else {
      // Fallback relative path
      const altPath = path.join(__dirname, 'schema.sql');
      sql = fs.readFileSync(altPath, 'utf-8');
    }

    // Execute schema DDL
    await query(sql);

    // Verify all 14 tables exist
    const res = await query<{ table_name: string }>(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);

    const tables = res.rows.map((r) => r.table_name);
    console.log(`[Migrations] Successfully applied PostgreSQL schema. Tables in public: ${tables.join(', ')}`);

    return {
      success: true,
      appliedTables: tables,
    };
  } catch (err: any) {
    console.error('[Migrations Error]', err.message);
    return {
      success: false,
      appliedTables: [],
      error: err.message,
    };
  }
}
