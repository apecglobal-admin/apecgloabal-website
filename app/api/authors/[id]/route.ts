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

// GET /api/authors/[id] - Lấy thông tin tác giả theo ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    const result = await query(
      "SELECT * FROM authors WHERE id = $1",
      [id]
    );
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Author not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("Error getting author by ID:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/authors/[id] - Cập nhật thông tin tác giả
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
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
    
    const id = params.id;
    const data = await request.json();
    
    // Kiểm tra dữ liệu đầu vào
    if (!data.name) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }
    
    // Kiểm tra tác giả tồn tại
    const checkResult = await query("SELECT * FROM authors WHERE id = $1", [id]);
    if (checkResult.rows.length === 0) {
      return NextResponse.json(
        { error: "Author not found" },
        { status: 404 }
      );
    }
    
    // Chuẩn bị dữ liệu
    const {
      name,
      bio,
      email,
      avatar_url,
      social_links,
    } = data;
    
    // Cập nhật tác giả
    const result = await query(
      `UPDATE authors SET
        name = $1,
        bio = $2,
        email = $3,
        avatar_url = $4,
        social_links = $5,
        updated_at = NOW()
      WHERE id = $6
      RETURNING *`,
      [
        name,
        bio || null,
        email || null,
        avatar_url || null,
        social_links || {},
        id,
      ]
    );
    
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating author:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/authors/[id] - Xóa tác giả
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
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
    
    const id = params.id;
    
    // Kiểm tra tác giả tồn tại
    const checkResult = await query("SELECT * FROM authors WHERE id = $1", [id]);
    if (checkResult.rows.length === 0) {
      return NextResponse.json(
        { error: "Author not found" },
        { status: 404 }
      );
    }
    
    // Kiểm tra xem tác giả có đang được sử dụng trong tin tức không
    const newsResult = await query("SELECT COUNT(*) FROM news WHERE author_id = $1", [id]);
    const newsCount = parseInt(newsResult.rows[0].count);
    
    if (newsCount > 0) {
      return NextResponse.json(
        { error: "Cannot delete author because it is being used in news" },
        { status: 400 }
      );
    }
    
    // Xóa tác giả
    await query("DELETE FROM authors WHERE id = $1", [id]);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting author:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}