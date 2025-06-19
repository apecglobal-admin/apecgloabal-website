import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { query } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // Kiểm tra dữ liệu đầu vào
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username và password là bắt buộc' },
        { status: 400 }
      );
    }

    // Tìm người dùng trong database
    const result = await query('SELECT * FROM users WHERE username = $1', [username]);
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Tên đăng nhập hoặc mật khẩu không đúng' },
        { status: 401 }
      );
    }
    
    const user = result.rows[0];
    
    // Trong môi trường thực tế, bạn nên sử dụng bcrypt để so sánh mật khẩu
    // Ví dụ: const isValid = await bcrypt.compare(password, user.password);
    // Nhưng để đơn giản, chúng ta sẽ so sánh trực tiếp
    if (password !== user.password) {
      return NextResponse.json(
        { error: 'Tên đăng nhập hoặc mật khẩu không đúng' },
        { status: 401 }
      );
    }
    
    // Cập nhật thời gian đăng nhập cuối cùng
    await query('UPDATE users SET last_login = NOW() WHERE id = $1', [user.id]);
    
    // Thiết lập cookie
    const cookieStore = cookies();
    cookieStore.set('auth', user.id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });
    
    // Trả về thông tin người dùng (không bao gồm mật khẩu)
    const { password: _, ...userWithoutPassword } = user;
    
    return NextResponse.json({
      message: 'Đăng nhập thành công',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Lỗi server' },
      { status: 500 }
    );
  }
}