-- Thêm trường slug vào bảng news
ALTER TABLE news ADD COLUMN IF NOT EXISTS slug VARCHAR(500) UNIQUE;

-- Cập nhật slug cho các tin tức hiện có
UPDATE news SET slug = LOWER(REPLACE(REPLACE(REPLACE(title, ' ', '-'), '.', ''), ',', '')) WHERE slug IS NULL;

-- Thêm trường slug vào bảng services
ALTER TABLE services ADD COLUMN IF NOT EXISTS slug VARCHAR(500) UNIQUE;

-- Cập nhật slug cho các dịch vụ hiện có
UPDATE services SET slug = LOWER(REPLACE(REPLACE(REPLACE(title, ' ', '-'), '.', ''), ',', '')) WHERE slug IS NULL;

-- Tạo index cho slug
CREATE INDEX IF NOT EXISTS idx_news_slug ON news(slug);
CREATE INDEX IF NOT EXISTS idx_services_slug ON services(slug);