-- Migration: Create Simple Positions Table
-- Tạo bảng chức vụ đơn giản để có dropdown khi nhập nhân viên

-- 1. Tạo bảng positions đơn giản
CREATE TABLE IF NOT EXISTS positions (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    level VARCHAR(50) DEFAULT 'staff', -- staff, supervisor, manager, director, executive
    is_manager_position BOOLEAN DEFAULT FALSE, -- Đánh dấu chức vụ có quyền quản lý
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tạo các chức vụ cơ bản
INSERT INTO positions (title, description, level, is_manager_position) VALUES
-- Quản lý cấp cao
('Giám Đốc Điều Hành', 'Điều hành toàn bộ hoạt động công ty', 'executive', TRUE),
('Phó Giám Đốc', 'Hỗ trợ Giám đốc điều hành', 'executive', TRUE),

-- Trưởng phòng
('Trưởng Phòng Nhân Sự', 'Quản lý phòng nhân sự', 'manager', TRUE),
('Trưởng Phòng Kỹ Thuật', 'Quản lý phòng kỹ thuật', 'manager', TRUE),
('Trưởng Phòng Marketing', 'Quản lý phòng marketing', 'manager', TRUE),
('Trưởng Phòng Kinh Doanh', 'Quản lý phòng kinh doanh', 'manager', TRUE),
('Trưởng Phòng Tài Chính', 'Quản lý phòng tài chính', 'manager', TRUE),

-- Chuyên viên
('Chuyên Viên Nhân Sự', 'Thực hiện các công việc nhân sự', 'staff', FALSE),
('Lập Trình Viên Senior', 'Phát triển phần mềm cấp cao', 'supervisor', FALSE),
('Lập Trình Viên', 'Phát triển phần mềm', 'staff', FALSE),
('Chuyên Viên Marketing', 'Thực hiện marketing', 'staff', FALSE),
('Nhân Viên Kinh Doanh', 'Bán hàng và chăm sóc khách hàng', 'staff', FALSE),
('Kế Toán', 'Quản lý tài chính', 'staff', FALSE),
('Thư Ký', 'Hỗ trợ hành chính', 'staff', FALSE),
('Nhân Viên Hành Chính', 'Công việc hành chính tổng hợp', 'staff', FALSE),
('Thực Tập Sinh', 'Học tập và hỗ trợ', 'intern', FALSE);

-- 3. Tạo các index cần thiết
CREATE INDEX IF NOT EXISTS idx_positions_level ON positions(level);
CREATE INDEX IF NOT EXISTS idx_positions_is_manager ON positions(is_manager_position);
CREATE INDEX IF NOT EXISTS idx_positions_is_active ON positions(is_active);

-- 4. Tạo trigger để tự động cập nhật updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_positions_updated_at 
    BEFORE UPDATE ON positions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 5. Comment
COMMENT ON TABLE positions IS 'Bảng quản lý các chức vụ/vị trí công việc đơn giản';
COMMENT ON COLUMN positions.is_manager_position IS 'TRUE nếu chức vụ này có quyền quản lý (trưởng phòng, giám đốc, etc.)';
COMMENT ON COLUMN positions.level IS 'Cấp bậc: intern, staff, supervisor, manager, director, executive';