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

// GET /api/categories - Lấy danh sách danh mục
export async function GET() {
  try {
    // Lấy danh sách danh mục từ bảng news
    const result = await query(
      "SELECT DISTINCT category FROM news WHERE category IS NOT NULL ORDER BY category"
    );
    
    // Trả về mảng các danh mục
    const categories = result.rows.map(row => row.category);
    
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error getting categories:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/categories - Thêm danh mục mới
export async function POST(request: NextRequest) {
  try {
    // Kiểm tra quyền admin
    const isAdmin = await checkAdmin();
    if (!isAdmin) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const data = await request.json();
    
    // Kiểm tra dữ liệu đầu vào
    if (!data.name) {
      return NextResponse.json(
        { error: "Category name is required" },
        { status: 400 }
      );
    }
    
    const categoryName = data.name;
    
    // Kiểm tra danh mục đã tồn tại chưa
    const checkResult = await query(
      "SELECT COUNT(*) FROM news WHERE category = $1",
      [categoryName]
    );
    
    if (parseInt(checkResult.rows[0].count) > 0) {
      return NextResponse.json(
        { error: "Category already exists" },
        { status: 400 }
      );
    }
    
    // Tạo một tin tức mẫu với danh mục mới (sẽ không hiển thị vì published = false)
    await query(
      `INSERT INTO news (
        title, excerpt, content, category, published, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, NOW(), NOW())`,
      [
        `Sample for category: ${categoryName}`,
        `This is a sample news for the category: ${categoryName}`,
        `This is a sample content for the category: ${categoryName}. This news is not published and is only used to create the category.`,
        categoryName,
        false
      ]
    );
    
    return NextResponse.json({ success: true, name: categoryName }, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}