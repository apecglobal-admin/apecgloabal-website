import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password, email } = body;

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

    // Kiểm tra email đã tồn tại chưa (nếu có)
    if (email) {
      const existingEmail = await query('SELECT * FROM users WHERE email = $1', [email]);
      if (existingEmail.rows.length > 0) {
        return NextResponse.json(
          { error: 'Email đã tồn tại' },
          { status: 400 }
        );
      }
    }

    // Trong môi trường thực tế, bạn nên mã hóa mật khẩu bằng bcrypt
    // Ví dụ: const hashedPassword = await bcrypt.hash(password, 10);
    // Nhưng để đơn giản, chúng ta sẽ lưu trực tiếp
    const hashedPassword = password;

    // Thêm người dùng mới
    const result = await query(
      'INSERT INTO users (username, password, email, role, is_active, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) RETURNING id, username, email, role',
      [username, hashedPassword, email, 'user', true]
    );

    const newUser = result.rows[0];

    return NextResponse.json({
      message: 'Đăng ký thành công',
      user: newUser
    }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Lỗi server' },
      { status: 500 }
    );
  }
}