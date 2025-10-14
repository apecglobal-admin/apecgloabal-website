const { Pool } = require('pg');

// Kết nối database
const connectionString = process.env.POSTGRES_URL || 'postgresql://neondb_owner:npg_j3mTncOHAh5Z@ep-wispy-pine-a1vklngi-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

// Dữ liệu công ty con
const subsidiaryCompanies = [
  {
    name: 'Apec BCI',
    slug: 'apec-bci',
    description: 'Thẻ Quyền Năng & Hội Thương Mại - Kết nối doanh nghiệp và cộng đồng thông qua hệ sinh thái thẻ thành viên và mạng lưới thương mại.',
    short_description: 'Thẻ Quyền Năng & Hội Thương Mại',
    industry: 'Thương mại',
    employee_count: 50,

    display_order: 1,
    status: 'active'
  },
  {
    name: 'Life Care',
    slug: 'life-care',
    description: 'Trung Tâm Chăm Sóc Sức Khỏe - Cung cấp dịch vụ chăm sóc sức khỏe toàn diện với công nghệ hiện đại và đội ngũ chuyên gia giàu kinh nghiệm.',
    short_description: 'Trung Tâm Chăm Sóc Sức Khỏe',
    industry: 'Sức khỏe',
    employee_count: 80,

    display_order: 2,
    status: 'active'
  },
  {
    name: 'Ecoop',
    slug: 'ecoop',
    description: 'Tổng Kho Thương Mại A.I - Hệ thống kho bãi thông minh ứng dụng trí tuệ nhân tạo để tối ưu hóa quản lý và vận hành.',
    short_description: 'Tổng Kho Thương Mại A.I',
    industry: 'Thương mại',
    employee_count: 60,

    display_order: 3,
    status: 'active'
  },
  {
    name: 'Queency',
    slug: 'queency',
    description: 'Sản Xuất Bào Tử Vi Khuẩn - Nghiên cứu và sản xuất các sản phẩm sinh học phục vụ nông nghiệp và sức khỏe.',
    short_description: 'Sản Xuất Bào Tử Vi Khuẩn',
    industry: 'Sản xuất',
    employee_count: 40,

    display_order: 4,
    status: 'active'
  },
  {
    name: 'Nam Thiên Long Security',
    slug: 'nam-thien-long',
    description: 'An Ninh Bảo Vệ - Dịch vụ bảo vệ chuyên nghiệp với đội ngũ được đào tạo bài bản và trang thiết bị hiện đại.',
    short_description: 'An Ninh Bảo Vệ',
    industry: 'An ninh',
    employee_count: 200,

    display_order: 5,
    status: 'active'
  },
  {
    name: 'Kangaroo I-On',
    slug: 'kangaroo-ion',
    description: 'Điện Tử Trương Ion Bạc - Sản xuất và phân phối các sản phẩm điện tử ứng dụng công nghệ ion bạc cho sức khỏe.',
    short_description: 'Điện Tử Trương Ion Bạc',
    industry: 'Công nghệ',
    employee_count: 35,

    display_order: 6,
    status: 'active'
  },
  {
    name: 'Apec Space',
    slug: 'apec-space',
    description: 'Siêu Ứng Dụng - Nền tảng ứng dụng tích hợp đa dịch vụ phục vụ nhu cầu đa dạng của người dùng.',
    short_description: 'Siêu Ứng Dụng',
    industry: 'Công nghệ',
    employee_count: 45,

    display_order: 7,
    status: 'active'
  },
  {
    name: 'GuardCam',
    slug: 'guardcam',
    description: 'An Ninh 5.0 - Hệ thống camera an ninh thông minh tích hợp AI để giám sát và bảo vệ tài sản.',
    short_description: 'An Ninh 5.0',
    industry: 'Công nghệ',
    employee_count: 55,

    display_order: 8,
    status: 'active'
  }
];

async function seedCompanies() {
  try {
    console.log('🌱 Bắt đầu seed dữ liệu công ty...\n');

    // Kiểm tra xem đã có công ty nào chưa
    const checkResult = await pool.query('SELECT COUNT(*) FROM companies WHERE is_parent_company = false');
    const existingCount = parseInt(checkResult.rows[0].count);

    if (existingCount > 0) {
      console.log(`⚠️  Đã có ${existingCount} công ty con trong database.`);
      console.log('Bạn có muốn xóa và seed lại không? (Ctrl+C để hủy)\n');
      
      // Xóa các công ty con hiện tại
      await pool.query('DELETE FROM companies WHERE is_parent_company = false');
      console.log('✅ Đã xóa các công ty con cũ.\n');
    }

    // Insert từng công ty
    for (const company of subsidiaryCompanies) {
      const query = `
        INSERT INTO companies (
          name, slug, description, short_description, industry, 
          employee_count, is_parent_company, display_order, status,
          created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        RETURNING id, name
      `;

      const values = [
        company.name,
        company.slug,
        company.description,
        company.short_description,
        company.industry,
        company.employee_count,
        company.is_parent_company,
        company.display_order,
        company.status
      ];

      const result = await pool.query(query, values);
      console.log(`✅ Đã thêm: ${result.rows[0].name} (ID: ${result.rows[0].id})`);
    }

    console.log(`\n🎉 Hoàn thành! Đã seed ${subsidiaryCompanies.length} công ty con.`);

    // Hiển thị danh sách công ty
    const allCompanies = await pool.query(
      'SELECT id, name, slug, industry, employee_count FROM companies WHERE is_parent_company = false ORDER BY display_order'
    );

    console.log('\n📋 Danh sách công ty con:');
    console.table(allCompanies.rows);

  } catch (error) {
    console.error('❌ Lỗi khi seed dữ liệu:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Chạy seed
seedCompanies()
  .then(() => {
    console.log('\n✨ Script hoàn tất!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Script thất bại:', error);
    process.exit(1);
  });