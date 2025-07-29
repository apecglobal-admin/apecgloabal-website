import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { query } from "@/lib/db";

// PUT - Cập nhật role
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    // Kiểm tra quyền admin
    const cookieStore = cookies();
    const authCookie = cookieStore.get("auth");
    
    if (!authCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();
    const { name, display_name, description, permissions, is_active } = body;

    // Validate input
    if (!name || !display_name || !description) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Kiểm tra xem role có tồn tại không
    const existingResult = await query(`
      SELECT * FROM roles WHERE id = $1
    `, [id]);

    if (existingResult.rows.length === 0) {
      return NextResponse.json(
        { error: "Role not found" },
        { status: 404 }
      );
    }

    // Cập nhật role
    const roleResult = await query(`
      UPDATE roles 
      SET name = $1, display_name = $2, description = $3, is_active = $4, updated_at = NOW()
      WHERE id = $5
      RETURNING *
    `, [name, display_name, description, is_active ?? true, id]);

    // Xóa tất cả permissions cũ của role
    await query(`
      DELETE FROM role_permissions WHERE role_id = $1
    `, [id]);

    // Thêm permissions mới
    if (permissions && Array.isArray(permissions)) {
      for (const permission of permissions) {
        if (permission.granted) {
          await query(`
            INSERT INTO role_permissions (role_id, module_name, permission_type, granted, created_at, updated_at)
            VALUES ($1, $2, $3, true, NOW(), NOW())
          `, [id, permission.module, permission.permission]);
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: roleResult.rows[0],
      message: "Role updated successfully"
    });

  } catch (error) {
    console.error("Error updating role:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Xóa role
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    // Kiểm tra quyền admin
    const cookieStore = cookies();
    const authCookie = cookieStore.get("auth");
    
    if (!authCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    // Kiểm tra xem role có tồn tại không
    const existingResult = await query(`
      SELECT * FROM roles WHERE id = $1
    `, [id]);

    if (existingResult.rows.length === 0) {
      return NextResponse.json(
        { error: "Role not found" },
        { status: 404 }
      );
    }

    // Kiểm tra xem có user nào đang sử dụng role này không
    const usersUsingRole = await query(`
      SELECT COUNT(*) as count FROM users WHERE role_id = $1 AND is_active = true
    `, [id]);

    if (parseInt(usersUsingRole.rows[0].count) > 0) {
      return NextResponse.json(
        { error: `Cannot delete role. ${usersUsingRole.rows[0].count} users are currently using this role.` },
        { status: 400 }
      );
    }

    // Soft delete role
    await query(`
      UPDATE roles 
      SET is_active = false, updated_at = NOW()
      WHERE id = $1
    `, [id]);

    return NextResponse.json({
      success: true,
      message: "Role deleted successfully"
    });

  } catch (error) {
    console.error("Error deleting role:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}