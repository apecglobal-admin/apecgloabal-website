const { Pool } = require('pg');

// Kết nối đến database
const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_JGyM4NXEfVS6@ep-tiny-poetry-a45r81hy-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require',
});

async function testConnection() {
  try {
    console.log('Testing database connection...');
    const result = await pool.query('SELECT NOW()');
    console.log('Connection successful!');
    console.log('Current time from database:', result.rows[0].now);
    return true;
  } catch (error) {
    console.error('Error connecting to database:', error);
    return false;
  } finally {
    await pool.end();
  }
}

testConnection();