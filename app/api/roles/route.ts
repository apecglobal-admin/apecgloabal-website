import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { query } from "@/lib/db";

// GET - Lấy danh sách tất cả roles và permissions
export async function GET() {
  try {
    // Kiểm tra quyền admin
    const cookieStore = cookies();
    const authCookie = cookieStore.get("auth");
    
    if (!authCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Lấy danh sách roles với permissions
    const rolesResult = await query(`
      SELECT 
        r.id,
        r.name,
        r.display_name,
        r.description,
        r.is_active,
        r.created_at,
        r.updated_at,
        COUNT(DISTINCT u.id) as user_count,
        COALESCE(
          json_agg(
            json_build_object(
              'module', rp.module_name,
              'permission', rp.permission_type,
              'granted', rp.granted
            ) ORDER BY rp.module_name, rp.permission_type
          ) FILTER (WHERE rp.module_name IS NOT NULL), 
          '[]'::json
        ) as permissions
      FROM roles r
      LEFT JOIN role_permissions rp ON r.id = rp.role_id
      LEFT JOIN users u ON r.id = u.role_id AND u.is_active = true
      WHERE r.is_active = true
      GROUP BY r.id, r.name, r.display_name, r.description, r.is_active, r.created_at, r.updated_at
      ORDER BY r.id
    `);

    // Lấy tất cả permission modules có sẵn
    const availablePermissionsResult = await query(`
      SELECT 
        pm.id,
        pm.module_name as module,
        pm.permission_type as type,
        pm.description,
        pm.is_active
      FROM permission_modules pm 
      WHERE pm.is_active = true
      ORDER BY pm.module_name, pm.permission_type
    `);

    // Lấy danh sách users với roles
    const usersResult = await query(`
      SELECT 
        e.id,
        e.name,
        e.email,
        e.position,
        e.company_id,
        c.name as company_name,
        d.name as department_name,
        u.username,
        u.is_active,
        u.last_login,
        r.id as role_id,
        r.name as role_name,
        r.display_name as role_display_name
      FROM employees e
      JOIN users u ON e.id = u.employee_id
      LEFT JOIN companies c ON e.company_id = c.id
      LEFT JOIN departments d ON e.department_id = d.id
      LEFT JOIN roles r ON u.role_id = r.id
      WHERE u.is_active = true
      ORDER BY e.name
    `);

    return NextResponse.json({
      success: true,
      data: {
        roles: rolesResult.rows.map(role => ({
          id: role.id,
          name: role.name,
          displayName: role.display_name,
          description: role.description,
          isActive: role.is_active,
          userCount: parseInt(role.user_count),
          permissions: role.permissions || [],
          createdAt: role.created_at,
          updatedAt: role.updated_at
        })),
        users: usersResult.rows.map(user => ({
          id: user.id,
          name: user.name,
          email: user.email,
          username: user.username,
          position: user.position,
          companyName: user.company_name,
          departmentName: user.department_name,
          isActive: user.is_active,
          lastLogin: user.last_login,
          role: {
            id: user.role_id,
            name: user.role_name,
            displayName: user.role_display_name
          }
        })),
        availablePermissions: availablePermissionsResult.rows
      }
    });

  } catch (error) {
    console.error("Error fetching roles:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Tạo role mới
export async function POST(request: Request) {
  try {
    // Kiểm tra quyền admin
    const cookieStore = cookies();
    const authCookie = cookieStore.get("auth");
    
    if (!authCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, display_name, description, permissions } = body;

    // Validate input
    if (!name || !display_name || !description) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Kiểm tra xem role đã tồn tại chưa
    const existingResult = await query(`
      SELECT id FROM roles WHERE name = $1
    `, [name]);

    if (existingResult.rows.length > 0) {
      return NextResponse.json(
        { error: "Role already exists" },
        { status: 400 }
      );
    }

    // Tạo role mới
    const roleResult = await query(`
      INSERT INTO roles (name, display_name, description, is_active, created_at, updated_at)
      VALUES ($1, $2, $3, true, NOW(), NOW())
      RETURNING *
    `, [name, display_name, description]);

    const newRole = roleResult.rows[0];

    // Thêm permissions cho role
    if (permissions && Array.isArray(permissions)) {
      for (const permission of permissions) {
        if (permission.granted) {
          await query(`
            INSERT INTO role_permissions (role_id, module_name, permission_type, granted, created_at, updated_at)
            VALUES ($1, $2, $3, true, NOW(), NOW())
          `, [newRole.id, permission.module, permission.permission]);
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: newRole,
      message: "Role created successfully"
    });

  } catch (error) {
    console.error("Error creating role:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}