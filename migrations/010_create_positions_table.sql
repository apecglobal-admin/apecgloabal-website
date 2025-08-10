-- Migration: Create Positions Table
-- Tạo bảng chức vụ để quản lý các vị trí công việc

-- 1. Tạo bảng positions
CREATE TABLE IF NOT EXISTS positions (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    department_category VARCHAR(100), -- Loại phòng ban phù hợp (HR, IT, Sales, etc.)
    level VARCHAR(50) DEFAULT 'staff', -- staff, supervisor, manager, director, executive
    is_manager_position BOOLEAN DEFAULT FALSE, -- Đánh dấu chức vụ có quyền quản lý
    min_salary DECIMAL(15,2),
    max_salary DECIMAL(15,2),
    requirements TEXT[], -- Yêu cầu kỹ năng, kinh nghiệm
    responsibilities TEXT[], -- Trách nhiệm chính
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tạo một số chức vụ mẫu
INSERT INTO positions (title, description, department_category, level, is_manager_position, requirements, responsibilities) VALUES
-- Quản lý cấp cao
('Giám Đốc Điều Hành', 'Điều hành toàn bộ hoạt động công ty', 'Executive', 'executive', TRUE, ARRAY['MBA hoặc kinh nghiệm 10+ năm', 'Kỹ năng lãnh đạo xuất sắc'], ARRAY['Hoạch định chiến lược công ty', 'Quản lý điều hành tổng thể']),
('Phó Giám Đốc', 'Hỗ trợ Giám đốc điều hành', 'Executive', 'executive', TRUE, ARRAY['Kinh nghiệm 8+ năm', 'Kỹ năng quản lý'], ARRAY['Hỗ trợ điều hành', 'Giám sát các phòng ban']),

-- Trưởng phòng
('Trưởng Phòng Nhân Sự', 'Quản lý phòng nhân sự', 'HR', 'manager', TRUE, ARRAY['Kinh nghiệm HR 5+ năm', 'Kỹ năng quản lý nhân sự'], ARRAY['Quản lý nhân viên HR', 'Tuyển dụng và phát triển nhân sự']),
('Trưởng Phòng Kỹ Thuật', 'Quản lý phòng kỹ thuật', 'IT', 'manager', TRUE, ARRAY['Kinh nghiệm IT 5+ năm', 'Kỹ năng lãnh đạo team'], ARRAY['Quản lý team developer', 'Giám sát các dự án kỹ thuật']),
('Trưởng Phòng Marketing', 'Quản lý phòng marketing', 'Marketing', 'manager', TRUE, ARRAY['Kinh nghiệm marketing 5+ năm', 'Kỹ năng digital marketing'], ARRAY['Quản lý chiến lược marketing', 'Phát triển thương hiệu']),
('Trưởng Phòng Kinh Doanh', 'Quản lý phòng kinh doanh', 'Sales', 'manager', TRUE, ARRAY['Kinh nghiệm sales 5+ năm', 'Kỹ năng đàm phán'], ARRAY['Quản lý team sales', 'Phát triển khách hàng']),

-- Chuyên viên
('Chuyên Viên Nhân Sự', 'Thực hiện các công việc nhân sự', 'HR', 'staff', FALSE, ARRAY['Tốt nghiệp ĐH', 'Kinh nghiệm 2+ năm'], ARRAY['Tuyển dụng', 'Quản lý hồ sơ nhân viên']),
('Lập Trình Viên Senior', 'Phát triển phần mềm', 'IT', 'supervisor', FALSE, ARRAY['Kinh nghiệm lập trình 3+ năm', 'Thành thạo ngôn ngữ lập trình'], ARRAY['Coding', 'Review code', 'Mentor junior']),
('Lập Trình Viên', 'Phát triển phần mềm', 'IT', 'staff', FALSE, ARRAY['Kiến thức lập trình cơ bản', 'Tốt nghiệp IT'], ARRAY['Coding theo yêu cầu', 'Học hỏi và phát triển']),
('Chuyên Viên Marketing', 'Thực hiện marketing', 'Marketing', 'staff', FALSE, ARRAY['Kiến thức marketing', 'Kỹ năng sáng tạo'], ARRAY['Content marketing', 'Social media', 'Tổ chức sự kiện']),
('Nhân Viên Kinh Doanh', 'Bán hàng và chăm sóc khách hàng', 'Sales', 'staff', FALSE, ARRAY['Kỹ năng giao tiếp', 'Kinh nghiệm sales'], ARRAY['Tư vấn khách hàng', 'Bán hàng', 'Chăm sóc sau bán']),
('Kế Toán', 'Quản lý tài chính', 'Finance', 'staff', FALSE, ARRAY['Tốt nghiệp kinh tế', 'Kiến thức kế toán'], ARRAY['Ghi sổ kế toán', 'Lập báo cáo tài chính']),
('Thực Tập Sinh', 'Học tập và hỗ trợ', 'General', 'intern', FALSE, ARRAY['Sinh viên năm cuối'], ARRAY['Học hỏi', 'Hỗ trợ công việc cơ bản']);

-- 3. Tạo các index cần thiết
CREATE INDEX IF NOT EXISTS idx_positions_level ON positions(level);
CREATE INDEX IF NOT EXISTS idx_positions_is_manager ON positions(is_manager_position);
CREATE INDEX IF NOT EXISTS idx_positions_department_category ON positions(department_category);
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
COMMENT ON TABLE positions IS 'Bảng quản lý các chức vụ/vị trí công việc';
COMMENT ON COLUMN positions.is_manager_position IS 'TRUE nếu chức vụ này có quyền quản lý (trưởng phòng, giám đốc, etc.)';
COMMENT ON COLUMN positions.level IS 'Cấp bậc: intern, staff, supervisor, manager, director, executive';
COMMENT ON COLUMN positions.department_category IS 'Loại phòng ban phù hợp với chức vụ này';