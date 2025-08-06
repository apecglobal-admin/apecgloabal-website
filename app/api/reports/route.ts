import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET - Lấy danh sách báo cáo với bộ lọc
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const type = searchParams.get('type');
    const department = searchParams.get('department');
    const status = searchParams.get('status');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const search = searchParams.get('search');

    const offset = (page - 1) * limit;

    // Xây dựng câu truy vấn với điều kiện lọc
    let whereConditions = [];
    let queryParams = [];
    let paramIndex = 1;

    if (type && type !== 'Tất cả') {
      whereConditions.push(`r.type = $${paramIndex}`);
      queryParams.push(type);
      paramIndex++;
    }

    if (department && department !== 'Tất cả') {
      whereConditions.push(`d.name = $${paramIndex}`);
      queryParams.push(department);
      paramIndex++;
    }

    if (status && status !== 'Tất cả') {
      whereConditions.push(`r.status = $${paramIndex}`);
      queryParams.push(status);
      paramIndex++;
    }

    if (startDate) {
      whereConditions.push(`r.created_at >= $${paramIndex}`);
      queryParams.push(startDate);
      paramIndex++;
    }

    if (endDate) {
      whereConditions.push(`r.created_at <= $${paramIndex}`);
      queryParams.push(endDate);
      paramIndex++;
    }

    if (search) {
      whereConditions.push(`(r.title ILIKE $${paramIndex} OR r.description ILIKE $${paramIndex})`);
      queryParams.push(`%${search}%`);
      paramIndex++;
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Truy vấn lấy báo cáo với thông tin phòng ban và người tạo
    const reportsQuery = `
      SELECT 
        r.*,
        d.name as department_name,
        e.name as created_by_name,
        c.name as company_name
      FROM reports r
      LEFT JOIN departments d ON r.department_id = d.id
      LEFT JOIN employees e ON r.created_by = e.id
      LEFT JOIN companies c ON d.company_id = c.id
      ${whereClause}
      ORDER BY r.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    queryParams.push(limit, offset);

    const reportsResult = await query(reportsQuery, queryParams);

    // Truy vấn đếm tổng số báo cáo
    const countQuery = `
      SELECT COUNT(*) as total
      FROM reports r
      LEFT JOIN departments d ON r.department_id = d.id
      ${whereClause}
    `;

    const countResult = await query(countQuery, queryParams.slice(0, -2));
    const total = parseInt(countResult.rows[0].total);

    return NextResponse.json({
      reports: reportsResult.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json(
      { error: 'Lỗi khi lấy danh sách báo cáo' },
      { status: 500 }
    );
  }
}

// POST - Tạo báo cáo mới
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, type, department_id, description, created_by } = body;

    // Validate dữ liệu đầu vào
    if (!title || !type || !department_id || !created_by) {
      return NextResponse.json(
        { error: 'Thiếu thông tin bắt buộc' },
        { status: 400 }
      );
    }

    const insertQuery = `
      INSERT INTO reports (title, type, department_id, created_by, description, status, file_size, download_count, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
      RETURNING *
    `;

    const result = await query(insertQuery, [
      title,
      type,
      department_id,
      created_by,
      description || '',
      'Đang xử lý',
      '0 MB',
      0
    ]);

    return NextResponse.json({
      message: 'Tạo báo cáo thành công',
      report: result.rows[0]
    });

  } catch (error) {
    console.error('Error creating report:', error);
    return NextResponse.json(
      { error: 'Lỗi khi tạo báo cáo' },
      { status: 500 }
    );
  }
}