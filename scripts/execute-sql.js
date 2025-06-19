const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Kết nối đến database
const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_JGyM4NXEfVS6@ep-tiny-poetry-a45r81hy-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require',
});

// Lấy tên file SQL từ tham số dòng lệnh
const sqlFile = process.argv[2];
if (!sqlFile) {
  console.error('Please provide an SQL file name as argument');
  process.exit(1);
}

const filePath = path.join(__dirname, sqlFile);

// Thực thi file SQL
async function executeSQL() {
  try {
    console.log(`Executing SQL file: ${filePath}`);
    const sql = fs.readFileSync(filePath, 'utf8');
    console.log(`SQL content (first 100 chars): ${sql.substring(0, 100)}...`);
    
    const result = await pool.query(sql);
    console.log(`Successfully executed: ${filePath}`);
    console.log('Result:', result);
    return true;
  } catch (error) {
    console.error(`Error executing ${filePath}:`, error);
    return false;
  } finally {
    await pool.end();
  }
}

executeSQL();