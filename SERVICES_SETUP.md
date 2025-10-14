# Services Database Setup

Hướng dẫn thiết lập và sử dụng dữ liệu dịch vụ từ database cho trang home và trang services.

## Tính năng

- ✅ Lấy dữ liệu dịch vụ từ database PostgreSQL
- ✅ Hiển thị dịch vụ động trên trang home (giới hạn 6 dịch vụ)
- ✅ Hiển thị tất cả dịch vụ trên trang services
- ✅ Hỗ trợ slug SEO-friendly cho URL
- ✅ Phân loại dịch vụ featured và non-featured
- ✅ Icon động và màu sắc tự động
- ✅ Link đến trang chi tiết dịch vụ

## Cách thiết lập

### Bước 1: Chạy Migration

Truy cập: `http://localhost:3001/setup-services`

Hoặc gọi API trực tiếp:
```bash
curl http://localhost:3001/api/services/migrate
```

Migration sẽ:
- Thêm cột `slug` vào bảng `services`
- Thêm cột `updated_at` vào bảng `services`
- Tạo unique index cho slug
- Tự động generate slug từ title có sẵn

### Bước 2: Seed Dữ liệu mẫu

Sau khi migration thành công, click "Seed Sample Data" trên trang setup.

Hoặc gọi API:
```bash
curl -X POST http://localhost:3001/api/services/seed
```

Seed sẽ tạo 8 dịch vụ mẫu:
1. **Phát Triển Phần Mềm** (Featured)
2. **Tư Vấn Công Nghệ** (Featured)
3. **Cloud & DevOps** (Featured)
4. **AI & Data Analytics** (Featured)
5. **Bảo Mật & Audit** (Featured)
6. **UI/UX Design**
7. **Database Management**
8. **Technical Support**

## Cấu trúc Database

### Bảng `services`

```sql
CREATE TABLE services (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE,
  company_id INTEGER REFERENCES companies(id),
  description TEXT,
  features JSONB,
  icon VARCHAR(50),
  category VARCHAR(100),
  price_range VARCHAR(100),
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Icon hỗ trợ

- `code` - Code icon
- `database` - Database icon
- `smartphone` - Smartphone icon
- `server` - Server icon
- `briefcase` - Briefcase icon
- `shield` - Shield icon
- `brain` - Brain icon
- `cloud` - Cloud icon
- `cpu` - CPU icon
- `barchart3` - Bar Chart icon
- `settings` - Settings icon
- `wrench` - Wrench icon
- `headphones` - Headphones icon

## API Endpoints

### GET /api/services
Lấy tất cả dịch vụ

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Phát Triển Phần Mềm",
      "slug": "phat-trien-phan-mem",
      "description": "...",
      "features": ["Web Apps", "Mobile Apps"],
      "icon": "code",
      "category": "Development",
      "price_range": "Từ 50 triệu đồng",
      "is_featured": true,
      "company_id": 1,
      "company_name": "ApecGlobal"
    }
  ],
  "total": 8
}
```

### POST /api/services
Tạo dịch vụ mới

**Request Body:**
```json
{
  "title": "Tên dịch vụ",
  "slug": "ten-dich-vu", // Optional, auto-generated from title
  "description": "Mô tả dịch vụ",
  "features": ["Feature 1", "Feature 2"],
  "icon": "code",
  "category": "Development",
  "price_range": "Từ 50 triệu đồng",
  "is_featured": true,
  "company_id": 1
}
```

### PUT /api/services
Cập nhật dịch vụ

**Request Body:**
```json
{
  "id": 1,
  "title": "Tên dịch vụ mới",
  // ... các trường khác
}
```

### DELETE /api/services
Xóa dịch vụ

**Request Body:**
```json
{
  "id": 1
}
```

## Sử dụng trong Code

### Trang Home (`app/home/page.tsx`)

```typescript
// Lấy dữ liệu services
const dbServices = await getAllServices()
// Giới hạn 6 dịch vụ cho home page
dbServices = dbServices.slice(0, 6)

// Hiển thị
{dbServices.map((service, index) => {
  const IconComponent = getServiceIcon(service.icon)
  const colors = getServiceColorClasses(index)
  // ... render service card
})}
```

### Trang Services (`app/services/page.tsx`)

```typescript
// Lấy tất cả dịch vụ
const dbServices = await getAllServices()

// Phân loại featured và non-featured
const mainServices = dbServices.filter(s => s.is_featured)
const additionalServices = dbServices.filter(s => !s.is_featured)
```

## Thêm dịch vụ mới

### Qua API

```bash
curl -X POST http://localhost:3001/api/services \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Blockchain Development",
    "description": "Phát triển ứng dụng blockchain và smart contract",
    "features": ["Smart Contract", "DApp", "NFT"],
    "icon": "cpu",
    "category": "Blockchain",
    "price_range": "Từ 200 triệu đồng",
    "is_featured": true,
    "company_id": 1
  }'
```

### Qua Database

```sql
INSERT INTO services (
  title, slug, description, features, icon, category, 
  price_range, is_featured, company_id
) VALUES (
  'Blockchain Development',
  'blockchain-development',
  'Phát triển ứng dụng blockchain và smart contract',
  '["Smart Contract", "DApp", "NFT"]'::jsonb,
  'cpu',
  'Blockchain',
  'Từ 200 triệu đồng',
  true,
  1
);
```

## Troubleshooting

### Lỗi: "No companies found"
- Đảm bảo đã có ít nhất 1 công ty trong bảng `companies`
- Chạy seed companies trước khi seed services

### Lỗi: "Duplicate key value violates unique constraint"
- Slug bị trùng, thay đổi slug hoặc xóa dịch vụ cũ

### Services không hiển thị
- Kiểm tra console log xem có lỗi khi fetch data không
- Đảm bảo database connection đang hoạt động
- Kiểm tra `getAllServices()` function trong `lib/db.ts`

## Tính năng tương lai

- [ ] Trang chi tiết dịch vụ động từ database
- [ ] Quản lý dịch vụ trong admin panel
- [ ] Upload hình ảnh cho dịch vụ
- [ ] Đánh giá và review dịch vụ
- [ ] Tìm kiếm và lọc dịch vụ
- [ ] Multi-language support