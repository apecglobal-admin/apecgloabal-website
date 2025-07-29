import { query } from "@/lib/db";
import { UserPermission } from "@/lib/schema";

export interface PermissionCheck {
  hasPermission: boolean;
  permissions: UserPermission[];
  role: string;
}

/**
 * Kiểm tra quyền của user cho module và action cụ thể (Role-based)
 */
export async function checkPermission(
  employeeId: number, 
  module: string, 
  action: string
): Promise<PermissionCheck> {
  try {
    // Lấy thông tin user và role permissions
    const userResult = await query(`
      SELECT 
        u.role,
        r.name as role_name,
        r.display_name as role_display_name,
        COALESCE(
          json_agg(
            json_build_object(
              'module', rp.module_name,
              'permission', rp.permission_type,
              'granted', rp.granted
            ) ORDER BY rp.module_name, rp.permission_type
          ) FILTER (WHERE rp.module_name IS NOT NULL), 
          '[]'::json
        ) as permissions
      FROM users u
      LEFT JOIN roles r ON u.role_id = r.id
      LEFT JOIN role_permissions rp ON r.id = rp.role_id
      WHERE u.employee_id = $1 AND u.is_active = true
      GROUP BY u.role, r.name, r.display_name
    `, [employeeId]);

    if (userResult.rows.length === 0) {
      return {
        hasPermission: false,
        permissions: [],
        role: 'none'
      };
    }

    const user = userResult.rows[0];
    const permissions: UserPermission[] = user.permissions || [];

    // Super Admin có tất cả quyền
    if (user.role_name === 'super_admin') {
      return {
        hasPermission: true,
        permissions,
        role: user.role_name
      };
    }

    // Kiểm tra quyền cụ thể từ role
    const hasPermission = permissions.some(p => 
      p.module === module && 
      p.permission === action && 
      p.granted === true
    );

    return {
      hasPermission,
      permissions,
      role: user.role_name || user.role
    };

  } catch (error) {
    console.error('Error checking permission:', error);
    return {
      hasPermission: false,
      permissions: [],
      role: 'error'
    };
  }
}

/**
 * Middleware để kiểm tra quyền trong API routes
 */
export async function requirePermission(
  employeeId: number, 
  module: string, 
  action: string
): Promise<{ authorized: boolean; error?: string; data?: PermissionCheck }> {
  const result = await checkPermission(employeeId, module, action);
  
  if (!result.hasPermission) {
    return {
      authorized: false,
      error: `Access denied. Required permission: ${module}.${action}`,
      data: result
    };
  }

  return {
    authorized: true,
    data: result
  };
}

/**
 * Lấy tất cả permissions của user
 */
export async function getUserPermissions(employeeId: number): Promise<UserPermission[]> {
  try {
    const result = await query(`
      SELECT 
        pr.module_name as module,
        pr.permission_type as permission,
        pr.granted,
        pm.description
      FROM permission_roles pr
      JOIN permission_modules pm ON pr.module_name = pm.module_name 
        AND pr.permission_type = pm.permission_type
      WHERE pr.employee_id = $1 AND pm.is_active = true AND pr.granted = true
      ORDER BY pr.module_name, pr.permission_type
    `, [employeeId]);

    return result.rows.map(row => ({
      module: row.module,
      permission: row.permission,
      granted: row.granted,
      description: row.description
    }));

  } catch (error) {
    console.error('Error getting user permissions:', error);
    return [];
  }
}

/**
 * Kiểm tra xem user có quyền admin không
 */
export async function isAdmin(employeeId: number): Promise<boolean> {
  try {
    const result = await query(`
      SELECT role FROM users WHERE employee_id = $1 AND is_active = true
    `, [employeeId]);

    return result.rows.length > 0 && result.rows[0].role === 'admin';
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}

/**
 * Cấp quyền cho user
 */
export async function grantPermission(
  employeeId: number,
  module: string,
  permission: string
): Promise<boolean> {
  try {
    await query(`
      INSERT INTO permission_roles (employee_id, module_name, permission_type, granted, created_at, updated_at)
      VALUES ($1, $2, $3, true, NOW(), NOW())
      ON CONFLICT (employee_id, module_name, permission_type) 
      DO UPDATE SET granted = true, updated_at = NOW()
    `, [employeeId, module, permission]);

    return true;
  } catch (error) {
    console.error('Error granting permission:', error);
    return false;
  }
}

/**
 * Revoke quyền của user
 */
export async function revokePermission(
  employeeId: number,
  module: string,
  permission: string
): Promise<boolean> {
  try {
    await query(`
      UPDATE permission_roles 
      SET granted = false, updated_at = NOW()
      WHERE employee_id = $1 AND module_name = $2 AND permission_type = $3
    `, [employeeId, module, permission]);

    return true;
  } catch (error) {
    console.error('Error revoking permission:', error);
    return false;
  }
}

/**
 * Gán role mặc định cho user mới (Employee role)
 */
export async function createDefaultPermissions(employeeId: number): Promise<boolean> {
  try {
    // Lấy Employee role (role mặc định)
    const roleResult = await query(`
      SELECT id FROM roles WHERE name = 'employee' AND is_active = true
    `);

    if (roleResult.rows.length === 0) {
      console.error('Employee role not found');
      return false;
    }

    const employeeRoleId = roleResult.rows[0].id;

    // Gán employee role cho user mới
    const success = await assignUserRole(employeeId, employeeRoleId);
    return success;
  } catch (error) {
    console.error('Error creating default permissions:', error);
    return false;
  }
}

/**
 * Constants cho các modules và permissions
 */
export const MODULES = {
  DASHBOARD: 'dashboard',
  EMPLOYEES: 'employees',
  DEPARTMENTS: 'departments',
  PROJECTS: 'projects',
  REPORTS: 'reports',
  NEWS: 'news',
  DOCUMENTS: 'documents',
  SERVICES: 'services',
  JOBS: 'jobs',
  COMPANIES: 'companies',
  PERMISSIONS: 'permissions',
  SETTINGS: 'settings'
} as const;

export const PERMISSIONS = {
  VIEW: 'view',
  CREATE: 'create',
  EDIT: 'edit',
  DELETE: 'delete'
} as const;

export type ModuleType = typeof MODULES[keyof typeof MODULES];
export type PermissionType = typeof PERMISSIONS[keyof typeof PERMISSIONS];