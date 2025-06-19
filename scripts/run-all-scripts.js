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
  '02-seed-companies.sql',
  '03-seed-services.sql',
  '04-seed-news.sql',
  '05-seed-jobs.sql',
  '06-seed-projects.sql',
];

// Hàm thực thi một file SQL
async function executeSQL(filePath) {
  try {
    console.log(`Executing SQL file: ${filePath}`);
    const sql = fs.readFileSync(filePath, 'utf8');
    console.log(`SQL content: ${sql.substring(0, 100)}...`);
    const result = await pool.query(sql);
    console.log(`Successfully executed: ${filePath}, Result:`, result);
    return true;
  } catch (error) {
    console.error(`Error executing ${filePath}:`, error);
    return false;
  }
}

// Hàm thực thi tất cả các file SQL theo thứ tự
async function runAllScripts() {
  try {
    for (const file of sqlFiles) {
      const filePath = path.join(__dirname, file);
      const success = await executeSQL(filePath);
      if (!success) {
        console.error(`Failed to execute ${file}. Stopping execution.`);
        break;
      }
    }
    console.log('All scripts executed successfully!');
  } catch (error) {
    console.error('Error running scripts:', error);
  } finally {
    // Đóng kết nối
    await pool.end();
  }
}

// Chạy tất cả các script
runAllScripts();