import { Pool } from 'pg';

// Khởi tạo kết nối PostgreSQL
const connectionString = process.env.POSTGRES_URL || 'postgresql://neondb_owner:npg_j3mTncOHAh5Z@ep-wispy-pine-a1vklngi-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';
// Tạo pool connection chỉ ở phía server
let pool: Pool;

if (typeof window === 'undefined') {
  // Chỉ tạo pool ở phía server
  if (!global.pg) {
    global.pg = {};
  }
  
  if (!global.pg.pool) {
    global.pg.pool = new Pool({
      connectionString,
      ssl: {
        rejectUnauthorized: false
      }
    });
  }
  
  pool = global.pg.pool;
} else {
  // Dummy pool cho phía client
  pool = {} as Pool;
}

// Hàm thực thi truy vấn
export async function query(text: string, params?: any[]) {
  // Kiểm tra xem có đang ở phía server không
  if (typeof window !== 'undefined') {
    console.error('Database query attempted on client side');
    throw new Error('Cannot execute database query on the client side');
  }

  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Error executing query', error);
    throw error;
  }
}

// Hàm lấy tất cả công ty
export async function getAllCompanies() {
  const result = await query('SELECT * FROM companies ORDER BY name');
  return result.rows;
}

// Hàm lấy công ty theo slug
export async function getCompanyBySlug(slug: string) {
  const result = await query('SELECT * FROM companies WHERE slug = $1', [slug]);
  return result.rows[0];
}

// Hàm lấy thông tin chi tiết công ty bao gồm số lượng dự án, nhân viên, dịch vụ
export async function getCompanyDetails(slug: string) {
  // Lấy thông tin cơ bản của công ty
  const company = await getCompanyBySlug(slug);
  
  if (!company) return null;
  
  // Lấy số lượng dự án
  const projectsCountResult = await query('SELECT COUNT(*) FROM projects WHERE company_id = $1', [company.id]);
  const projectsCount = parseInt(projectsCountResult.rows[0].count);
  
  // Lấy số lượng nhân viên
  const employeesCountResult = await query('SELECT COUNT(*) FROM employees WHERE company_id = $1', [company.id]);
  const employeesCount = parseInt(employeesCountResult.rows[0].count);
  
  // Lấy số lượng dịch vụ
  const servicesCountResult = await query('SELECT COUNT(*) FROM services WHERE company_id = $1', [company.id]);
  const servicesCount = parseInt(servicesCountResult.rows[0].count);
  
  // Lấy danh sách phòng ban
  const departmentsResult = await query('SELECT * FROM departments WHERE company_id = $1', [company.id]);
  const departments = departmentsResult.rows;
  
  // Lấy danh sách tài liệu công ty
  const documentsResult = await query(`
    SELECT * FROM documents 
    WHERE category = 'company' AND is_public = true
    ORDER BY created_at DESC
    LIMIT 10
  `);
  const documents = documentsResult.rows;
  
  return {
    ...company,
    projectsCount,
    employeesCount,
    servicesCount,
    departments,
    documents
  };
}

// Hàm lấy tất cả dịch vụ
export async function getAllServices() {
  const result = await query('SELECT * FROM services ORDER BY title');
  return result.rows;
}

// Hàm lấy dịch vụ theo công ty
export async function getServicesByCompany(companyId: number) {
  const result = await query('SELECT * FROM services WHERE company_id = $1', [companyId]);
  return result.rows;
}

// Hàm lấy tất cả tin tức
export async function getAllNews() {
  try {
    // Thử lấy tin tức với join authors
    const result = await query(`
      SELECT n.*, a.name as author_name, a.avatar_url as author_avatar
      FROM news n
      LEFT JOIN authors a ON n.author_id = a.id
      WHERE n.published = true 
      ORDER BY n.published_at DESC
    `);
    return result.rows;
  } catch (error) {
    console.log('Error with authors join in getAllNews, trying without authors:', error);
    // Nếu có lỗi, thử truy vấn không có bảng authors
    const result = await query('SELECT * FROM news WHERE published = true ORDER BY published_at DESC');
    return result.rows;
  }
}

// Hàm lấy tất cả việc làm
export async function getAllJobs() {
  const result = await query('SELECT * FROM jobs WHERE status = $1 ORDER BY created_at DESC', ['active']);
  return result.rows;
}

// Hàm lấy tất cả dự án
export async function getAllProjects() {
  const result = await query(`
    SELECT p.*, c.name as company_name, c.logo_url as company_logo 
    FROM projects p
    LEFT JOIN companies c ON p.company_id = c.id
    ORDER BY p.start_date DESC
  `);
  return result.rows;
}

// Hàm lấy dự án theo công ty
export async function getProjectsByCompany(companyId: number) {
  const result = await query(`
    SELECT p.*, c.name as company_name, c.logo_url as company_logo 
    FROM projects p
    LEFT JOIN companies c ON p.company_id = c.id
    WHERE p.company_id = $1
  `, [companyId]);
  return result.rows;
}

// Hàm lấy dự án theo slug
export async function getProjectBySlug(slug: string) {
  const result = await query(`
    SELECT p.*, c.name as company_name, c.logo_url as company_logo, c.slug as company_slug
    FROM projects p
    LEFT JOIN companies c ON p.company_id = c.id
    WHERE p.slug = $1
  `, [slug]);
  return result.rows[0];
}

// Hàm lấy các dự án liên quan (cùng công ty hoặc cùng công nghệ)
export async function getRelatedProjects(projectId: number, companyId: number, limit = 3) {
  const result = await query(`
    SELECT p.*, c.name as company_name, c.logo_url as company_logo 
    FROM projects p
    LEFT JOIN companies c ON p.company_id = c.id
    WHERE (p.company_id = $1 OR p.technologies && (
      SELECT technologies FROM projects WHERE id = $2
    ))
    AND p.id != $2
    ORDER BY p.start_date DESC
    LIMIT $3
  `, [companyId, projectId, limit]);
  return result.rows;
}