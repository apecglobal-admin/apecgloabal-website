import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { query } from "@/lib/db";

export async function POST(request: Request) {
  try {
    // Kiểm tra quyền admin
    const cookieStore = cookies();
    const authCookie = cookieStore.get("auth");
    const adminAuthCookie = cookieStore.get("admin_auth");
    
    if (!authCookie || !adminAuthCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    try {
      // Thử parse giá trị cookie dưới dạng JSON
      const authData = JSON.parse(authCookie.value);
      
      if (!authData.permissions?.admin_access) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      
      // Lấy dữ liệu từ request
      const body = await request.json();
      const { employee_id, permission_type, value } = body;
      
      // Kiểm tra dữ liệu đầu vào
      if (!employee_id || !permission_type || value === undefined) {
        return NextResponse.json(
          { error: "Missing required fields" },
          { status: 400 }
        );
      }
      
      // Kiểm tra loại quyền hợp lệ
      if (!["admin_access", "portal_access"].includes(permission_type)) {
        return NextResponse.json(
          { error: "Invalid permission type" },
          { status: 400 }
        );
      }
      
      // Kiểm tra xem nhân viên có tồn tại không
      const employeeResult = await query(
        "SELECT * FROM employees WHERE id = $1",
        [employee_id]
      );
      
      if (employeeResult.rows.length === 0) {
        return NextResponse.json(
          { error: "Employee not found" },
          { status: 404 }
        );
      }
      
      // Kiểm tra xem đã có bản ghi quyền cho nhân viên này chưa
      const permissionResult = await query(
        "SELECT * FROM permissions WHERE employee_id = $1",
        [employee_id]
      );
      
      if (permissionResult.rows.length === 0) {
        // Nếu chưa có, tạo mới
        const defaultValues = {
          admin_access: permission_type === "admin_access" ? value : false,
          portal_access: permission_type === "portal_access" ? value : true
        };
        
        await query(`
          INSERT INTO permissions (employee_id, admin_access, portal_access, created_at, updated_at)
          VALUES ($1, $2, $3, NOW(), NOW())
        `, [
          employee_id,
          defaultValues.admin_access,
          defaultValues.portal_access
        ]);
      } else {
        // Nếu đã có, cập nhật
        await query(`
          UPDATE permissions
          SET ${permission_type} = $1, updated_at = NOW()
          WHERE employee_id = $2
        `, [value, employee_id]);
      }
      
      // Cập nhật user nếu có
      const userResult = await query(
        "SELECT * FROM users WHERE employee_id = $1",
        [employee_id]
      );
      
      if (userResult.rows.length > 0) {
        // Nếu là quyền admin_access, cập nhật role
        if (permission_type === "admin_access") {
          await query(`
            UPDATE users
            SET role = $1, updated_at = NOW()
            WHERE employee_id = $2
          `, [value ? "admin" : "employee", employee_id]);
        }
      }
      
      return NextResponse.json({
        message: "Permission updated successfully",
        employee_id,
        permission_type,
        value
      });
    } catch (parseError) {
      // Nếu không parse được JSON, trả về lỗi
      return NextResponse.json({ error: "Invalid auth data" }, { status: 401 });
    }
  } catch (error) {
    console.error("Error updating permission:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}