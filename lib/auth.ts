import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { query } from './db';

// Hàm kiểm tra xác thực người dùng
export async function authenticate(username: string, password: string) {
  try {
    // Tìm người dùng trong database
    const result = await query('SELECT * FROM users WHERE username = $1', [username]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    const user = result.rows[0];
    
    // Trong môi trường thực tế, bạn nên sử dụng bcrypt để so sánh mật khẩu
    // Ví dụ: const isValid = await bcrypt.compare(password, user.password);
    // Nhưng để đơn giản, chúng ta sẽ so sánh trực tiếp
    if (password !== user.password) {
      return null;
    }
    
    // Trả về thông tin người dùng (không bao gồm mật khẩu)
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}

// Hàm kiểm tra quyền truy cập
export function checkPermission(user: any, requiredRole: string) {
  return user && user.role === requiredRole;
}

// Middleware kiểm tra xác thực
export async function requireAuth(request: Request) {
  // Trong thực tế, bạn nên sử dụng JWT hoặc session
  // Đây là cách đơn giản để kiểm tra xác thực
  const cookieStore = cookies();
  const authCookie = cookieStore.get('auth');
  
  if (!authCookie) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    // Parse cookie value - nó chứa JSON object
    const authData = JSON.parse(authCookie.value);
    const userId = authData.id;
    
    // Nếu là admin (id = 999), trả về thông tin admin trực tiếp
    if (userId === 999) {
      return { 
        user: {
          id: 999,
          username: 'admin',
          role: 'admin',
          email: 'admin@apecglobal.com',
          is_active: true,
          permissions: authData.permissions || { admin_access: true, portal_access: true }
        }
      };
    }
    
    // Với user thường, query từ database
    const result = await query('SELECT * FROM users WHERE id = $1', [userId]);
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const user = result.rows[0];
    const { password: _, ...userWithoutPassword } = user;
    
    // Thêm permissions từ cookie
    userWithoutPassword.permissions = authData.permissions;
    
    return { user: userWithoutPassword };
  } catch (error) {
    console.error('Auth middleware error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}