const { Pool } = require('pg');

// Khởi tạo kết nối PostgreSQL
const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_JGyM4NXEfVS6@ep-tiny-poetry-a45r81hy-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require',
});

async function checkProjectsData() {
  const client = await pool.connect();
  
  try {
    // Kiểm tra cấu trúc bảng projects
    console.log('Kiểm tra cấu trúc bảng projects:');
    const tableStructure = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'projects'
      ORDER BY ordinal_position
    `);
    
    console.log('Cấu trúc bảng projects:');
    tableStructure.rows.forEach(column => {
      console.log(`${column.column_name}: ${column.data_type}`);
    });
    
    console.log('\n-----------------------------------\n');
    
    // Kiểm tra dữ liệu trong bảng projects
    console.log('Kiểm tra dữ liệu trong bảng projects:');
    const projectsData = await client.query(`
      SELECT id, name, slug, description, company_id, status, progress
      FROM projects
      ORDER BY id
    `);
    
    console.log(`Số lượng dự án: ${projectsData.rows.length}`);
    console.log('Danh sách dự án:');
    projectsData.rows.forEach(project => {
      console.log(`ID: ${project.id}, Tên: ${project.name}, Slug: ${project.slug || 'N/A'}, Status: ${project.status}, Progress: ${project.progress}%`);
    });
    
    console.log('\n-----------------------------------\n');
    
    // Kiểm tra xem có dự án nào chưa có slug không
    const projectsWithoutSlug = await client.query(`
      SELECT id, name
      FROM projects
      WHERE slug IS NULL OR slug = ''
    `);
    
    console.log(`Số lượng dự án chưa có slug: ${projectsWithoutSlug.rows.length}`);
    if (projectsWithoutSlug.rows.length > 0) {
      console.log('Danh sách dự án chưa có slug:');
      projectsWithoutSlug.rows.forEach(project => {
        console.log(`ID: ${project.id}, Tên: ${project.name}`);
      });
    }
    
  } catch (error) {
    console.error('Lỗi khi kiểm tra dữ liệu:', error);
  } finally {
    client.release();
    pool.end();
  }
}

// Thực thi hàm
checkProjectsData();