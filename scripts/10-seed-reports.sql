-- Thêm dữ liệu báo cáo
INSERT INTO reports (title, type, department_id, created_by, status, file_size, file_url, download_count, description) VALUES
-- Báo cáo AI Research (department_id = 1)
('Báo cáo nghiên cứu AI Q1 2024', 'Quarterly', 1, 1, 'published', '4.2 MB', '/reports/ai-research-q1-2024.pdf', 45, 'Báo cáo kết quả nghiên cứu AI quý 1 năm 2024'),
('Phân tích xu hướng AI 2024', 'Analysis', 1, 2, 'published', '3.8 MB', '/reports/ai-trends-2024.pdf', 67, 'Phân tích các xu hướng AI mới nhất trong năm 2024'),
('Báo cáo hiệu suất mô hình NLP', 'Technical', 1, 3, 'published', '2.5 MB', '/reports/nlp-model-performance.pdf', 32, 'Báo cáo đánh giá hiệu suất các mô hình NLP'),

-- Báo cáo Education Technology (department_id = 2)
('Báo cáo phát triển nền tảng EdTech', 'Progress', 2, 4, 'published', '3.1 MB', '/reports/edtech-platform-development.pdf', 28, 'Báo cáo tiến độ phát triển nền tảng học tập EdTech'),
('Phân tích dữ liệu người dùng EdTech', 'Analytics', 2, 5, 'published', '5.3 MB', '/reports/edtech-user-analytics.pdf', 41, 'Phân tích dữ liệu người dùng trên nền tảng EdTech'),

-- Báo cáo Security Systems (department_id = 4)
('Báo cáo an ninh hệ thống Q1 2024', 'Quarterly', 4, 7, 'published', '3.7 MB', '/reports/security-systems-q1-2024.pdf', 53, 'Báo cáo an ninh hệ thống quý 1 năm 2024'),
('Đánh giá lỗ hổng bảo mật', 'Security', 4, 8, 'confidential', '2.9 MB', '/reports/security-vulnerability-assessment.pdf', 25, 'Đánh giá các lỗ hổng bảo mật trong hệ thống'),

-- Báo cáo Emotion Analytics (department_id = 7)
('Báo cáo phân tích cảm xúc khách hàng', 'Analytics', 7, 10, 'published', '4.5 MB', '/reports/customer-emotion-analytics.pdf', 37, 'Báo cáo phân tích cảm xúc khách hàng trên nền tảng EmoCommerce'),
('Nghiên cứu hành vi mua sắm', 'Research', 7, 11, 'published', '3.8 MB', '/reports/shopping-behavior-research.pdf', 42, 'Nghiên cứu về hành vi mua sắm của người dùng'),

-- Báo cáo Behavioral Analytics (department_id = 10)
('Báo cáo phân tích hành vi người dùng', 'Analytics', 10, 13, 'published', '4.1 MB', '/reports/user-behavior-analytics.pdf', 39, 'Báo cáo phân tích hành vi người dùng trên nền tảng TimeLoop'),
('Nghiên cứu tối ưu hóa thời gian', 'Research', 10, 14, 'published', '3.2 MB', '/reports/time-optimization-research.pdf', 31, 'Nghiên cứu về tối ưu hóa thời gian làm việc'),

-- Báo cáo Enterprise OS (department_id = 13)
('Báo cáo phát triển NeuroOS Q1 2024', 'Quarterly', 13, 16, 'published', '3.9 MB', '/reports/neuroos-development-q1-2024.pdf', 28, 'Báo cáo tiến độ phát triển NeuroOS quý 1 năm 2024'),
('Phân tích hiệu suất hệ thống', 'Technical', 13, 17, 'published', '2.8 MB', '/reports/system-performance-analysis.pdf', 35, 'Phân tích hiệu suất của hệ thống NeuroOS'),

-- Báo cáo Executive (department_id = 16)
('Báo cáo tổng kết hoạt động Q1 2024', 'Quarterly', 16, 19, 'published', '5.7 MB', '/reports/executive-summary-q1-2024.pdf', 65, 'Báo cáo tổng kết hoạt động của ApecGlobal quý 1 năm 2024'),
('Chiến lược phát triển 2024-2025', 'Strategy', 16, 19, 'confidential', '4.3 MB', '/reports/development-strategy-2024-2025.pdf', 42, 'Chiến lược phát triển của ApecGlobal giai đoạn 2024-2025'),

-- Báo cáo HR & Admin (department_id = 17)
('Báo cáo nhân sự Q1 2024', 'Quarterly', 17, 20, 'published', '2.5 MB', '/reports/hr-report-q1-2024.pdf', 38, 'Báo cáo nhân sự quý 1 năm 2024'),
('Phân tích hiệu suất nhân viên', 'Analytics', 17, 20, 'confidential', '3.1 MB', '/reports/employee-performance-analysis.pdf', 27, 'Phân tích hiệu suất làm việc của nhân viên'),

-- Báo cáo Finance (department_id = 18)
('Báo cáo tài chính Q1 2024', 'Quarterly', 18, 21, 'published', '3.8 MB', '/reports/financial-report-q1-2024.pdf', 47, 'Báo cáo tài chính quý 1 năm 2024'),
('Phân tích chi phí hoạt động', 'Financial', 18, 21, 'confidential', '2.9 MB', '/reports/operational-cost-analysis.pdf', 31, 'Phân tích chi phí hoạt động của ApecGlobal'),

-- Báo cáo Marketing (department_id = 19)
('Báo cáo marketing Q1 2024', 'Quarterly', 19, 22, 'published', '4.2 MB', '/reports/marketing-report-q1-2024.pdf', 43, 'Báo cáo marketing quý 1 năm 2024'),
('Phân tích hiệu quả chiến dịch', 'Analytics', 19, 22, 'published', '3.5 MB', '/reports/campaign-effectiveness-analysis.pdf', 36, 'Phân tích hiệu quả các chiến dịch marketing');