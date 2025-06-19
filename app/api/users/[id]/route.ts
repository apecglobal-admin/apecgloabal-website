import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

// GET /api/users/[id] - Lấy thông tin người dùng theo ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  // Kiểm tra xác thực
  const authResult = await requireAuth(request);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const { user } = authResult;
  const id = params.id;
  
  // Chỉ cho phép người dùng xem thông tin của chính họ hoặc admin xem tất cả
  if (user.id.toString() !== id && user.role !== 'admin') {
    return NextResponse.json({ error: 'Không có quyền truy cập' }, { status: 403 });
  }

  try {
    // Lấy thông tin người dùng
    const result = await query(
      'SELECT id, username, email, role, is_active, last_login, created_at, updated_at FROM users WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Không tìm thấy người dùng' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error getting user:', error);
    return NextResponse.json(
      { error: 'Lỗi server' },
      { status: 500 }
    );
  }
}

// PUT /api/users/[id] - Cập nhật thông tin người dùng
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  // Kiểm tra xác thực
  const authResult = await requireAuth(request);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const { user } = authResult;
  const id = params.id;
  
  // Chỉ cho phép người dùng cập nhật thông tin của chính họ hoặc admin cập nhật tất cả
  if (user.id.toString() !== id && user.role !== 'admin') {
    return NextResponse.json({ error: 'Không có quyền truy cập' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { username, password, email, role, is_active } = body;

    // Kiểm tra người dùng tồn tại
    const userResult = await query('SELECT * FROM users WHERE id = $1', [id]);
    if (userResult.rows.length === 0) {
      return NextResponse.json({ error: 'Không tìm thấy người dùng' }, { status: 404 });
    }

    // Xây dựng câu truy vấn cập nhật
    let updateQuery = 'UPDATE users SET updated_at = NOW()';
    const queryParams: any[] = [];
    let paramIndex = 1;

    if (username) {
      // Kiểm tra username đã tồn tại chưa
      const existingUser = await query('SELECT * FROM users WHERE username = $1 AND id != $2', [username, id]);
      if (existingUser.rows.length > 0) {
        return NextResponse.json({ error: 'Username đã tồn tại' }, { status: 400 });
      }
      updateQuery += `, username = $${paramIndex}`;
      queryParams.push(username);
      paramIndex++;
    }

    if (password) {
      // Trong môi trường thực tế, bạn nên mã hóa mật khẩu bằng bcrypt
      const hashedPassword = password;
      updateQuery += `, password = $${paramIndex}`;
      queryParams.push(hashedPassword);
      paramIndex++;
    }

    if (email) {
      // Kiểm tra email đã tồn tại chưa
      const existingEmail = await query('SELECT * FROM users WHERE email = $1 AND id != $2', [email, id]);
      if (existingEmail.rows.length > 0) {
        return NextResponse.json({ error: 'Email đã tồn tại' }, { status: 400 });
      }
      updateQuery += `, email = $${paramIndex}`;
      queryParams.push(email);
      paramIndex++;
    }

    // Chỉ admin mới có thể thay đổi role và trạng thái active
    if (user.role === 'admin') {
      if (role) {
        updateQuery += `, role = $${paramIndex}`;
        queryParams.push(role);
        paramIndex++;
      }

      if (is_active !== undefined) {
        updateQuery += `, is_active = $${paramIndex}`;
        queryParams.push(is_active);
        paramIndex++;
      }
    }

    // Thêm điều kiện WHERE
    updateQuery += ` WHERE id = $${paramIndex} RETURNING id, username, email, role, is_active, last_login, created_at, updated_at`;
    queryParams.push(id);

    // Thực hiện cập nhật
    const result = await query(updateQuery, queryParams);

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Lỗi server' },
      { status: 500 }
    );
  }
}

// DELETE /api/users/[id] - Xóa người dùng (chỉ admin)
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  // Kiểm tra xác thực
  const authResult = await requireAuth(request);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const { user } = authResult;
  const id = params.id;
  
  // Chỉ admin mới có thể xóa người dùng
  if (user.role !== 'admin') {
    return NextResponse.json({ error: 'Không có quyền truy cập' }, { status: 403 });
  }

  try {
    // Kiểm tra người dùng tồn tại
    const userResult = await query('SELECT * FROM users WHERE id = $1', [id]);
    if (userResult.rows.length === 0) {
      return NextResponse.json({ error: 'Không tìm thấy người dùng' }, { status: 404 });
    }

    // Xóa người dùng
    await query('DELETE FROM users WHERE id = $1', [id]);

    return NextResponse.json({ message: 'Xóa người dùng thành công' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Lỗi server' },
      { status: 500 }
    );
  }
}