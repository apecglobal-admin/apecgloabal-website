import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { query } from "@/lib/db";

// Tài khoản admin duy nhất
const ADMIN_ACCOUNT = { username: 'admin', role: 'admin' };

export async function GET() {
  try {
    const cookieStore = cookies();
    const authCookie = cookieStore.get("auth");
    
    if (!authCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    try {
      // Thử parse giá trị cookie dưới dạng JSON
      const authData = JSON.parse(authCookie.value);
      
      if (authData && authData.id) {
        // Nếu là tài khoản admin (id = 999)
        if (authData.id === 999) {
          return NextResponse.json({
            id: 999,
            username: ADMIN_ACCOUNT.username,
            email: "admin@apecglobal.com",
            role: ADMIN_ACCOUNT.role,
            is_active: true,
            last_login: new Date().toISOString(),
            permissions: {
              admin_access: true,
              portal_access: true
            }
          });
        }
        
        // Nếu không phải tài khoản admin, truy vấn database
        try {
          // Lấy thông tin user và employee
          const userResult = await query(`
            SELECT u.id, u.username, u.email, u.role, u.employee_id, u.is_active, u.last_login, 
                   u.created_at, u.updated_at, e.name as employee_name, e.position, 
                   e.department_id, e.company_id, e.avatar_url, e.phone
            FROM users u
            LEFT JOIN employees e ON u.employee_id = e.id
            WHERE u.id = $1
          `, [authData.id]);
          
          if (userResult.rows.length === 0) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
          }
          
          const userData = userResult.rows[0];
          
          // Lấy thông tin quyền
          let permissions = authData.permissions || {
            admin_access: userData.role === 'admin',
            portal_access: true
          };
          
          if (userData.employee_id) {
            try {
              const permissionsResult = await query(`
                SELECT * FROM permissions WHERE employee_id = $1
              `, [userData.employee_id]);
              
              if (permissionsResult.rows.length > 0) {
                const permData = permissionsResult.rows[0];
                permissions = {
                  admin_access: permData.admin_access || false,
                  portal_access: permData.portal_access || true
                };
              }
            } catch (permError) {
              console.error('Error getting permissions:', permError);
              // Nếu có lỗi, sử dụng quyền từ cookie hoặc mặc định
            }
          }
          
          // Lấy thông tin phòng ban nếu có
          let departmentData = null;
          if (userData.department_id) {
            try {
              const departmentResult = await query(`
                SELECT * FROM departments WHERE id = $1
              `, [userData.department_id]);
              
              if (departmentResult.rows.length > 0) {
                departmentData = departmentResult.rows[0];
              }
            } catch (deptError) {
              console.error('Error getting department:', deptError);
            }
          }
          
          // Lấy thông tin công ty nếu có
          let companyData = null;
          if (userData.company_id) {
            try {
              const companyResult = await query(`
                SELECT * FROM companies WHERE id = $1
              `, [userData.company_id]);
              
              if (companyResult.rows.length > 0) {
                companyData = companyResult.rows[0];
              }
            } catch (compError) {
              console.error('Error getting company:', compError);
            }
          }
          
          return NextResponse.json({
            ...userData,
            permissions,
            department: departmentData,
            company: companyData
          });
        } catch (dbError) {
          console.error('Database error:', dbError);
          
          // Nếu có lỗi database, trả về thông tin cơ bản từ cookie
          return NextResponse.json({
            id: authData.id,
            username: authData.username,
            role: authData.role,
            permissions: authData.permissions || {
              admin_access: authData.role === 'admin',
              portal_access: true
            },
            is_active: true,
            last_login: new Date().toISOString()
          });
        }
      }
    } catch (parseError) {
      console.error('Parse error:', parseError);
      // Nếu không parse được JSON, xử lý như cũ (giá trị cookie là userId)
      const userId = authCookie.value;
      
      // Nếu là tài khoản admin
      if (userId === "999") {
        return NextResponse.json({
          id: 999,
          username: ADMIN_ACCOUNT.username,
          email: "admin@apecglobal.com",
          role: ADMIN_ACCOUNT.role,
          is_active: true,
          last_login: new Date().toISOString(),
          permissions: {
            admin_access: true,
            portal_access: true
          }
        });
      }
      
      try {
        const result = await query(
          "SELECT id, username, email, role, is_active, last_login, created_at, updated_at FROM users WHERE id = $1",
          [userId]
        );
        
        if (result.rows.length === 0) {
          return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        
        return NextResponse.json({
          ...result.rows[0],
          permissions: {
            admin_access: result.rows[0].role === 'admin',
            portal_access: true
          }
        });
      } catch (dbError) {
        console.error('Database error with old cookie format:', dbError);
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
    }
    
    return NextResponse.json({ error: "Invalid auth data" }, { status: 401 });
  } catch (error) {
    console.error("Error getting current user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}