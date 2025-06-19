import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

// GET /api/users - Lấy danh sách người dùng (chỉ admin)
export async function GET(request: Request) {
  // Kiểm tra xác thực
  const authResult = await requireAuth(request);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const { user } = authResult;
  
  // Kiểm tra quyền admin
  if (user.role !== 'admin') {
    return NextResponse.json({ error: 'Không có quyền truy cập' }, { status: 403 });
  }

  try {
    // Lấy tham số truy vấn
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    // Lấy danh sách người dùng với phân trang
    const result = await query(
      'SELECT id, username, email, role, is_active, last_login, created_at, updated_at FROM users ORDER BY id LIMIT $1 OFFSET $2',
      [limit, offset]
    );

    // Lấy tổng số người dùng
    const countResult = await query('SELECT COUNT(*) FROM users');
    const totalCount = parseInt(countResult.rows[0].count);

    return NextResponse.json({
      users: result.rows,
      pagination: {
        total: totalCount,
        page,
        limit,
        pages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    console.error('Error getting users:', error);
    return NextResponse.json(
      { error: 'Lỗi server' },
      { status: 500 }
    );
  }
}

// POST /api/users - Tạo người dùng mới (chỉ admin)
export async function POST(request: Request) {
  // Kiểm tra xác thực
  const authResult = await requireAuth(request);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const { user } = authResult;
  
  // Kiểm tra quyền admin
  if (user.role !== 'admin') {
    return NextResponse.json({ error: 'Không có quyền truy cập' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { username, password, email, role, is_active } = body;

    // Kiểm tra dữ liệu đầu vào
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username và password là bắt buộc' },
        { status: 400 }
      );
    }

    // Kiểm tra username đã tồn tại chưa
    const existingUser = await query('SELECT * FROM users WHERE username = $1', [username]);
    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        { error: 'Username đã tồn tại' },
        { status: 400 }
      );
    }

    // Trong môi trường thực tế, bạn nên mã hóa mật khẩu bằng bcrypt
    const hashedPassword = password;

    // Thêm người dùng mới
    const result = await query(
      'INSERT INTO users (username, password, email, role, is_active, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) RETURNING id, username, email, role, is_active',
      [username, hashedPassword, email, role || 'user', is_active !== undefined ? is_active : true]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Lỗi server' },
      { status: 500 }
    );
  }
}