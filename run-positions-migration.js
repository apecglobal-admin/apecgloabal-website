const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Database configuration - using same as project
const connectionString = process.env.POSTGRES_URL || 'postgresql://neondb_owner:npg_j3mTncOHAh5Z@ep-wispy-pine-a1vklngi-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

async function runMigration() {
  try {
    console.log('Reading migration file...');
    const migrationPath = path.join(__dirname, 'migrations', '010_create_positions_simple.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('Running positions migration...');
    
    // Execute the migration
    await pool.query(migrationSQL);
    
    console.log('✅ Positions migration completed successfully!');
    console.log('Changes applied:');
    console.log('- Created positions table');
    console.log('- Added sample positions data');
    console.log('- Created indexes and triggers');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error('Full error:', error);
  } finally {
    await pool.end();
  }
}

runMigration();