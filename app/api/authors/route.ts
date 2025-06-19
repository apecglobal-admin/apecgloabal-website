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

// GET /api/authors - Lấy danh sách tác giả
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search");
    const offset = (page - 1) * limit;
    
    // Xây dựng câu truy vấn
    let queryText = "SELECT * FROM authors WHERE 1=1";
    const queryParams: any[] = [];
    let paramIndex = 1;
    
    if (search) {
      queryText += ` AND (name ILIKE $${paramIndex} OR bio ILIKE $${paramIndex})`;
      queryParams.push(`%${search}%`);
      paramIndex++;
    }
    
    // Thêm sắp xếp và phân trang
    queryText += ` ORDER BY name ASC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    queryParams.push(limit, offset);
    
    // Thực hiện truy vấn
    const result = await query(queryText, queryParams);
    
    // Lấy tổng số tác giả
    let countQueryText = "SELECT COUNT(*) FROM authors WHERE 1=1";
    let countParams: any[] = [];
    paramIndex = 1;
    
    if (search) {
      countQueryText += ` AND (name ILIKE $${paramIndex} OR bio ILIKE $${paramIndex})`;
      countParams.push(`%${search}%`);
      paramIndex++;
    }
    
    const countResult = await query(countQueryText, countParams);
    const totalCount = parseInt(countResult.rows[0].count);
    
    return NextResponse.json({
      authors: result.rows,
      pagination: {
        total: totalCount,
        page,
        limit,
        pages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    console.error("Error getting authors:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/authors - Tạo tác giả mới
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
        { error: "Name is required" },
        { status: 400 }
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
    
    // Thêm tác giả mới
    const result = await query(
      `INSERT INTO authors (
        name, bio, email, avatar_url, social_links, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
      RETURNING *`,
      [
        name,
        bio || null,
        email || null,
        avatar_url || null,
        social_links || {},
      ]
    );
    
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error("Error creating author:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}