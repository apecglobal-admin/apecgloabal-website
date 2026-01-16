import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { query } from '@/lib/db';

// Tài khoản admin duy nhất
const ADMIN_ACCOUNT = { username: 'admin', password: '123456', role: 'admin' };

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password, source } = body;

    // Kiểm tra dữ liệu đầu vào
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username và password là bắt buộc' },
        { status: 400 }
      );
    }

    let user;
    let employeeData = null;
    let permissions = {
      admin_access: false,
      portal_access: false
    };

    // Kiểm tra nếu là tài khoản admin
    if (username === ADMIN_ACCOUNT.username && password === ADMIN_ACCOUNT.password) {
      user = {
        id: 999,
        username: ADMIN_ACCOUNT.username,
        role: ADMIN_ACCOUNT.role,
        email: 'admin@apecglobal.com',
        is_active: true,
        last_login: new Date().toISOString(),
        employee_id: null
      };
      
      // Admin có tất cả quyền
      permissions = {
        admin_access: true,
        portal_access: true
      };
    } else {
      // Nếu không phải admin, tìm trong bảng users và employees
      try {
        // Tìm trong bảng users
        const userResult = await query(`
          SELECT u.*, e.name as employee_name, e.position_id, e.department_id, e.company_id, e.avatar_url
          FROM users u
          LEFT JOIN employees e ON u.employee_id = e.id
          WHERE u.username = $1
        `, [username]);
        
        if (userResult.rows.length === 0) {
          // Nếu không tìm thấy trong bảng users, thử tìm trong bảng employees
          // Sử dụng email làm username và phone làm password
          const employeeResult = await query(`
            SELECT * FROM employees WHERE email = $1 AND phone = $2 AND status = 'active'
          `, [username, password]);
          
          if (employeeResult.rows.length === 0) {
            return NextResponse.json(
              { error: 'Tên đăng nhập hoặc mật khẩu không đúng' },
              { status: 401 }
            );
          }
          
          // Tìm thấy nhân viên, tạo tài khoản tự động
          employeeData = employeeResult.rows[0];
          
          // Kiểm tra xem đã có user cho nhân viên này chưa
          const existingUserResult = await query(`
            SELECT * FROM users WHERE employee_id = $1
          `, [employeeData.id]);
          
          if (existingUserResult.rows.length > 0) {
            // Nếu đã có user, sử dụng thông tin đó
            user = existingUserResult.rows[0];
            
            // Kiểm tra mật khẩu
            if (password !== user.password) {
              return NextResponse.json(
                { error: 'Tên đăng nhập hoặc mật khẩu không đúng' },
                { status: 401 }
              );
            }
          } else {
            // Nếu chưa có user, tạo mới
            const newUserResult = await query(`
              INSERT INTO users (username, email, password, role, employee_id, is_active, created_at, updated_at)
              VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
              RETURNING *
            `, [
              employeeData.email, // Sử dụng email làm username
              employeeData.email,
              employeeData.phone, // Sử dụng số điện thoại làm mật khẩu
              'employee',
              employeeData.id,
              true
            ]);
            
            user = newUserResult.rows[0];
          }
          
          // Lấy thông tin quyền từ bảng permissions (nếu có)
          try {
            const permissionsResult = await query(`
              SELECT * FROM permissions WHERE employee_id = $1
            `, [employeeData.id]);
            
            if (permissionsResult.rows.length > 0) {
              const permData = permissionsResult.rows[0];
              permissions = {
                admin_access: permData.admin_access || false,
                portal_access: permData.portal_access || true // Mặc định nhân viên có quyền truy cập portal
              };
            } else {
              // Nếu không có bản ghi quyền, tạo mới với quyền mặc định
              permissions = {
                admin_access: false,
                portal_access: true // Mặc định nhân viên có quyền truy cập portal
              };
              
              await query(`
                INSERT INTO permissions (employee_id, admin_access, portal_access, created_at, updated_at)
                VALUES ($1, $2, $3, NOW(), NOW())
              `, [employeeData.id, permissions.admin_access, permissions.portal_access]);
            }
          } catch (permError) {
            console.error('Error getting permissions:', permError);
            // Nếu có lỗi, sử dụng quyền mặc định
            permissions = {
              admin_access: false,
              portal_access: true
            };
          }
        } else {
          // Tìm thấy user trong database
          user = userResult.rows[0];
          
          // Kiểm tra mật khẩu
          if (password !== user.password) {
            return NextResponse.json(
              { error: 'Tên đăng nhập hoặc mật khẩu không đúng' },
              { status: 401 }
            );
          }
          
          // Lấy thông tin quyền từ bảng permissions (nếu có)
          if (user.employee_id) {
            try {
              const permissionsResult = await query(`
                SELECT * FROM permissions WHERE employee_id = $1
              `, [user.employee_id]);
              
              if (permissionsResult.rows.length > 0) {
                const permData = permissionsResult.rows[0];
                permissions = {
                  admin_access: permData.admin_access || false,
                  portal_access: permData.portal_access || true
                };
              } else {
                // Nếu không có bản ghi quyền, tạo mới với quyền mặc định
                permissions = {
                  admin_access: user.role === 'admin',
                  portal_access: true
                };
                
                await query(`
                  INSERT INTO permissions (employee_id, admin_access, portal_access, created_at, updated_at)
                  VALUES ($1, $2, $3, NOW(), NOW())
                `, [user.employee_id, permissions.admin_access, permissions.portal_access]);
              }
            } catch (permError) {
              console.error('Error getting permissions:', permError);
              // Nếu có lỗi, sử dụng quyền mặc định dựa trên role
              permissions = {
                admin_access: user.role === 'admin',
                portal_access: true
              };
            }
          } else {
            // Nếu không có employee_id, sử dụng quyền dựa trên role
            permissions = {
              admin_access: user.role === 'admin',
              portal_access: true
            };
          }
        }
        
        // Cập nhật thời gian đăng nhập cuối cùng
        await query('UPDATE users SET last_login = NOW() WHERE id = $1', [user.id]);
      } catch (dbError) {
        console.error('Database error:', dbError);
        
        // Nếu có lỗi database, kiểm tra xem có phải tài khoản admin không
        if (username === ADMIN_ACCOUNT.username && password === ADMIN_ACCOUNT.password) {
          user = {
            id: 999,
            username: ADMIN_ACCOUNT.username,
            role: ADMIN_ACCOUNT.role,
            email: 'admin@apecglobal.com',
            is_active: true,
            last_login: new Date().toISOString(),
            employee_id: null
          };
          
          permissions = {
            admin_access: true,
            portal_access: true
          };
        } else {
          return NextResponse.json(
            { error: 'Lỗi kết nối database. Vui lòng thử lại sau.' },
            { status: 500 }
          );
        }
      }
    }
    
    // Kiểm tra quyền truy cập dựa trên nguồn đăng nhập
    if (source === 'admin' && !permissions.admin_access) {
      return NextResponse.json(
        { error: 'Bạn không có quyền truy cập trang quản trị' },
        { status: 403 }
      );
    }
    
    if (source === 'internal' && !permissions.portal_access) {
      return NextResponse.json(
        { error: 'Bạn không có quyền truy cập CMS' },
        { status: 403 }
      );
    }
    
    // Thiết lập cookie
    const cookieStore = cookies();
    cookieStore.set('auth', JSON.stringify({
      id: user.id,
      username: user.username,
      role: user.role,
      permissions: permissions
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });
    
    // Thiết lập cookie cho internal portal nếu đăng nhập từ internal
    if (source === 'internal' && permissions.portal_access) {
      cookieStore.set('internal_auth', 'true', {
        httpOnly: false, // Cho phép JavaScript truy cập
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24, // 1 day
        path: '/',
      });
    }
    
    // Thiết lập cookie cho admin nếu đăng nhập từ admin
    if (source === 'admin' && permissions.admin_access) {
      cookieStore.set('admin_auth', 'true', {
        httpOnly: false, // Cho phép JavaScript truy cập
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24, // 1 day
        path: '/',
      });
    }
    
    // Trả về thông tin người dùng (không bao gồm mật khẩu)
    const { password: _, ...userWithoutPassword } = user;
    
    return NextResponse.json({
      message: 'Đăng nhập thành công',
      user: {
        ...userWithoutPassword,
        permissions: permissions,
        employee: employeeData
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Lỗi server' },
      { status: 500 }
    );
  }
}