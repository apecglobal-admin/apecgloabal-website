import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { query } from "@/lib/db";

// PUT - Cập nhật permission
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
    const { module_name, permission_type, description, is_active } = body;

    // Validate input
    if (!module_name || !permission_type || !description) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Kiểm tra xem permission có tồn tại không
    const existingResult = await query(`
      SELECT * FROM permission_modules WHERE id = $1
    `, [id]);

    if (existingResult.rows.length === 0) {
      return NextResponse.json(
        { error: "Permission not found" },
        { status: 404 }
      );
    }

    // Cập nhật permission
    const result = await query(`
      UPDATE permission_modules 
      SET module_name = $1, permission_type = $2, description = $3, is_active = $4, updated_at = NOW()
      WHERE id = $5
      RETURNING *
    `, [module_name, permission_type, description, is_active ?? true, id]);

    return NextResponse.json({
      success: true,
      data: result.rows[0],
      message: "Permission updated successfully"
    });

  } catch (error) {
    console.error("Error updating permission:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Xóa permission (soft delete)
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    // Kiểm tra quyền admin
    const cookieStore = cookies();
    const authCookie = cookieStore.get("auth");
    
    if (!authCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    // Kiểm tra xem permission có tồn tại không
    const existingResult = await query(`
      SELECT * FROM permission_modules WHERE id = $1
    `, [id]);

    if (existingResult.rows.length === 0) {
      return NextResponse.json(
        { error: "Permission not found" },
        { status: 404 }
      );
    }

    // Soft delete permission
    await query(`
      UPDATE permission_modules 
      SET is_active = false, updated_at = NOW()
      WHERE id = $1
    `, [id]);

    // Xóa tất cả permission roles liên quan
    await query(`
      DELETE FROM permission_roles 
      WHERE module_name = $1 AND permission_type = $2
    `, [existingResult.rows[0].module_name, existingResult.rows[0].permission_type]);

    return NextResponse.json({
      success: true,
      message: "Permission deleted successfully"
    });

  } catch (error) {
    console.error("Error deleting permission:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}