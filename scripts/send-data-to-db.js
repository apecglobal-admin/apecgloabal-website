const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Kết nối đến database
const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_JGyM4NXEfVS6@ep-tiny-poetry-a45r81hy-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require',
});

// Danh sách các file SQL cần thực thi theo thứ tự
const sqlFiles = [
  '01-create-tables.sql',
  '12-additional-tables.sql',
  '02-seed-companies.sql',
  '07-seed-departments.sql',
  '08-seed-employees.sql',
  '03-seed-services.sql',
  '14-authors-table.sql',
  '04-seed-news.sql',
  '05-seed-jobs.sql',
  '06-seed-projects.sql',
  '09-seed-documents.sql',
  '10-seed-reports.sql',
  '11-seed-users.sql',
  '13-seed-additional-data.sql',
];

// Hàm thực thi một file SQL
async function executeSQL(filePath) {
  try {
    process.stdout.write(`Executing SQL file: ${filePath}... `);
    const sql = fs.readFileSync(filePath, 'utf8');
    
    // Chia các câu lệnh SQL thành các phần riêng biệt
    const statements = sql.split(';').filter(stmt => stmt.trim() !== '');
    
    // Thực thi từng câu lệnh SQL một
    for (const stmt of statements) {
      if (stmt.trim()) {
        try {
          await pool.query(stmt + ';');
        } catch (err) {
          console.error(`Error executing statement: ${stmt.substring(0, 100)}...`);
          console.error(`Error message: ${err.message}`);
          throw err;
        }
      }
    }
    
    process.stdout.write('SUCCESS\n');
    return true;
  } catch (error) {
    process.stdout.write('FAILED\n');
    console.error(`Error executing ${filePath}:`, error.message);
    return false;
  }
}

// Hàm thực thi tất cả các file SQL theo thứ tự
async function runAllScripts() {
  try {
    console.log('Starting database setup...');
    
    for (const file of sqlFiles) {
      const filePath = path.join(__dirname, file);
      const success = await executeSQL(filePath);
      if (!success) {
        console.error(`Failed to execute ${file}. Stopping execution.`);
        break;
      }
    }
    
    console.log('Database setup completed successfully!');
  } catch (error) {
    console.error('Error running scripts:', error.message);
  } finally {
    // Đóng kết nối
    await pool.end();
  }
}

// Chạy tất cả các script
runAllScripts();