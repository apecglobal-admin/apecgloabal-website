import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { query } from "@/lib/db";

// GET - Lấy danh sách tất cả permissions và users (sử dụng dữ liệu có sẵn)
export async function GET() {
  try {
    // Kiểm tra quyền admin
    const cookieStore = cookies();
    const authCookie = cookieStore.get("auth");
    
    if (!authCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Lấy danh sách tất cả modules từ dữ liệu có sẵn
    const modulesResult = await query(`
      SELECT DISTINCT module_name as name, module_name as id 
      FROM permission_modules 
      WHERE is_active = true
      ORDER BY module_name
    `);

    // Lấy tất cả permission modules có sẵn
    const permissionsResult = await query(`
      SELECT 
        pm.id,
        pm.module_name as module,
        pm.permission_type as type,
        pm.description,
        pm.is_active
      FROM permission_modules pm 
      ORDER BY pm.module_name, pm.permission_type
    `);

    // Lấy danh sách users với permissions hiện tại
    const usersResult = await query(`
      SELECT 
        e.id,
        e.name,
        e.email,
        e.phone,
        e.position,
        e.status,
        e.avatar_url,
        e.company_id,
        c.name as company_name,
        d.name as department_name,
        u.username,
        u.role,
        u.is_active as user_active,
        u.last_login,
        COALESCE(
          json_agg(
            json_build_object(
              'module', pr.module_name,
              'permission', pr.permission_type,
              'granted', pr.granted
            ) ORDER BY pr.module_name, pr.permission_type
          ) FILTER (WHERE pr.module_name IS NOT NULL), 
          '[]'::json
        ) as permissions
      FROM employees e
      LEFT JOIN users u ON e.id = u.employee_id
      LEFT JOIN companies c ON e.company_id = c.id
      LEFT JOIN departments d ON e.department_id = d.id
      LEFT JOIN permission_roles pr ON e.id = pr.employee_id
      WHERE u.id IS NOT NULL
      GROUP BY e.id, e.name, e.email, e.phone, e.position, e.status, e.avatar_url, 
               e.company_id, c.name, d.name, u.username, u.role, u.is_active, u.last_login
      ORDER BY e.name
    `);

    return NextResponse.json({
      success: true,
      data: {
        users: usersResult.rows.map(user => ({
          id: user.id,
          username: user.username,
          email: user.email,
          phone: user.phone,
          name: user.name,
          position: user.position,
          company_name: user.company_name,
          department_name: user.department_name,
          role: user.role,
          status: user.status,
          isActive: user.user_active,
          lastLogin: user.last_login,
          avatarUrl: user.avatar_url,
          permissions: user.permissions || []
        })),
        modules: modulesResult.rows,
        availablePermissions: permissionsResult.rows
      }
    });

  } catch (error) {
    console.error("Error fetching permissions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Tạo permission module mới
export async function POST(request: Request) {
  try {
    // Kiểm tra quyền admin
    const cookieStore = cookies();
    const authCookie = cookieStore.get("auth");
    
    if (!authCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { module_name, permission_type, description } = body;

    // Validate input
    if (!module_name || !permission_type || !description) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Kiểm tra xem permission đã tồn tại chưa
    const existingResult = await query(`
      SELECT id FROM permission_modules 
      WHERE module_name = $1 AND permission_type = $2
    `, [module_name, permission_type]);

    if (existingResult.rows.length > 0) {
      return NextResponse.json(
        { error: "Permission already exists" },
        { status: 400 }
      );
    }

    // Tạo permission mới
    const result = await query(`
      INSERT INTO permission_modules (module_name, permission_type, description, is_active, created_at, updated_at)
      VALUES ($1, $2, $3, true, NOW(), NOW())
      RETURNING *
    `, [module_name, permission_type, description]);

    return NextResponse.json({
      success: true,
      data: result.rows[0],
      message: "Permission created successfully"
    });

  } catch (error) {
    console.error("Error creating permission:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}