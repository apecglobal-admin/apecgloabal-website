import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { query } from "@/lib/db";

export async function GET() {
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
      
      // Lấy danh sách nhân viên và quyền
      const result = await query(`
        SELECT e.*, 
               p.admin_access, 
               p.portal_access,
               c.name as company_name,
               d.name as department_name
        FROM employees e
        LEFT JOIN permissions p ON e.id = p.employee_id
        LEFT JOIN companies c ON e.company_id = c.id
        LEFT JOIN departments d ON e.department_id = d.id
        ORDER BY e.name ASC
      `);
      
      // Chuyển đổi dữ liệu để dễ sử dụng ở client
      const employees = result.rows.map(employee => ({
        id: employee.id,
        name: employee.name,
        email: employee.email,
        phone: employee.phone,
        position: employee.position,
        department_id: employee.department_id,
        department_name: employee.department_name,
        company_id: employee.company_id,
        company_name: employee.company_name,
        join_date: employee.join_date,
        status: employee.status,
        avatar_url: employee.avatar_url,
        permissions: {
          admin_access: employee.admin_access || false,
          portal_access: employee.portal_access || false
        }
      }));
      
      return NextResponse.json(employees);
    } catch (parseError) {
      // Nếu không parse được JSON, trả về lỗi
      return NextResponse.json({ error: "Invalid auth data" }, { status: 401 });
    }
  } catch (error) {
    console.error("Error getting employees and permissions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}