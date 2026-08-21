import dotenv from 'dotenv';
import { seedPostgres } from './seed-pg.js';
import { checkPostgresHealth } from './pool.js';

dotenv.config();

async function main() {
  console.log('[CLI Seed] Seeding Dubai Staff Transport TMS data into PostgreSQL...');
  const health = await checkPostgresHealth();
  if (!health.isConnected) {
    console.error('[CLI Seed Error] Could not connect to PostgreSQL:', health.error);
    process.exit(1);
  }

  console.log(`[CLI Seed] Connected to database in ${health.latencyMs}ms. Seeding tables...`);
  const result = await seedPostgres();

  if (result.success) {
    console.log('[CLI Seed] Database successfully seeded with Dubai operational data.');
    console.log('[CLI Seed] Seed statistics:', result.counts);
    process.exit(0);
  } else {
    console.error('[CLI Seed Failed]', result.error);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('[CLI Seed Fatal]', err);
  process.exit(1);
});
