import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { query } from "@/lib/db";

// PUT - Cập nhật role của user
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
    const { role_id } = body;

    // Validate input
    if (!role_id) {
      return NextResponse.json(
        { error: "Role ID is required" },
        { status: 400 }
      );
    }

    // Kiểm tra user có tồn tại không
    const userResult = await query(`
      SELECT u.id, e.name FROM users u
      JOIN employees e ON u.employee_id = e.id
      WHERE u.employee_id = $1 AND u.is_active = true
    `, [userId]);

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Kiểm tra role có tồn tại không
    const roleResult = await query(`
      SELECT * FROM roles WHERE id = $1 AND is_active = true
    `, [role_id]);

    if (roleResult.rows.length === 0) {
      return NextResponse.json(
        { error: "Role not found" },
        { status: 404 }
      );
    }

    // Cập nhật role của user
    await query(`
      UPDATE users 
      SET role_id = $1, role = $2, updated_at = NOW()
      WHERE employee_id = $3
    `, [role_id, roleResult.rows[0].name, userId]);

    return NextResponse.json({
      success: true,
      message: `User role updated to ${roleResult.rows[0].display_name}`
    });

  } catch (error) {
    console.error("Error updating user role:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}