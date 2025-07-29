import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { query } from "@/lib/db";

// PUT - Cập nhật permissions cho user
export async function PUT(request: Request, { params }: { params: { userId: string } }) {
  try {
    // Kiểm tra quyền admin
    const cookieStore = cookies();
    const authCookie = cookieStore.get("auth");
    
    if (!authCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = params;
    const body = await request.json();
    const { permissions } = body;

    // Validate input
    if (!permissions || !Array.isArray(permissions)) {
      return NextResponse.json(
        { error: "Invalid permissions data" },
        { status: 400 }
      );
    }

    // Kiểm tra user có tồn tại không
    const userResult = await query(`
      SELECT e.id, e.name FROM employees e
      JOIN users u ON e.id = u.employee_id
      WHERE e.id = $1
    `, [userId]);

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Xóa tất cả permissions cũ của user
    await query(`
      DELETE FROM permission_roles WHERE employee_id = $1
    `, [userId]);

    // Thêm permissions mới
    for (const permission of permissions) {
      if (permission.granted) {
        await query(`
          INSERT INTO permission_roles (employee_id, module_name, permission_type, granted, created_at, updated_at)
          VALUES ($1, $2, $3, $4, NOW(), NOW())
          ON CONFLICT (employee_id, module_name, permission_type) 
          DO UPDATE SET granted = $4, updated_at = NOW()
        `, [userId, permission.module, permission.permission, permission.granted]);
      }
    }

    return NextResponse.json({
      success: true,
      message: "User permissions updated successfully"
    });

  } catch (error) {
    console.error("Error updating user permissions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET - Lấy permissions của user
export async function GET(request: Request, { params }: { params: { userId: string } }) {
  try {
    const { userId } = params;

    const result = await query(`
      SELECT 
        pr.module_name as module,
        pr.permission_type as permission,
        pr.granted,
        pm.description
      FROM permission_roles pr
      JOIN permission_modules pm ON pr.module_name = pm.module_name 
        AND pr.permission_type = pm.permission_type
      WHERE pr.employee_id = $1 AND pm.is_active = true
      ORDER BY pr.module_name, pr.permission_type
    `, [userId]);

    return NextResponse.json({
      success: true,
      data: result.rows
    });

  } catch (error) {
    console.error("Error fetching user permissions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}