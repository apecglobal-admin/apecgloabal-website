-- Migration: Update Company-Department Structure
-- Thêm field is_parent_company vào bảng companies
-- Loại bỏ mối quan hệ company_id từ bảng departments

-- 1. Thêm field is_parent_company vào bảng companies
ALTER TABLE companies ADD COLUMN IF NOT EXISTS is_parent_company BOOLEAN DEFAULT FALSE;

-- 2. Cập nhật một công ty làm công ty mẹ (có thể thay đổi sau)
-- Giả sử công ty đầu tiên sẽ là công ty mẹ
UPDATE companies SET is_parent_company = TRUE WHERE id = (SELECT MIN(id) FROM companies);

-- 3. Loại bỏ foreign key constraint từ departments.company_id (nếu có)
-- Kiểm tra và drop constraint nếu tồn tại
DO $$ 
BEGIN
    -- Drop foreign key constraint nếu tồn tại
    IF EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE constraint_name LIKE '%departments_company_id%' 
        AND table_name = 'departments'
    ) THEN
        ALTER TABLE departments DROP CONSTRAINT departments_company_id_fkey;
    END IF;
END $$;

-- 4. Drop column company_id từ bảng departments
ALTER TABLE departments DROP COLUMN IF EXISTS company_id;

-- 5. Cập nhật các bảng khác nếu cần thiết
-- Jobs table vẫn giữ department_id và company_id để biết thuộc công ty con nào
-- Employees table vẫn giữ department_id và company_id

-- 6. Tạo index cho field mới
CREATE INDEX IF NOT EXISTS idx_companies_is_parent ON companies(is_parent_company);

-- 7. Comment để ghi chú thay đổi
COMMENT ON COLUMN companies.is_parent_company IS 'Đánh dấu công ty mẹ - chỉ có 1 công ty được đánh dấu TRUE';
COMMENT ON TABLE departments IS 'Phòng ban thuộc công ty mẹ, nhân viên thuộc phòng ban nhưng làm việc tại công ty con';