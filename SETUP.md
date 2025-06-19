# Hướng dẫn cài đặt và chạy dự án ApecGlobal Website

## Yêu cầu hệ thống

- Node.js (v18 trở lên)
- npm (v8 trở lên)
- PostgreSQL (v14 trở lên)

## 1. Cài đặt Backend

### Bước 1: Cài đặt dependencies

```bash
# Di chuyển vào thư mục backend
cd d:/work/APECTECH/apecglobal-website/backend

# Cài đặt các dependencies
npm install
```

### Bước 2: Cấu hình môi trường

Kiểm tra file `.env` trong thư mục backend và đảm bảo thông tin kết nối database là chính xác:

```
# Database
DB_HOST=ep-tiny-poetry-a45r81hy-pooler.us-east-1.aws.neon.tech
DB_PORT=5432
DB_USERNAME=neondb_owner
DB_PASSWORD=npg_JGyM4NXEfVS6
DB_DATABASE=neondb
DB_SSL=true

# JWT
JWT_SECRET=apecglobal_secret_key_change_in_production
JWT_EXPIRES_IN=1d

# App
PORT=3000
NODE_ENV=development
```

### Bước 3: Khởi động Backend

```bash
# Khởi động ở chế độ development
npm run start:dev
```

Backend API sẽ chạy tại địa chỉ: http://localhost:3000/api

Bạn có thể truy cập tài liệu API (Swagger) tại: http://localhost:3000/api/docs

## 2. Cài đặt Frontend

### Bước 1: Cài đặt dependencies

```bash
# Di chuyển vào thư mục gốc của dự án
cd d:/work/APECTECH/apecglobal-website

# Cài đặt dependencies
npm install
```

### Bước 2: Khởi động Frontend

```bash
# Khởi động ở chế độ development
npm run dev
```

Frontend sẽ chạy tại địa chỉ: http://localhost:3000

## 3. Xử lý lỗi thường gặp

### Lỗi kết nối database

Nếu bạn gặp lỗi kết nối database, hãy kiểm tra:

1. Thông tin kết nối trong file `.env` có chính xác không
2. Database PostgreSQL đã được khởi động chưa
3. Firewall có chặn kết nối đến database không
4. Nếu sử dụng database từ xa (như Neon), hãy kiểm tra xem IP của bạn có được phép truy cập không

### Lỗi port đã được sử dụng

Nếu bạn gặp lỗi "Port 3000 is already in use", hãy thay đổi cổng trong file `.env`:

```
PORT=3001
```

### Lỗi CORS

Nếu bạn gặp lỗi CORS khi gọi API từ Frontend, hãy kiểm tra cấu hình CORS trong file `main.ts` của Backend:

```typescript
app.enableCors({
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
});
```

## 4. Cấu trúc API

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

## 5. Xác thực và Phân quyền

API sử dụng JWT (JSON Web Token) để xác thực. Để truy cập các API được bảo vệ, bạn cần:

1. Đăng nhập để lấy token:
```
POST /api/auth/login
```

2. Sử dụng token trong header của các request tiếp theo:
```
Authorization: Bearer <your_token>
```

## 6. Vai trò người dùng

- `admin`: Có toàn quyền truy cập và quản lý hệ thống
- `editor`: Có quyền quản lý nội dung (tin tức, tác giả, ...)
- `user`: Chỉ có quyền truy cập các API công khai