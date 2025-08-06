// Simple test to check database connection and run migration
const { Pool } = require('pg');

const connectionString = 'postgresql://neondb_owner:npg_j3mTncOHAh5Z@ep-wispy-pine-a1vklngi-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

async function runMigration() {
  try {
    console.log('Testing database connection...');
    
    // Test connection
    const testResult = await pool.query('SELECT NOW()');
    console.log('✅ Database connected successfully:', testResult.rows[0]);
    
    console.log('\nRunning migration steps...');
    
    // Step 1: Add is_parent_company column
    console.log('1. Adding is_parent_company column...');
    await pool.query('ALTER TABLE companies ADD COLUMN IF NOT EXISTS is_parent_company BOOLEAN DEFAULT FALSE');
    console.log('✅ Added is_parent_company column');
    
    // Step 2: Set first company as parent
    console.log('2. Setting first company as parent...');
    await pool.query('UPDATE companies SET is_parent_company = TRUE WHERE id = (SELECT MIN(id) FROM companies)');
    console.log('✅ Set parent company');
    
    // Step 3: Check if company_id column exists in departments
    console.log('3. Checking departments table structure...');
    const columnCheck = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'departments' AND column_name = 'company_id'
    `);
    
    if (columnCheck.rows.length > 0) {
      console.log('4. Removing company_id from departments...');
      // Drop foreign key constraint if exists
      try {
        await pool.query('ALTER TABLE departments DROP CONSTRAINT IF EXISTS departments_company_id_fkey');
        console.log('✅ Dropped foreign key constraint');
      } catch (error) {
        console.log('No foreign key constraint to drop');
      }
      
      // Drop column
      await pool.query('ALTER TABLE departments DROP COLUMN company_id');
      console.log('✅ Removed company_id column from departments');
    } else {
      console.log('✅ company_id column already removed from departments');
    }
    
    // Step 4: Create index
    console.log('5. Creating index...');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_companies_is_parent ON companies(is_parent_company)');
    console.log('✅ Created index');
    
    console.log('\n🎉 Migration completed successfully!');
    
    // Show results
    console.log('\nCurrent parent company:');
    const parentResult = await pool.query('SELECT * FROM companies WHERE is_parent_company = true');
    console.log(parentResult.rows[0]);
    
    console.log('\nDepartments structure:');
    const deptStructure = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'departments' 
      ORDER BY ordinal_position
    `);
    console.log(deptStructure.rows);
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error('Full error:', error);
  } finally {
    await pool.end();
  }
}

runMigration();