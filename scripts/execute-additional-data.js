const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Kết nối đến database
const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_JGyM4NXEfVS6@ep-tiny-poetry-a45r81hy-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require',
});

const filePath = path.join(__dirname, '13-seed-additional-data.sql');

// Hàm thực thi file SQL
async function executeSQL() {
  try {
    console.log(`Executing SQL file: ${filePath}`);
    const sql = fs.readFileSync(filePath, 'utf8');
    
    // Chia các câu lệnh SQL thành các phần riêng biệt
    const statements = sql.split(';').filter(stmt => stmt.trim() !== '');
    
    // Thực thi từng câu lệnh SQL một
    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i];
      if (stmt.trim()) {
        try {
          console.log(`Executing statement ${i+1}/${statements.length}: ${stmt.substring(0, 50)}...`);
          await pool.query(stmt + ';');
          console.log(`Statement ${i+1} executed successfully`);
        } catch (err) {
          console.error(`Error executing statement ${i+1}: ${stmt.substring(0, 100)}...`);
          console.error(`Error message: ${err.message}`);
          // Tiếp tục thực thi các câu lệnh khác
        }
      }
    }
    
    console.log(`Successfully executed: ${filePath}`);
    return true;
  } catch (error) {
    console.error(`Error executing ${filePath}:`, error);
    return false;
  } finally {
    await pool.end();
  }
}

executeSQL();