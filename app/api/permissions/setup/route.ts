import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { query } from "@/lib/db";

// POST - Khởi tạo quyền mặc định cho tất cả users
export async function POST(request: Request) {
  try {
    // Kiểm tra quyền admin
    const cookieStore = cookies();
    const authCookie = cookieStore.get("auth");
    
    if (!authCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Lấy danh sách tất cả users
    const usersResult = await query(`
      SELECT e.id as employee_id, e.name, u.role
      FROM employees e
      JOIN users u ON e.id = u.employee_id
      WHERE u.is_active = true
    `);

    // Quyền cơ bản cho user thường
    const basicPermissions = [
      { module: 'dashboard', permission: 'view' },
      { module: 'employees', permission: 'view' },
      { module: 'departments', permission: 'view' },
      { module: 'projects', permission: 'view' },
      { module: 'news', permission: 'view' },
      { module: 'documents', permission: 'view' },
      { module: 'services', permission: 'view' },
      { module: 'jobs', permission: 'view' }
    ];

    // Tạo quyền cơ bản cho tất cả users
    for (const user of usersResult.rows) {
      // Nếu là admin thì cấp tất cả quyền
      if (user.role === 'admin') {
        const allPermissions = await query(`
          SELECT module_name, permission_type FROM permission_modules WHERE is_active = true
        `);
        
        for (const perm of allPermissions.rows) {
          await query(`
            INSERT INTO permission_roles (employee_id, module_name, permission_type, granted, created_at, updated_at)
            VALUES ($1, $2, $3, true, NOW(), NOW())
            ON CONFLICT (employee_id, module_name, permission_type) 
            DO UPDATE SET granted = true, updated_at = NOW()
          `, [user.employee_id, perm.module_name, perm.permission_type]);
        }
      } else {
        // User thường chỉ có quyền cơ bản
        for (const perm of basicPermissions) {
          await query(`
            INSERT INTO permission_roles (employee_id, module_name, permission_type, granted, created_at, updated_at)
            VALUES ($1, $2, $3, true, NOW(), NOW())
            ON CONFLICT (employee_id, module_name, permission_type) 
            DO UPDATE SET granted = true, updated_at = NOW()
          `, [user.employee_id, perm.module, perm.permission]);
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Đã khởi tạo quyền mặc định cho ${usersResult.rows.length} users`,
      data: {
        users_processed: usersResult.rows.length,
        admin_users: usersResult.rows.filter(u => u.role === 'admin').length,
        regular_users: usersResult.rows.filter(u => u.role !== 'admin').length
      }
    });

  } catch (error) {
    console.error("Error setting up default permissions:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}