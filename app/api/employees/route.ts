import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { query } from "@/lib/db";
import { createDefaultPermissions } from "@/lib/permissions";

// GET - Lấy danh sách employees
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('company_id');
    const departmentId = searchParams.get('department_id');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE 1=1';
    const queryParams = [];
    let paramCount = 0;

    if (companyId) {
      paramCount++;
      whereClause += ` AND e.company_id = $${paramCount}`;
      queryParams.push(companyId);
    }

    if (departmentId) {
      paramCount++;
      whereClause += ` AND e.department_id = $${paramCount}`;
      queryParams.push(departmentId);
    }

    if (search) {
      paramCount++;
      whereClause += ` AND (e.name ILIKE $${paramCount} OR e.email ILIKE $${paramCount} OR e.position ILIKE $${paramCount})`;
      queryParams.push(`%${search}%`);
    }

    // Count total
    const countResult = await query(`
      SELECT COUNT(*) as total
      FROM employees e
      ${whereClause}
    `, queryParams);

    // Get employees với thông tin role
    paramCount++;
    const employeesQuery = `
      SELECT 
        e.*,
        c.name as company_name,
        d.name as department_name,
        u.username,
        u.is_active as user_active,
        r.id as role_id,
        r.name as role_name,
        r.display_name as role_display_name
      FROM employees e
      LEFT JOIN companies c ON e.company_id = c.id
      LEFT JOIN departments d ON e.department_id = d.id
      LEFT JOIN users u ON e.id = u.employee_id
      LEFT JOIN roles r ON u.role_id = r.id
      ${whereClause}
      ORDER BY e.created_at DESC
      LIMIT $${paramCount} OFFSET $${paramCount + 1}
    `;
    queryParams.push(limit, offset);

    const result = await query(employeesQuery, queryParams);

    return NextResponse.json({
      success: true,
      data: {
        employees: result.rows,
        pagination: {
          total: parseInt(countResult.rows[0].total),
          page,
          limit,
          totalPages: Math.ceil(parseInt(countResult.rows[0].total) / limit)
        }
      }
    });

  } catch (error) {
    console.error("Error fetching employees:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Tạo employee mới
export async function POST(request: Request) {
  try {
    // Kiểm tra quyền
    const cookieStore = cookies();
    const authCookie = cookieStore.get("auth");
    
    if (!authCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { 
      name, 
      email, 
      phone, 
      position, 
      department_id, 
      company_id,
      salary,
      join_date,
      create_user_account = true,
      username,
      password = '123456' // Mật khẩu mặc định
    } = body;

    // Validate dữ liệu bắt buộc
    if (!name || !email || !company_id) {
      return NextResponse.json(
        { error: "Name, email, and company_id are required" },
        { status: 400 }
      );
    }

    // Kiểm tra email đã tồn tại chưa
    const existingEmployee = await query(
      'SELECT id FROM employees WHERE email = $1',
      [email]
    );

    if (existingEmployee.rows.length > 0) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }

    // Tạo employee
    const employeeResult = await query(`
      INSERT INTO employees (
        name, email, phone, position, department_id, company_id, 
        salary, join_date, status, created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'active', NOW(), NOW())
      RETURNING *
    `, [
      name, email, phone, position, department_id, company_id, 
      salary, join_date || new Date().toISOString().split('T')[0]
    ]);

    const newEmployee = employeeResult.rows[0];

    // Tạo user account nếu được yêu cầu
    if (create_user_account) {
      const userUsername = username || email.split('@')[0];
      
      // Kiểm tra username đã tồn tại chưa
      const existingUser = await query(
        'SELECT id FROM users WHERE username = $1',
        [userUsername]
      );

      if (existingUser.rows.length > 0) {
        return NextResponse.json(
          { error: "Username already exists" },
          { status: 400 }
        );
      }

      // Lấy Employee role (role mặc định)
      const employeeRoleResult = await query(`
        SELECT id FROM roles WHERE name = 'employee' AND is_active = true
      `);

      if (employeeRoleResult.rows.length === 0) {
        return NextResponse.json(
          { error: "Employee role not found" },
          { status: 500 }
        );
      }

      const employeeRoleId = employeeRoleResult.rows[0].id;

      // Tạo user account với Employee role
      await query(`
        INSERT INTO users (
          username, email, password_hash, role, employee_id, 
          role_id, is_active, created_at, updated_at
        )
        VALUES ($1, $2, $3, 'employee', $4, $5, true, NOW(), NOW())
      `, [
        userUsername, email, password, newEmployee.id, employeeRoleId
      ]);

      console.log(`✅ Created user account for ${name} with Employee role (only documents view permission)`);
    }

    return NextResponse.json({
      success: true,
      data: newEmployee,
      message: `Employee created successfully${create_user_account ? ' with user account (Employee role - documents view only)' : ''}`
    });

  } catch (error) {
    console.error("Error creating employee:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}