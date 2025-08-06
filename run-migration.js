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
  const migrationPath = path.join(__dirname, 'migrations', '009_update_company_department_structure.sql');
  
  try {
    console.log('Reading migration file...');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('Running migration...');
    await pool.query(migrationSQL);
    
    console.log('✅ Migration completed successfully!');
    console.log('Changes applied:');
    console.log('- Added is_parent_company field to companies table');
    console.log('- Removed company_id field from departments table');
    console.log('- Set first company as parent company');
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error('Full error:', error);
  } finally {
    await pool.end();
  }
}

runMigration();