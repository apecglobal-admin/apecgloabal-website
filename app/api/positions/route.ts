import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET /api/positions - Lấy danh sách chức vụ
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '100');
    const search = searchParams.get('search') || '';
    const level = searchParams.get('level') || '';
    const is_manager = searchParams.get('is_manager') || '';
    const is_active = searchParams.get('is_active') || 'true';

    const offset = (page - 1) * limit;

    // Build WHERE clause
    const whereConditions = ['1=1'];
    const queryParams: any[] = [];

    if (search) {
      whereConditions.push(`(title ILIKE $${queryParams.length + 1} OR description ILIKE $${queryParams.length + 1})`);
      queryParams.push(`%${search}%`);
    }

    if (level) {
      whereConditions.push(`level = $${queryParams.length + 1}`);
      queryParams.push(level);
    }

    if (is_manager) {
      whereConditions.push(`is_manager_position = $${queryParams.length + 1}`);
      queryParams.push(is_manager === 'true');
    }

    if (is_active === 'true' || is_active === 'false') {
      whereConditions.push(`is_active = $${queryParams.length + 1}`);
      queryParams.push(is_active === 'true');
    }

    const whereClause = whereConditions.join(' AND ');

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM positions
      WHERE ${whereClause}
    `;
    
    const countResult = await query(countQuery, queryParams);
    const total = parseInt(countResult.rows[0].total);

    // Get positions
    const positionsQuery = `
      SELECT 
        id,
        title,
        description,
        level,
        is_manager_position,
        is_active,
        created_at,
        updated_at
      FROM positions
      WHERE ${whereClause}
      ORDER BY 
        CASE 
          WHEN level = 'executive' THEN 1
          WHEN level = 'director' THEN 2
          WHEN level = 'manager' THEN 3
          WHEN level = 'supervisor' THEN 4
          WHEN level = 'staff' THEN 5
          WHEN level = 'intern' THEN 6
          ELSE 7
        END,
        title ASC
      LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}
    `;

    queryParams.push(limit, offset);
    const result = await query(positionsQuery, queryParams);

    return NextResponse.json({
      success: true,
      data: {
        positions: result.rows,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Error fetching positions:', error);
    return NextResponse.json(
      { success: false, error: 'Lỗi server khi lấy danh sách chức vụ' },
      { status: 500 }
    );
  }
}

// POST /api/positions - Tạo chức vụ mới
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      level = 'staff',
      is_manager_position = false,
      is_active = true
    } = body;

    if (!title?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Tên chức vụ không được để trống' },
        { status: 400 }
      );
    }

    // Kiểm tra trùng tên chức vụ
    const existingPosition = await query(
      'SELECT id FROM positions WHERE title = $1',
      [title.trim()]
    );

    if (existingPosition.rows.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Chức vụ này đã tồn tại' },
        { status: 400 }
      );
    }

    const insertQuery = `
      INSERT INTO positions (
        title, description, level, is_manager_position, is_active
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

    const values = [
      title.trim(),
      description?.trim() || null,
      level,
      is_manager_position,
      is_active
    ];

    const result = await query(insertQuery, values);

    return NextResponse.json({
      success: true,
      data: result.rows[0],
      message: 'Tạo chức vụ thành công'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating position:', error);
    return NextResponse.json(
      { success: false, error: 'Lỗi server khi tạo chức vụ' },
      { status: 500 }
    );
  }
}