import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET - Lấy thống kê báo cáo
export async function GET(request: NextRequest) {
  try {
    // Lấy tổng số báo cáo
    const totalReportsResult = await query('SELECT COUNT(*) as count FROM reports');
    const totalReports = parseInt(totalReportsResult.rows[0].count);

    // Lấy số báo cáo tháng này
    const thisMonthReportsResult = await query(`
      SELECT COUNT(*) as count 
      FROM reports 
      WHERE EXTRACT(MONTH FROM created_at) = EXTRACT(MONTH FROM CURRENT_DATE)
      AND EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM CURRENT_DATE)
    `);
    const thisMonthReports = parseInt(thisMonthReportsResult.rows[0].count);

    // Lấy số báo cáo tháng trước
    const lastMonthReportsResult = await query(`
      SELECT COUNT(*) as count 
      FROM reports 
      WHERE EXTRACT(MONTH FROM created_at) = EXTRACT(MONTH FROM CURRENT_DATE - INTERVAL '1 month')
      AND EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM CURRENT_DATE - INTERVAL '1 month')
    `);
    const lastMonthReports = parseInt(lastMonthReportsResult.rows[0].count);

    // Lấy tổng lượt tải xuống
    const totalDownloadsResult = await query('SELECT SUM(download_count) as total FROM reports');
    const totalDownloads = parseInt(totalDownloadsResult.rows[0].total) || 0;

    // Lấy lượt tải xuống tháng này (giả sử có bảng download_logs)
    // Tạm thời sử dụng số liệu giả
    const thisMonthDownloads = Math.floor(totalDownloads * 0.3);
    const lastMonthDownloads = Math.floor(totalDownloads * 0.25);

    // Lấy số báo cáo đang xử lý
    const processingReportsResult = await query(`
      SELECT COUNT(*) as count 
      FROM reports 
      WHERE status = 'Đang xử lý'
    `);
    const processingReports = parseInt(processingReportsResult.rows[0].count);

    // Lấy số báo cáo đang xử lý tháng trước
    const lastMonthProcessingResult = await query(`
      SELECT COUNT(*) as count 
      FROM reports 
      WHERE status = 'Đang xử lý'
      AND EXTRACT(MONTH FROM created_at) = EXTRACT(MONTH FROM CURRENT_DATE - INTERVAL '1 month')
    `);
    const lastMonthProcessing = parseInt(lastMonthProcessingResult.rows[0].count);

    // Lấy thống kê theo loại báo cáo
    const reportTypeStatsResult = await query(`
      SELECT type, COUNT(*) as count
      FROM reports
      GROUP BY type
      ORDER BY count DESC
    `);

    // Lấy thống kê theo phòng ban
    const departmentStatsResult = await query(`
      SELECT d.name, COUNT(r.id) as count
      FROM departments d
      LEFT JOIN reports r ON d.id = r.department_id
      GROUP BY d.id, d.name
      ORDER BY count DESC
    `);

    // Lấy thống kê theo trạng thái
    const statusStatsResult = await query(`
      SELECT status, COUNT(*) as count
      FROM reports
      GROUP BY status
      ORDER BY count DESC
    `);

    // Lấy báo cáo được tải nhiều nhất
    const topDownloadedResult = await query(`
      SELECT r.title, r.download_count, d.name as department_name
      FROM reports r
      LEFT JOIN departments d ON r.department_id = d.id
      ORDER BY r.download_count DESC
      LIMIT 5
    `);

    // Lấy xu hướng báo cáo theo tháng (6 tháng gần nhất)
    const trendResult = await query(`
      SELECT 
        TO_CHAR(created_at, 'YYYY-MM') as month,
        COUNT(*) as count
      FROM reports
      WHERE created_at >= CURRENT_DATE - INTERVAL '6 months'
      GROUP BY TO_CHAR(created_at, 'YYYY-MM')
      ORDER BY month
    `);

    return NextResponse.json({
      overview: {
        totalReports: {
          value: totalReports,
          change: thisMonthReports - lastMonthReports,
          changePercent: lastMonthReports > 0 ? Math.round(((thisMonthReports - lastMonthReports) / lastMonthReports) * 100) : 0
        },
        thisMonthReports: {
          value: thisMonthReports,
          change: thisMonthReports - lastMonthReports,
          changePercent: lastMonthReports > 0 ? Math.round(((thisMonthReports - lastMonthReports) / lastMonthReports) * 100) : 0
        },
        totalDownloads: {
          value: totalDownloads,
          change: thisMonthDownloads - lastMonthDownloads,
          changePercent: lastMonthDownloads > 0 ? Math.round(((thisMonthDownloads - lastMonthDownloads) / lastMonthDownloads) * 100) : 0
        },
        processingReports: {
          value: processingReports,
          change: processingReports - lastMonthProcessing,
          changePercent: lastMonthProcessing > 0 ? Math.round(((processingReports - lastMonthProcessing) / lastMonthProcessing) * 100) : 0
        }
      },
      reportTypes: reportTypeStatsResult.rows,
      departments: departmentStatsResult.rows,
      statuses: statusStatsResult.rows,
      topDownloaded: topDownloadedResult.rows,
      trend: trendResult.rows
    });

  } catch (error) {
    console.error('Error fetching report stats:', error);
    return NextResponse.json(
      { error: 'Lỗi khi lấy thống kê báo cáo' },
      { status: 500 }
    );
  }
}