-- Migration: Create reports table if not exists
-- This ensures the reports table has the correct structure

-- Create reports table
CREATE TABLE IF NOT EXISTS reports (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    department_id INTEGER REFERENCES departments(id),
    created_by INTEGER REFERENCES employees(id),
    status VARCHAR(50) DEFAULT 'Đang xử lý',
    file_size VARCHAR(20) DEFAULT '0 MB',
    file_url TEXT,
    file_public_id VARCHAR(255),
    download_count INTEGER DEFAULT 0,
    description TEXT,
    period VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_reports_department_id ON reports(department_id);
CREATE INDEX IF NOT EXISTS idx_reports_created_by ON reports(created_by);
CREATE INDEX IF NOT EXISTS idx_reports_type ON reports(type);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports(created_at);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_reports_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS trigger_update_reports_updated_at ON reports;
CREATE TRIGGER trigger_update_reports_updated_at
    BEFORE UPDATE ON reports
    FOR EACH ROW
    EXECUTE FUNCTION update_reports_updated_at();

-- Insert sample data if table is empty
INSERT INTO reports (title, type, department_id, created_by, status, file_size, file_url, download_count, description, period)
SELECT 
    'Báo cáo tài chính Q1/2024',
    'Tài chính',
    (SELECT id FROM departments WHERE name LIKE '%Tài chính%' LIMIT 1),
    (SELECT id FROM employees LIMIT 1),
    'Hoàn thành',
    '2.5 MB',
    'https://res.cloudinary.com/demo/raw/upload/v1/reports/financial-q1-2024.pdf',
    25,
    'Báo cáo tài chính quý 1 năm 2024',
    'Q1/2024'
WHERE NOT EXISTS (SELECT 1 FROM reports WHERE title = 'Báo cáo tài chính Q1/2024');

INSERT INTO reports (title, type, department_id, created_by, status, file_size, file_url, download_count, description, period)
SELECT 
    'Báo cáo nhân sự tháng 12/2024',
    'Nhân sự',
    (SELECT id FROM departments WHERE name LIKE '%Nhân sự%' LIMIT 1),
    (SELECT id FROM employees LIMIT 1),
    'Hoàn thành',
    '1.8 MB',
    'https://res.cloudinary.com/demo/raw/upload/v1/reports/hr-dec-2024.pdf',
    15,
    'Báo cáo tình hình nhân sự tháng 12 năm 2024',
    '12/2024'
WHERE NOT EXISTS (SELECT 1 FROM reports WHERE title = 'Báo cáo nhân sự tháng 12/2024');

INSERT INTO reports (title, type, department_id, created_by, status, file_size, file_url, download_count, description, period)
SELECT 
    'Báo cáo dự án Q4/2024',
    'Dự án',
    (SELECT id FROM departments WHERE name LIKE '%Kỹ thuật%' LIMIT 1),
    (SELECT id FROM employees LIMIT 1),
    'Đang xử lý',
    '0 MB',
    NULL,
    0,
    'Báo cáo tiến độ các dự án trong quý 4 năm 2024',
    'Q4/2024'
WHERE NOT EXISTS (SELECT 1 FROM reports WHERE title = 'Báo cáo dự án Q4/2024');