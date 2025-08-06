import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    // Tạo bảng reports nếu chưa tồn tại
    const createReportsTable = `
      CREATE TABLE IF NOT EXISTS reports (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        type VARCHAR(100) NOT NULL,
        department_id INTEGER REFERENCES departments(id),
        created_by INTEGER REFERENCES employees(id),
        status VARCHAR(50) DEFAULT 'Đang xử lý',
        file_size VARCHAR(20) DEFAULT '0 MB',
        file_url TEXT,
        download_count INTEGER DEFAULT 0,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await query(createReportsTable);

    // Tạo bảng download_logs để theo dõi lượt tải xuống
    const createDownloadLogsTable = `
      CREATE TABLE IF NOT EXISTS download_logs (
        id SERIAL PRIMARY KEY,
        report_id INTEGER REFERENCES reports(id) ON DELETE CASCADE,
        downloaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        ip_address VARCHAR(45),
        user_agent TEXT
      );
    `;

    await query(createDownloadLogsTable);

    // Tạo index để tối ưu hiệu suất
    const createIndexes = `
      CREATE INDEX IF NOT EXISTS idx_reports_type ON reports(type);
      CREATE INDEX IF NOT EXISTS idx_reports_department ON reports(department_id);
      CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
      CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports(created_at);
      CREATE INDEX IF NOT EXISTS idx_download_logs_report ON download_logs(report_id);
    `;

    await query(createIndexes);

    // Thêm dữ liệu mẫu
    const sampleReports = [
      {
        title: 'Báo Cáo Doanh Thu Q4 2024',
        type: 'Tài chính',
        department_id: 1,
        created_by: 1,
        status: 'Hoàn thành',
        file_size: '2.4 MB',
        file_url: '/reports/doanh-thu-q4-2024.pdf',
        download_count: 45,
        description: 'Báo cáo tổng hợp doanh thu và lợi nhuận quý 4 năm 2024'
      },
      {
        title: 'Phân Tích Hiệu Suất Nhân Viên',
        type: 'Nhân sự',
        department_id: 2,
        created_by: 2,
        status: 'Đang xử lý',
        file_size: '1.8 MB',
        file_url: '/reports/hieu-suat-nhan-vien.pdf',
        download_count: 23,
        description: 'Đánh giá hiệu suất làm việc của nhân viên trong năm 2024'
      },
      {
        title: 'Báo Cáo Bảo Mật Hệ Thống',
        type: 'Bảo mật',
        department_id: 3,
        created_by: 3,
        status: 'Hoàn thành',
        file_size: '3.2 MB',
        file_url: '/reports/bao-mat-he-thong.pdf',
        download_count: 67,
        description: 'Đánh giá tình hình bảo mật và các biện pháp cải thiện'
      },
      {
        title: 'Thống Kê Dự Án ApecTech',
        type: 'Dự án',
        department_id: 4,
        created_by: 4,
        status: 'Chờ duyệt',
        file_size: '1.5 MB',
        file_url: '/reports/du-an-apectech.pdf',
        download_count: 12,
        description: 'Báo cáo tiến độ và kết quả các dự án của ApecTech'
      },
      {
        title: 'Phân Tích Khách Hàng EmoCommerce',
        type: 'Kinh doanh',
        department_id: 5,
        created_by: 5,
        status: 'Hoàn thành',
        file_size: '2.1 MB',
        file_url: '/reports/khach-hang-emocommerce.pdf',
        download_count: 34,
        description: 'Phân tích hành vi và xu hướng mua sắm của khách hàng'
      },
      {
        title: 'Báo Cáo Tài Chính Tháng 12',
        type: 'Tài chính',
        department_id: 1,
        created_by: 1,
        status: 'Hoàn thành',
        file_size: '1.9 MB',
        file_url: '/reports/tai-chinh-thang-12.pdf',
        download_count: 28,
        description: 'Báo cáo tài chính chi tiết tháng 12/2024'
      },
      {
        title: 'Đánh Giá Rủi Ro Dự Án',
        type: 'Dự án',
        department_id: 4,
        created_by: 4,
        status: 'Đang xử lý',
        file_size: '2.7 MB',
        file_url: '/reports/rui-ro-du-an.pdf',
        download_count: 15,
        description: 'Phân tích và đánh giá rủi ro các dự án đang triển khai'
      },
      {
        title: 'Báo Cáo Chất Lượng Sản Phẩm',
        type: 'Chất lượng',
        department_id: 6,
        created_by: 6,
        status: 'Hoàn thành',
        file_size: '3.1 MB',
        file_url: '/reports/chat-luong-san-pham.pdf',
        download_count: 52,
        description: 'Đánh giá chất lượng sản phẩm và dịch vụ'
      },
      {
        title: 'Thống Kê Đào Tạo Nhân Viên',
        type: 'Nhân sự',
        department_id: 2,
        created_by: 2,
        status: 'Chờ duyệt',
        file_size: '1.6 MB',
        file_url: '/reports/dao-tao-nhan-vien.pdf',
        download_count: 19,
        description: 'Báo cáo về các chương trình đào tạo và phát triển nhân viên'
      },
      {
        title: 'Phân Tích Thị Trường 2024',
        type: 'Kinh doanh',
        department_id: 5,
        created_by: 5,
        status: 'Hoàn thành',
        file_size: '4.2 MB',
        file_url: '/reports/thi-truong-2024.pdf',
        download_count: 73,
        description: 'Phân tích xu hướng thị trường và cơ hội kinh doanh năm 2024'
      }
    ];

    // Kiểm tra xem đã có dữ liệu mẫu chưa
    const existingReports = await query('SELECT COUNT(*) as count FROM reports');
    const reportCount = parseInt(existingReports.rows[0].count);

    if (reportCount === 0) {
      for (const report of sampleReports) {
        const insertQuery = `
          INSERT INTO reports (title, type, department_id, created_by, status, file_size, file_url, download_count, description, created_at, updated_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW() - INTERVAL '${Math.floor(Math.random() * 30)} days', NOW())
        `;

        await query(insertQuery, [
          report.title,
          report.type,
          report.department_id,
          report.created_by,
          report.status,
          report.file_size,
          report.file_url,
          report.download_count,
          report.description
        ]);
      }
    }

    return NextResponse.json({
      message: 'Setup báo cáo thành công',
      tablesCreated: ['reports', 'download_logs'],
      sampleDataInserted: reportCount === 0 ? sampleReports.length : 0
    });

  } catch (error) {
    console.error('Error setting up reports:', error);
    return NextResponse.json(
      { error: 'Lỗi khi setup báo cáo: ' + error.message },
      { status: 500 }
    );
  }
}