import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// POST - Tải xuống báo cáo và cập nhật số lượt tải
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const reportId = parseInt(params.id);

    if (isNaN(reportId)) {
      return NextResponse.json(
        { error: 'ID báo cáo không hợp lệ' },
        { status: 400 }
      );
    }

    // Lấy thông tin báo cáo
    const reportQuery = `
      SELECT r.*, d.name as department_name
      FROM reports r
      LEFT JOIN departments d ON r.department_id = d.id
      WHERE r.id = $1
    `;

    const reportResult = await query(reportQuery, [reportId]);

    if (reportResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Không tìm thấy báo cáo' },
        { status: 404 }
      );
    }

    const report = reportResult.rows[0];

    // Cập nhật số lượt tải xuống
    const updateQuery = `
      UPDATE reports 
      SET download_count = download_count + 1, updated_at = NOW()
      WHERE id = $1
      RETURNING download_count
    `;

    const updateResult = await query(updateQuery, [reportId]);

    // Tạo log tải xuống (nếu có bảng download_logs)
    try {
      const logQuery = `
        INSERT INTO download_logs (report_id, downloaded_at, ip_address)
        VALUES ($1, NOW(), $2)
      `;
      
      const clientIP = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown';
      
      await query(logQuery, [reportId, clientIP]);
    } catch (logError) {
      // Bỏ qua lỗi log nếu bảng không tồn tại
      console.log('Download log table not found, skipping log:', logError);
    }

    // Trong thực tế, bạn sẽ trả về file thực tế
    // Ở đây chúng ta chỉ trả về thông tin để frontend xử lý
    return NextResponse.json({
      message: 'Tải xuống thành công',
      report: {
        id: report.id,
        title: report.title,
        file_url: report.file_url,
        file_size: report.file_size,
        download_count: updateResult.rows[0].download_count
      }
    });

  } catch (error) {
    console.error('Error downloading report:', error);
    return NextResponse.json(
      { error: 'Lỗi khi tải xuống báo cáo' },
      { status: 500 }
    );
  }
}