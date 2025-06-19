import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { query } from "@/lib/db";

export async function POST(request: Request) {
  try {
    // Kiểm tra quyền admin
    const cookieStore = cookies();
    const authCookie = cookieStore.get("auth");
    
    if (!authCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    try {
      // Thử parse giá trị cookie dưới dạng JSON
      const authData = JSON.parse(authCookie.value);
      
      // Chỉ cho phép admin tạo bảng
      if (authData.id !== 999) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      
      // Tạo bảng permissions nếu chưa tồn tại
      await query(`
        CREATE TABLE IF NOT EXISTS permissions (
          id SERIAL PRIMARY KEY,
          employee_id INTEGER NOT NULL REFERENCES employees(id),
          admin_access BOOLEAN DEFAULT FALSE,
          portal_access BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW(),
          UNIQUE(employee_id)
        )
      `);
      
      return NextResponse.json({
        message: "Permissions table created successfully"
      });
    } catch (parseError) {
      // Nếu không parse được JSON, kiểm tra xem có phải admin không
      const userId = authCookie.value;
      
      if (userId !== "999") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      
      // Tạo bảng permissions nếu chưa tồn tại
      await query(`
        CREATE TABLE IF NOT EXISTS permissions (
          id SERIAL PRIMARY KEY,
          employee_id INTEGER NOT NULL REFERENCES employees(id),
          admin_access BOOLEAN DEFAULT FALSE,
          portal_access BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW(),
          UNIQUE(employee_id)
        )
      `);
      
      return NextResponse.json({
        message: "Permissions table created successfully"
      });
    }
  } catch (error) {
    console.error("Error creating permissions table:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}