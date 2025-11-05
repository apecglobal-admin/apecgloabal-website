# 🎭 Role-Based Access Control (RBAC) System Guide

## 📋 Tổng quan

Hệ thống RBAC mới thay thế hệ thống phân quyền cũ (phân quyền từng user) bằng cách quản lý quyền theo **vai trò (roles)**. Điều này giúp:

- ✅ Quản lý quyền theo nhóm thay vì từng user riêng lẻ
- ✅ Dễ dàng gán quyền cho nhân viên mới (chỉ cần chọn role)
- ✅ Nhất quán quyền hạn trong cùng một vai trò
- ✅ Mở rộng được cho hàng trăm nhân viên
- ✅ Nhân viên mới mặc định chỉ có quyền xem tài liệu

## 🎯 Các Roles Mặc định

### 1. **Super Admin** 🔴
- **Mô tả**: Quyền cao nhất, có thể làm tất cả
- **Permissions**: 43/43 (100%)
- **Sử dụng cho**: Chủ sở hữu, CTO, CEO

### 2. **Admin** 🟠  
- **Mô tả**: Quản trị viên, có thể quản lý hầu hết tính năng
- **Permissions**: 42/43 (không có quyền xóa permissions)
- **Sử dụng cho**: IT Manager, HR Manager

### 3. **Manager** 🔵
- **Mô tả**: Quản lý, có thể xem và quản lý dự án, nhân viên
- **Permissions**: 15/43 (dashboard, employees, departments, projects, reports, news, documents, services, jobs)
- **Sử dụng cho**: Team Lead, Department Manager

### 4. **Employee** 🟢 (MẶC ĐỊNH)
- **Mô tả**: Nhân viên thường, chỉ có thể xem tài liệu và thông tin cơ bản
- **Permissions**: 4/43 (dashboard.view, documents.view, news.view, services.view)
- **Sử dụng cho**: Nhân viên thường

### 5. **Guest** ⚪
- **Mô tả**: Khách, chỉ có quyền xem rất hạn chế  
- **Permissions**: 1/43 (dashboard.view)
- **Sử dụng cho**: Thực tập sinh, khách tham quan

## 🚀 Cách sử dụng

### 1. Truy cập quản lý Roles
```
/cms/roles
```

### 2. Tạo Role mới
1. Click **"Tạo Role mới"**
2. Điền thông tin:
   - **Tên role (code)**: e.g. `senior_developer`
   - **Tên hiển thị**: e.g. `Senior Developer`
   - **Mô tả**: Mô tả chi tiết về role
3. Chọn permissions cần thiết theo từng module
4. Click **"Tạo role"**

### 3. Chỉnh sửa quyền cho Role
1. Tìm role cần sửa trong danh sách
2. Click icon **Edit** (✏️)
3. Bật/tắt permissions theo module
4. Click **"Lưu thay đổi"**

### 4. Gán Role cho User
1. Click **"Quản lý Users"** 
2. Chọn user từ dropdown
3. Chọn role mới
4. Click **"Thay đổi role"**

### 5. Tạo nhân viên mới
- Khi tạo employee mới qua `/cms/employees`, hệ thống sẽ:
  - Tự động tạo user account
  - Gán **Employee role** (mặc định)
  - User chỉ có quyền xem tài liệu

## 🛠️ API Endpoints

### Roles Management
```typescript
GET    /api/roles              // Lấy danh sách roles và users
POST   /api/roles              // Tạo role mới
PUT    /api/roles/[id]         // Cập nhật role
DELETE /api/roles/[id]         // Xóa role (nếu không có user nào dùng)

PUT    /api/roles/users/[userId]  // Thay đổi role của user
```

### Sử dụng trong Code
```typescript
import { checkPermission, requirePermission, MODULES, PERMISSIONS } from "@/lib/permissions";

// Kiểm tra quyền
const permissionCheck = await checkPermission(employeeId, MODULES.DOCUMENTS, PERMISSIONS.VIEW);
if (!permissionCheck.hasPermission) {
  // Không có quyền
}

// Middleware cho API
const authCheck = await requirePermission(employeeId, MODULES.EMPLOYEES, PERMISSIONS.CREATE);
if (!authCheck.authorized) {
  return NextResponse.json({ error: authCheck.error }, { status: 403 });
}

// Lấy tất cả quyền của user
const userPermissions = await getUserPermissions(employeeId);

// Kiểm tra admin
const isUserAdmin = await isAdmin(employeeId);

// Gán role cho user
await assignUserRole(employeeId, roleId);
```

## 📊 Database Schema

### Bảng `roles`
```sql
CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,           -- e.g. 'admin', 'employee'
  display_name VARCHAR(100) NOT NULL,         -- e.g. 'Admin', 'Employee'  
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Bảng `role_permissions`
```sql
CREATE TABLE role_permissions (
  id SERIAL PRIMARY KEY,
  role_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  module_name VARCHAR(100) NOT NULL,          -- e.g. 'documents', 'employees'
  permission_type VARCHAR(50) NOT NULL,       -- e.g. 'view', 'create', 'edit', 'delete'
  granted BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(role_id, module_name, permission_type)
);
```

### Bảng `users` (cập nhật)
```sql
ALTER TABLE users ADD COLUMN role_id INTEGER REFERENCES roles(id);
```

## 🔒 Security Best Practices

1. **Employee Role cho nhân viên mới**: Mặc định chỉ có quyền xem tài liệu
2. **Principle of Least Privilege**: Chỉ cấp quyền tối thiểu cần thiết
3. **Regular Review**: Định kỳ review quyền của từng role
4. **Role Separation**: Tách biệt rõ ràng quyền giữa các cấp bậc
5. **Audit Trail**: Log tất cả thay đổi quyền và role

## 🎉 Migration từ hệ thống cũ

Hệ thống cũ vẫn có thể truy cập qua `/cms/permissions` để tham khảo, nhưng nên sử dụng hệ thống RBAC mới cho:

- **Scalability**: Dễ quản lý với nhiều nhân viên
- **Consistency**: Đảm bảo quyền nhất quán
- **Efficiency**: Giảm thời gian quản lý quyền
- **Security**: Kiểm soát quyền tốt hơn

## 📞 Support

Nếu có vấn đề về hệ thống RBAC, liên hệ:
- **Trang quản lý**: `/cms/roles`
- **API Documentation**: `/api/roles`
- **Old System**: `/cms/permissions` (legacy)

---

**🎯 Kết luận**: Hệ thống RBAC giúp quản lý quyền hiệu quả hơn, đặc biệt với số lượng nhân viên lớn. Nhân viên mới sẽ mặc định chỉ có quyền xem tài liệu, đảm bảo bảo mật thông tin công ty.