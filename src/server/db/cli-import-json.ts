import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';
import { query, checkPostgresHealth } from './pool.js';
import { runMigrations } from './migrations.js';
import { toPgRow } from './postgres-db.js';

dotenv.config();

const JSON_PATH = path.join(process.cwd(), '.data/tms-db.json');

async function importJsonToPostgres() {
  console.log('[JSON Importer] Inspecting local database storage at:', JSON_PATH);

  if (!fs.existsSync(JSON_PATH)) {
    console.log('[JSON Importer] No .data/tms-db.json file found. Nothing to import.');
    return;
  }

  const raw = fs.readFileSync(JSON_PATH, 'utf-8');
  let data: any;
  try {
    data = JSON.parse(raw);
  } catch (err: any) {
    console.error('[JSON Importer Error] Could not parse JSON file:', err.message);
    return;
  }

  const health = await checkPostgresHealth();
  if (!health.isConnected) {
    console.error('[JSON Importer Error] PostgreSQL is not connected. Check DATABASE_URL.');
    return;
  }

  console.log('[JSON Importer] Ensuring PostgreSQL schema exists...');
  await runMigrations();

  const tableMap: Record<string, string> = {
    users: 'users',
    clients: 'clients',
    vehicles: 'vehicles',
    drivers: 'drivers',
    routes: 'routes',
    passengers: 'passengers',
    trips: 'trips',
    locations: 'locations',
    maintenance: 'maintenance',
    documents: 'documents',
    notifications: 'notifications',
    inquiries: 'inquiries',
    salikTransactions: 'salik_transactions',
  };

  const importStats: Record<string, number> = {};

  for (const [jsonKey, sqlTable] of Object.entries(tableMap)) {
    const records = data[jsonKey] || [];
    if (!Array.isArray(records) || records.length === 0) continue;

    let imported = 0;
    for (const item of records) {
      try {
        const { columns, values, placeholders } = toPgRow(item);
        const updateClauses = columns
          .filter((c) => c !== 'id')
          .map((c) => `${c} = EXCLUDED.${c}`)
          .join(', ');

        const sql = `INSERT INTO ${sqlTable} (${columns.join(', ')})
                     VALUES (${placeholders.join(', ')})
                     ON CONFLICT (id) DO UPDATE SET ${updateClauses}`;

        await query(sql, values);
        imported++;
      } catch (insertErr: any) {
        console.warn(`[JSON Importer] Warning inserting record in ${sqlTable}:`, insertErr.message);
      }
    }
    importStats[jsonKey] = imported;
  }

  console.log('[JSON Importer] Data migration from .data/tms-db.json completed successfully!');
  console.log('[JSON Importer] Records imported:', importStats);
}

importJsonToPostgres().catch((err) => {
  console.error('[JSON Importer Fatal]', err);
  process.exit(1);
});
