-- Tạo bảng authors (tác giả)
CREATE TABLE IF NOT EXISTS authors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255),
  bio TEXT,
  avatar_url VARCHAR(255),
  website_url VARCHAR(255),
  social_facebook VARCHAR(255),
  social_twitter VARCHAR(255),
  social_linkedin VARCHAR(255),
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'news' AND column_name = 'author_id'
  ) THEN
    ALTER TABLE news ADD COLUMN author_id INTEGER REFERENCES authors(id);
  END IF;
END $$;

-- Thêm dữ liệu tác giả
INSERT INTO authors (name, slug, email, bio, avatar_url, website_url, social_facebook, social_twitter, social_linkedin, is_featured) VALUES
('Nguyễn Minh Tuấn', 'nguyen-minh-tuan', 'tuannm@apecglobal.com', 'Nguyễn Minh Tuấn là Giám đốc Nội dung của ApecGlobal Group, với hơn 10 năm kinh nghiệm trong lĩnh vực công nghệ. Ông chuyên viết về AI, Machine Learning và các xu hướng công nghệ mới.', '/images/authors/nguyen-minh-tuan.jpg', 'https://nguyenminhtuan.com', 'https://facebook.com/nguyenminhtuan', 'https://twitter.com/nguyenminhtuan', 'https://linkedin.com/in/nguyenminhtuan', true),

('Trần Thị Hương', 'tran-thi-huong', 'huongtt@apecglobal.com', 'Trần Thị Hương là Biên tập viên cấp cao tại ApecGlobal Group, chuyên về các chủ đề Fintech, Blockchain và chuyển đổi số. Cô có bằng Thạc sĩ Kinh tế từ Đại học Kinh tế TP.HCM.', '/images/authors/tran-thi-huong.jpg', 'https://tranthihuong.com', 'https://facebook.com/tranthihuong', 'https://twitter.com/tranthihuong', 'https://linkedin.com/in/tranthihuong', true),

('Lê Đức Minh', 'le-duc-minh', 'minhld@apecglobal.com', 'Lê Đức Minh là chuyên gia phân tích dữ liệu tại ApecGlobal Group. Ông có hơn 8 năm kinh nghiệm trong lĩnh vực Big Data và Analytics, thường xuyên viết về các chủ đề liên quan đến dữ liệu và AI.', '/images/authors/le-duc-minh.jpg', 'https://leducminh.com', 'https://facebook.com/leducminh', 'https://twitter.com/leducminh', 'https://linkedin.com/in/leducminh', false),

('Phạm Thanh Hà', 'pham-thanh-ha', 'hapt@apecglobal.com', 'Phạm Thanh Hà là Trưởng phòng Marketing của ApecGlobal Group. Cô chuyên viết về các chủ đề liên quan đến marketing số, thương mại điện tử và trải nghiệm khách hàng.', '/images/authors/pham-thanh-ha.jpg', 'https://phamthanhha.com', 'https://facebook.com/phamthanhha', 'https://twitter.com/phamthanhha', 'https://linkedin.com/in/phamthanhha', false),

('Hoàng Văn Nam', 'hoang-van-nam', 'namhv@apecglobal.com', 'Hoàng Văn Nam là Giám đốc Kỹ thuật tại ApecTech. Ông có hơn 15 năm kinh nghiệm trong lĩnh vực phát triển phần mềm và AI, thường xuyên chia sẻ kiến thức về các công nghệ mới nhất.', '/images/authors/hoang-van-nam.jpg', 'https://hoangvannam.com', 'https://facebook.com/hoangvannam', 'https://twitter.com/hoangvannam', 'https://linkedin.com/in/hoangvannam', true);

-- Cập nhật author_id cho các bài viết tin tức
UPDATE news SET author_id = 1 WHERE id = 1;
UPDATE news SET author_id = 2 WHERE id = 2;
UPDATE news SET author_id = 3 WHERE id = 3;
UPDATE news SET author_id = 4 WHERE id = 4;
UPDATE news SET author_id = 5 WHERE id = 5;