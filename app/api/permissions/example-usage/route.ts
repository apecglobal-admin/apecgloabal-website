import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { requirePermission, MODULES, PERMISSIONS } from "@/lib/permissions";

/**
 * Ví dụ về cách sử dụng hệ thống permissions trong API routes
 * 
 * API này sẽ kiểm tra xem user có quyền xem employees không
 * Trước khi trả về dữ liệu
 */
export async function GET() {
  try {
    // Lấy thông tin user từ cookie
    const cookieStore = cookies();
    const authCookie = cookieStore.get("auth");
    
    if (!authCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let employeeId: number;
    try {
      // Parse auth data to get employee ID
      const authData = JSON.parse(authCookie.value);
      employeeId = authData.employee_id;
    } catch {
      return NextResponse.json({ error: "Invalid auth data" }, { status: 401 });
    }

    // Kiểm tra quyền xem employees
    const permissionCheck = await requirePermission(
      employeeId, 
      MODULES.EMPLOYEES, 
      PERMISSIONS.VIEW
    );

    if (!permissionCheck.authorized) {
      return NextResponse.json(
        { 
          error: permissionCheck.error,
          required_permission: `${MODULES.EMPLOYEES}.${PERMISSIONS.VIEW}`,
          user_role: permissionCheck.data?.role
        }, 
        { status: 403 }
      );
    }

    // Nếu có quyền, trả về dữ liệu
    return NextResponse.json({
      success: true,
      message: "You have permission to view employees",
      data: {
        user_role: permissionCheck.data?.role,
        user_permissions: permissionCheck.data?.permissions?.filter(p => p.granted),
        requested_permission: `${MODULES.EMPLOYEES}.${PERMISSIONS.VIEW}`
      }
    });

  } catch (error) {
    console.error("Error in permission example:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * Ví dụ POST endpoint với multiple permission checks
 */
export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    const authCookie = cookieStore.get("auth");
    
    if (!authCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let employeeId: number;
    try {
      const authData = JSON.parse(authCookie.value);
      employeeId = authData.employee_id;
    } catch {
      return NextResponse.json({ error: "Invalid auth data" }, { status: 401 });
    }

    const body = await request.json();
    const { action } = body;

    // Kiểm tra quyền dựa trên action
    let requiredPermission: string;
    switch (action) {
      case 'create_employee':
        requiredPermission = PERMISSIONS.CREATE;
        break;
      case 'edit_employee':
        requiredPermission = PERMISSIONS.EDIT;
        break;
      case 'delete_employee':
        requiredPermission = PERMISSIONS.DELETE;
        break;
      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        );
    }

    const permissionCheck = await requirePermission(
      employeeId, 
      MODULES.EMPLOYEES, 
      requiredPermission
    );

    if (!permissionCheck.authorized) {
      return NextResponse.json(
        { 
          error: `Access denied for action: ${action}`,
          required_permission: `${MODULES.EMPLOYEES}.${requiredPermission}`,
          user_role: permissionCheck.data?.role,
          user_permissions: permissionCheck.data?.permissions?.filter(p => p.granted)
        }, 
        { status: 403 }
      );
    }

    // Thực hiện action tương ứng
    let result;
    switch (action) {
      case 'create_employee':
        result = { message: "Employee created successfully", action };
        break;
      case 'edit_employee':
        result = { message: "Employee updated successfully", action };
        break;
      case 'delete_employee':
        result = { message: "Employee deleted successfully", action };
        break;
    }

    return NextResponse.json({
      success: true,
      data: result,
      permission_info: {
        user_role: permissionCheck.data?.role,
        used_permission: `${MODULES.EMPLOYEES}.${requiredPermission}`
      }
    });

  } catch (error) {
    console.error("Error in permission example POST:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * Example PUT endpoint - Update permissions (admin only)
 */
export async function PUT(request: Request) {
  try {
    const cookieStore = cookies();
    const authCookie = cookieStore.get("auth");
    
    if (!authCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let employeeId: number;
    try {
      const authData = JSON.parse(authCookie.value);
      employeeId = authData.employee_id;
    } catch {
      return NextResponse.json({ error: "Invalid auth data" }, { status: 401 });
    }

    // Kiểm tra quyền admin cho permissions management
    const permissionCheck = await requirePermission(
      employeeId, 
      MODULES.PERMISSIONS, 
      PERMISSIONS.EDIT
    );

    if (!permissionCheck.authorized) {
      return NextResponse.json(
        { 
          error: "Only users with permission management rights can access this endpoint",
          required_permission: `${MODULES.PERMISSIONS}.${PERMISSIONS.EDIT}`,
          user_role: permissionCheck.data?.role
        }, 
        { status: 403 }
      );
    }

    // Admin-only functionality
    return NextResponse.json({
      success: true,
      message: "Permission management access granted",
      data: {
        user_role: permissionCheck.data?.role,
        available_actions: [
          "View all permissions",
          "Create new permissions", 
          "Edit existing permissions",
          "Delete permissions",
          "Assign permissions to users"
        ]
      }
    });

  } catch (error) {
    console.error("Error in permission example PUT:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}