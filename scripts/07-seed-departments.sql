-- Thêm dữ liệu phòng ban
INSERT INTO departments (name, company_id, description, manager_name, employee_count) VALUES
-- ApecTech (company_id = 1)
('AI Research', 1, 'Nghiên cứu và phát triển các thuật toán AI tiên tiến', 'Nguyễn Văn A', 12),
('Education Technology', 1, 'Phát triển các nền tảng học tập thông minh', 'Trần Thị B', 15),
('Data Science', 1, 'Phân tích dữ liệu và xây dựng mô hình dự đoán', 'Lê Văn C', 8),

-- GuardCam (company_id = 2)
('Security Systems', 2, 'Phát triển hệ thống bảo mật thông minh', 'Phạm Thị D', 10),
('Computer Vision', 2, 'Nghiên cứu và phát triển các thuật toán nhận diện hình ảnh', 'Hoàng Văn E', 12),
('IoT Security', 2, 'Phát triển giải pháp bảo mật cho thiết bị IoT', 'Vũ Thị F', 8),

-- EmoCommerce (company_id = 3)
('Emotion Analytics', 3, 'Phân tích cảm xúc khách hàng từ dữ liệu', 'Đặng Văn G', 10),
('E-commerce Platform', 3, 'Phát triển nền tảng thương mại điện tử', 'Ngô Thị H', 15),
('Customer Experience', 3, 'Tối ưu hóa trải nghiệm khách hàng', 'Bùi Văn I', 8),

-- TimeLoop (company_id = 4)
('Behavioral Analytics', 4, 'Phân tích hành vi người dùng', 'Lý Thị K', 8),
('Productivity Tools', 4, 'Phát triển công cụ tăng năng suất', 'Trương Văn L', 10),
('Data Visualization', 4, 'Phát triển các công cụ hiển thị dữ liệu', 'Mai Thị M', 7),

-- ApecNeuroOS (company_id = 5)
('Enterprise OS', 5, 'Phát triển hệ điều hành doanh nghiệp', 'Phan Văn N', 15),
('Automation', 5, 'Phát triển giải pháp tự động hóa quy trình', 'Đỗ Thị O', 12),
('System Integration', 5, 'Tích hợp hệ thống với các nền tảng khác', 'Huỳnh Văn P', 10),

-- ApecGlobal (company_id = 6)
('Executive', 6, 'Ban lãnh đạo tập đoàn', 'Trần Văn Q', 5),
('HR & Admin', 6, 'Quản lý nhân sự và hành chính', 'Lê Thị R', 10),
('Finance', 6, 'Quản lý tài chính', 'Nguyễn Văn S', 8),
('Marketing', 6, 'Marketing và truyền thông', 'Phạm Thị T', 12),
('R&D', 6, 'Nghiên cứu và phát triển', 'Hoàng Văn U', 15),
('Sales', 6, 'Kinh doanh và bán hàng', 'Vũ Thị V', 10);