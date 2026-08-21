import dotenv from 'dotenv';
import { runMigrations } from './migrations.js';
import { checkPostgresHealth } from './pool.js';

dotenv.config();

async function main() {
  console.log('[CLI Migrate] Starting PostgreSQL schema migration for Dubai Staff Transport TMS...');
  const health = await checkPostgresHealth();
  if (!health.isConnected) {
    console.error('[CLI Migrate Error] Could not connect to PostgreSQL:', health.error);
    process.exit(1);
  }

  console.log(`[CLI Migrate] Database connected in ${health.latencyMs}ms. Applying schema...`);
  const result = await runMigrations();

  if (result.success) {
    console.log('[CLI Migrate] Migration completed successfully. Tables applied:', result.appliedTables);
    process.exit(0);
  } else {
    console.error('[CLI Migrate Failed]', result.error);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('[CLI Migrate Fatal]', err);
  process.exit(1);
});
