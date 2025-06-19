# ApecGlobal Website

Website chính thức của ApecGlobal Group, bao gồm Backend API (NestJS) và Frontend (Next.js).

## Cấu trúc dự án

```
apecglobal-website/
├── backend/                # NestJS Backend API
│   ├── src/                # Source code
│   │   ├── auth/           # Authentication module
│   │   ├── common/         # Common utilities
│   │   ├── database/       # Database configuration
│   │   ├── entities/       # TypeORM entities
│   │   ├── modules/        # Feature modules
│   │   ├── app.module.ts   # Main application module
│   │   └── main.ts         # Application entry point
│   ├── .env                # Environment variables
│   └── package.json        # Dependencies
└── frontend/               # Next.js Frontend (mặc định)
```

## Hướng dẫn cài đặt và chạy dự án

### Cài đặt dependencies

```bash
# Cài đặt dependencies cho Backend
npm run install:backend
```

### Chạy Backend API

```bash
# Khởi động Backend API ở chế độ development
npm run start:backend
```

Backend API sẽ chạy tại địa chỉ: http://localhost:3000/api

Bạn có thể truy cập tài liệu API (Swagger) tại: http://localhost:3000/api/docs

### Chạy Frontend

```bash
# Khởi động Frontend ở chế độ development
npm run dev
```

Frontend sẽ chạy tại địa chỉ: http://localhost:3000

## API Endpoints

### Authentication
- `POST /api/auth/login` - Đăng nhập và lấy JWT token

### Users
- `GET /api/users` - Lấy danh sách người dùng (yêu cầu quyền admin)
- `GET /api/users/:id` - Lấy thông tin người dùng theo ID (yêu cầu quyền admin)
- `POST /api/users` - Tạo người dùng mới (yêu cầu quyền admin)
- `PATCH /api/users/:id` - Cập nhật thông tin người dùng (yêu cầu quyền admin)
- `DELETE /api/users/:id` - Xóa người dùng (yêu cầu quyền admin)

### News
- `GET /api/news` - Lấy danh sách tin tức (có phân trang và lọc)
- `GET /api/news/featured` - Lấy tin tức nổi bật
- `GET /api/news/latest` - Lấy tin tức mới nhất
- `GET /api/news/popular` - Lấy tin tức phổ biến nhất
- `GET /api/news/category/:category` - Lấy tin tức theo danh mục
- `GET /api/news/tag/:tag` - Lấy tin tức theo tag
- `GET /api/news/:id` - Lấy chi tiết tin tức theo ID
- `POST /api/news` - Tạo tin tức mới (yêu cầu quyền admin hoặc editor)
- `PATCH /api/news/:id` - Cập nhật tin tức (yêu cầu quyền admin hoặc editor)
- `DELETE /api/news/:id` - Xóa tin tức (yêu cầu quyền admin)

### Authors
- `GET /api/authors` - Lấy danh sách tác giả
- `GET /api/authors/featured` - Lấy tác giả nổi bật
- `GET /api/authors/:id` - Lấy chi tiết tác giả theo ID
- `GET /api/authors/slug/:slug` - Lấy chi tiết tác giả theo slug
- `POST /api/authors` - Tạo tác giả mới (yêu cầu quyền admin hoặc editor)
- `PATCH /api/authors/:id` - Cập nhật tác giả (yêu cầu quyền admin hoặc editor)
- `DELETE /api/authors/:id` - Xóa tác giả (yêu cầu quyền admin)

## Xác thực và Phân quyền

API sử dụng JWT (JSON Web Token) để xác thực. Để truy cập các API được bảo vệ, bạn cần:

1. Đăng nhập để lấy token:
```
POST /api/auth/login
```

2. Sử dụng token trong header của các request tiếp theo:
```
Authorization: Bearer <your_token>
```

## Vai trò người dùng

- `admin`: Có toàn quyền truy cập và quản lý hệ thống
- `editor`: Có quyền quản lý nội dung (tin tức, tác giả, ...)
- `user`: Chỉ có quyền truy cập các API công khai