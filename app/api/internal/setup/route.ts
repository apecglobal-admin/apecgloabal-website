import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST(request: Request) {
  try {
    // Tạo bảng permissions nếu chưa tồn tại
    await query(`
      CREATE TABLE IF NOT EXISTS permissions (
        id SERIAL PRIMARY KEY,
        employee_id INTEGER NOT NULL,
        admin_access BOOLEAN DEFAULT FALSE,
        portal_access BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(employee_id)
      )
    `);
    
    // Thêm quyền cho tất cả nhân viên hiện có
    await query(`
      INSERT INTO permissions (employee_id, admin_access, portal_access)
      SELECT e.id, 
             CASE WHEN e.position LIKE '%Giám đốc%' OR e.position LIKE '%Trưởng phòng%' THEN TRUE ELSE FALSE END,
             TRUE
      FROM employees e
      LEFT JOIN permissions p ON e.id = p.employee_id
      WHERE p.id IS NULL
      ON CONFLICT (employee_id) DO NOTHING
    `);
    
    // Cập nhật quyền cho admin
    await query(`
      UPDATE permissions 
      SET admin_access = TRUE, portal_access = TRUE
      FROM employees e
      WHERE permissions.employee_id = e.id AND e.position LIKE '%Giám đốc%'
    `);
    
    // Tạo bảng notifications nếu chưa tồn tại
    await query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER,
        title VARCHAR(255) NOT NULL,
        content TEXT,
        type VARCHAR(50),
        is_read BOOLEAN DEFAULT false,
        action_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Thêm một số thông báo mẫu
    await query(`
      INSERT INTO notifications (user_id, title, content, type, is_read, action_url, created_at)
      VALUES
        (1, 'Chào mừng đến với hệ thống nội bộ', 'Chào mừng bạn đến với hệ thống quản lý nội bộ mới của ApecGlobal. Hãy khám phá các tính năng mới!', 'welcome', false, '/internal/dashboard', NOW() - INTERVAL '1 day'),
        (1, 'Báo cáo Q4 cần duyệt', 'Báo cáo Q4/2023 đã được tạo và đang chờ duyệt. Vui lòng xem xét và phê duyệt.', 'report', false, '/internal/reports', NOW() - INTERVAL '2 hour'),
        (1, 'Họp team 14:00', 'Nhắc nhở: Cuộc họp team sẽ diễn ra vào lúc 14:00 hôm nay tại phòng họp chính.', 'meeting', false, '/internal/calendar', NOW() - INTERVAL '6 hour')
      ON CONFLICT DO NOTHING
    `);
    
    // Tạo bảng dashboard_widgets nếu chưa tồn tại
    await query(`
      CREATE TABLE IF NOT EXISTS dashboard_widgets (
        id SERIAL PRIMARY KEY,
        user_id INTEGER,
        widget_type VARCHAR(100) NOT NULL,
        title VARCHAR(255),
        position INTEGER,
        size VARCHAR(50),
        settings JSONB,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Thêm một số widget mẫu
    await query(`
      INSERT INTO dashboard_widgets (user_id, widget_type, title, position, size, settings, is_active)
      VALUES
        (1, 'stats', 'Thống kê', 1, 'large', '{"showEmployees": true, "showProjects": true, "showRevenue": true, "showPerformance": true}', true),
        (1, 'projects', 'Dự án gần đây', 2, 'medium', '{"limit": 5, "showProgress": true}', true),
        (1, 'notifications', 'Thông báo', 3, 'small', '{"limit": 5}', true)
      ON CONFLICT DO NOTHING
    `);
    
    // Tạo bảng activity_logs nếu chưa tồn tại
    await query(`
      CREATE TABLE IF NOT EXISTS activity_logs (
        id SERIAL PRIMARY KEY,
        user_id INTEGER,
        action VARCHAR(100) NOT NULL,
        entity_type VARCHAR(50),
        entity_id INTEGER,
        description TEXT,
        ip_address VARCHAR(50),
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Thêm một số log hoạt động mẫu
    await query(`
      INSERT INTO activity_logs (user_id, action, entity_type, entity_id, description, ip_address, created_at)
      VALUES
        (1, 'login', 'user', 1, 'Đăng nhập vào hệ thống', '127.0.0.1', NOW() - INTERVAL '1 day'),
        (1, 'view', 'document', 1, 'Xem tài liệu', '127.0.0.1', NOW() - INTERVAL '12 hour'),
        (1, 'download', 'document', 2, 'Tải xuống tài liệu', '127.0.0.1', NOW() - INTERVAL '6 hour'),
        (1, 'create', 'report', 1, 'Tạo báo cáo mới', '127.0.0.1', NOW() - INTERVAL '3 hour')
      ON CONFLICT DO NOTHING
    `);
    
    // Tạo bảng settings nếu chưa tồn tại
    await query(`
      CREATE TABLE IF NOT EXISTS settings (
        id SERIAL PRIMARY KEY,
        setting_key VARCHAR(100) NOT NULL UNIQUE,
        setting_value TEXT,
        setting_group VARCHAR(100),
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Thêm một số cài đặt mẫu
    await query(`
      INSERT INTO settings (setting_key, setting_value, setting_group, description)
      VALUES
        ('site_name', 'ApecGlobal Internal Portal', 'general', 'Tên của cổng thông tin nội bộ'),
        ('theme_color', 'purple', 'appearance', 'Màu chủ đạo của giao diện'),
        ('enable_notifications', 'true', 'notifications', 'Bật/tắt thông báo'),
        ('max_upload_size', '10', 'documents', 'Kích thước tối đa cho phép tải lên (MB)')
      ON CONFLICT (setting_key) DO NOTHING
    `);
    
    // Đảm bảo có dữ liệu trong bảng documents
    await query(`
      INSERT INTO documents (name, file_type, file_size, file_url, category, uploaded_by, download_count, description, folder_path, is_public, created_at)
      VALUES
        ('Hướng dẫn sử dụng hệ thống', 'application/pdf', '2.5 MB', 'https://res.cloudinary.com/demo/raw/upload/v1/documents/user-manual.pdf', 'Hướng dẫn', 1, 45, 'Tài liệu hướng dẫn sử dụng hệ thống nội bộ', 'Hướng dẫn', true, NOW() - INTERVAL '30 day'),
        ('Quy trình làm việc', 'application/pdf', '1.8 MB', 'https://res.cloudinary.com/demo/raw/upload/v1/documents/workflow.pdf', 'Quy trình', 1, 32, 'Quy trình làm việc chuẩn của công ty', 'Quy trình', true, NOW() - INTERVAL '25 day'),
        ('Mẫu báo cáo tháng', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', '1.2 MB', 'https://res.cloudinary.com/demo/raw/upload/v1/documents/report-template.docx', 'Biểu mẫu', 1, 67, 'Mẫu báo cáo tháng chuẩn', 'Biểu mẫu', true, NOW() - INTERVAL '20 day'),
        ('Kế hoạch Q1/2023', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', '3.5 MB', 'https://res.cloudinary.com/demo/raw/upload/v1/documents/q1-plan.xlsx', 'Kế hoạch', 1, 28, 'Kế hoạch hoạt động Q1/2023', 'Kế hoạch', true, NOW() - INTERVAL '15 day'),
        ('Chính sách nhân sự', 'application/pdf', '4.2 MB', 'https://res.cloudinary.com/demo/raw/upload/v1/documents/hr-policy.pdf', 'Chính sách', 1, 53, 'Chính sách nhân sự của công ty', 'Chính sách', true, NOW() - INTERVAL '10 day')
      ON CONFLICT DO NOTHING
    `);
    
    // Đảm bảo có dữ liệu trong bảng reports
    await query(`
      INSERT INTO reports (title, type, department_id, created_by, status, file_size, file_url, download_count, description, period, created_at)
      VALUES
        ('Báo cáo tài chính Q1/2023', 'financial', 5, 5, 'approved', '2.5 MB', 'https://res.cloudinary.com/demo/raw/upload/v1/reports/financial-q1-2023.pdf', 45, 'Báo cáo tài chính quý 1 năm 2023', 'Q1/2023', NOW() - INTERVAL '90 day'),
        ('Báo cáo tài chính Q2/2023', 'financial', 5, 5, 'approved', '2.7 MB', 'https://res.cloudinary.com/demo/raw/upload/v1/reports/financial-q2-2023.pdf', 42, 'Báo cáo tài chính quý 2 năm 2023', 'Q2/2023', NOW() - INTERVAL '60 day'),
        ('Báo cáo tài chính Q3/2023', 'financial', 5, 5, 'approved', '2.6 MB', 'https://res.cloudinary.com/demo/raw/upload/v1/reports/financial-q3-2023.pdf', 38, 'Báo cáo tài chính quý 3 năm 2023', 'Q3/2023', NOW() - INTERVAL '30 day'),
        ('Báo cáo nhân sự 2023', 'hr', 4, 4, 'approved', '3.2 MB', 'https://res.cloudinary.com/demo/raw/upload/v1/reports/hr-2023.pdf', 56, 'Báo cáo nhân sự năm 2023', '2023', NOW() - INTERVAL '45 day'),
        ('Báo cáo Marketing Q3/2023', 'marketing', 3, 3, 'approved', '4.5 MB', 'https://res.cloudinary.com/demo/raw/upload/v1/reports/marketing-q3-2023.pdf', 32, 'Báo cáo Marketing quý 3 năm 2023', 'Q3/2023', NOW() - INTERVAL '35 day')
      ON CONFLICT DO NOTHING
    `);
    
    // Tạo bảng applications nếu chưa tồn tại
    await query(`
      CREATE TABLE IF NOT EXISTS applications (
        id SERIAL PRIMARY KEY,
        job_id INTEGER NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
        applicant_name VARCHAR(255) NOT NULL,
        applicant_email VARCHAR(255) NOT NULL,
        applicant_phone VARCHAR(20),
        position_applied VARCHAR(255) NOT NULL,
        introduction TEXT,
        resume_url TEXT,
        resume_public_id VARCHAR(255),
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Thêm một số ứng tuyển mẫu
    await query(`
      INSERT INTO applications (job_id, applicant_name, applicant_email, applicant_phone, position_applied, introduction, status, created_at)
      VALUES
        (1, 'Nguyễn Văn A', 'nguyenvana@email.com', '0901234567', 'Frontend Developer', 'Tôi có 3 năm kinh nghiệm với React và Node.js', 'pending', NOW() - INTERVAL '2 day'),
        (1, 'Trần Thị B', 'tranthib@email.com', '0902345678', 'Frontend Developer', 'Tôi thích làm việc với UI/UX và có portfolio đẹp', 'reviewing', NOW() - INTERVAL '1 day'),
        (2, 'Lê Văn C', 'levanc@email.com', '0903456789', 'Backend Developer', 'Chuyên về Python và Django, đã làm việc với AWS', 'interviewed', NOW() - INTERVAL '3 day'),
        (3, 'Phạm Thị D', 'phamthid@email.com', '0904567890', 'DevOps Engineer', 'Có kinh nghiệm với Docker, Kubernetes và CI/CD', 'accepted', NOW() - INTERVAL '5 day')
      ON CONFLICT DO NOTHING
    `);

    // Kiểm tra số lượng bản ghi trong các bảng
    const tables = ['permissions', 'notifications', 'dashboard_widgets', 'activity_logs', 'settings', 'documents', 'reports', 'applications'];
    const counts = {};
    
    for (const table of tables) {
      try {
        const result = await query(`SELECT COUNT(*) FROM ${table}`);
        counts[table] = result.rows[0].count;
      } catch (error) {
        console.error(`Lỗi khi đếm bản ghi trong bảng ${table}:`, error);
        counts[table] = 'error';
      }
    }
    
    return NextResponse.json({
      message: 'Thiết lập dữ liệu cho phần /internal thành công',
      counts
    });
  } catch (error) {
    console.error('Lỗi khi thiết lập dữ liệu:', error);
    return NextResponse.json(
      { error: 'Lỗi khi thiết lập dữ liệu' },
      { status: 500 }
    );
  }
}