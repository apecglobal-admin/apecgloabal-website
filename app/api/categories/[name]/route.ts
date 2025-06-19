import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { query } from "@/lib/db";

// Kiểm tra quyền admin
async function checkAdmin() {
  const cookieStore = cookies();
  const authCookie = cookieStore.get("auth");
  
  if (!authCookie) {
    return false;
  }
  
  try {
    const userId = authCookie.value;
    const result = await query("SELECT * FROM users WHERE id = $1", [userId]);
    
    if (result.rows.length === 0 || result.rows[0].role !== "admin") {
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error checking admin:", error);
    return false;
  }
}

// PUT /api/categories/[name] - Cập nhật danh mục
export async function PUT(
  request: NextRequest,
  { params }: { params: { name: string } }
) {
  try {
    // Kiểm tra quyền admin
    const isAdmin = await checkAdmin();
    if (!isAdmin) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const oldName = decodeURIComponent(params.name);
    const data = await request.json();
    const newName = data.name;
    
    // Kiểm tra dữ liệu đầu vào
    if (!newName) {
      return NextResponse.json(
        { error: "New category name is required" },
        { status: 400 }
      );
    }
    
    // Kiểm tra danh mục tồn tại
    const checkResult = await query(
      "SELECT COUNT(*) FROM news WHERE category = $1",
      [oldName]
    );
    
    if (parseInt(checkResult.rows[0].count) === 0) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }
    
    // Cập nhật danh mục trong bảng news
    await query(
      "UPDATE news SET category = $1 WHERE category = $2",
      [newName, oldName]
    );
    
    return NextResponse.json({ success: true, name: newName });
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/categories/[name] - Xóa danh mục
export async function DELETE(
  request: NextRequest,
  { params }: { params: { name: string } }
) {
  try {
    // Kiểm tra quyền admin
    const isAdmin = await checkAdmin();
    if (!isAdmin) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const name = decodeURIComponent(params.name);
    
    // Kiểm tra danh mục tồn tại
    const checkResult = await query(
      "SELECT COUNT(*) FROM news WHERE category = $1",
      [name]
    );
    
    if (parseInt(checkResult.rows[0].count) === 0) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }
    
    // Xóa danh mục bằng cách đặt category thành NULL cho các tin tức
    await query(
      "UPDATE news SET category = NULL WHERE category = $1",
      [name]
    );
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}