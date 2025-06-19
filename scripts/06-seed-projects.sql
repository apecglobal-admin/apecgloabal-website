-- Thêm dữ liệu dự án
INSERT INTO projects (name, description, company_id, status, priority, progress, start_date, end_date, budget, spent, team_size, technologies) VALUES
('ApecLearn AI', 'Nền tảng học tập thông minh sử dụng AI để cá nhân hóa trải nghiệm học tập cho từng người dùng. Hệ thống phân tích hành vi học tập, điểm mạnh, điểm yếu và sở thích của người học để đưa ra các khóa học và nội dung phù hợp nhất.', 
1, 'completed', 'high', 100, '2022-01-15', '2024-05-10', 1500000, 1450000, 25, 
ARRAY['Python', 'TensorFlow', 'React', 'Node.js', 'PostgreSQL', 'AWS']),

('SmartCity Security', 'Hệ thống an ninh thông minh cho đô thị, tích hợp camera AI có khả năng nhận diện khuôn mặt, phát hiện hành vi bất thường và cảnh báo sớm các mối nguy hiểm tiềm ẩn. Hệ thống được kết nối với trung tâm điều hành an ninh thành phố.', 
2, 'in-progress', 'high', 75, '2023-08-20', '2024-12-15', 2000000, 1500000, 30, 
ARRAY['Computer Vision', 'IoT', 'Edge Computing', 'Cloud Infrastructure', 'Real-time Analytics']),

('EmoShop Platform', 'Nền tảng thương mại điện tử tích hợp AI phân tích cảm xúc của khách hàng thông qua biểu hiện khuôn mặt, giọng nói và hành vi trực tuyến. Hệ thống tự động điều chỉnh trải nghiệm mua sắm, đề xuất sản phẩm và tối ưu hóa quy trình thanh toán.', 
3, 'in-progress', 'medium', 60, '2023-11-05', '2024-09-30', 1200000, 720000, 20, 
ARRAY['React', 'Node.js', 'TensorFlow.js', 'MongoDB', 'AWS', 'Emotion Recognition API']),

('TimeLoop Analytics', 'Công cụ phân tích hiệu suất sử dụng machine learning để phân tích dữ liệu từ các hoạt động hàng ngày của nhân viên, xác định các điểm nghẽn trong quy trình làm việc và đề xuất các giải pháp cải thiện.', 
4, 'completed', 'medium', 100, '2023-02-10', '2024-05-15', 800000, 780000, 15, 
ARRAY['Python', 'R', 'Machine Learning', 'Data Visualization', 'PostgreSQL', 'React']),

('NeuroOS Enterprise', 'Hệ điều hành doanh nghiệp thông minh có khả năng tự học và thích nghi, giúp tự động hóa và tối ưu hóa các quy trình kinh doanh, từ quản lý nhân sự, tài chính đến chuỗi cung ứng và dịch vụ khách hàng.', 
5, 'in-progress', 'high', 40, '2024-01-20', '2025-12-31', 3000000, 1200000, 40, 
ARRAY['AI', 'Machine Learning', 'Microservices', 'Kubernetes', 'React', 'Node.js', 'PostgreSQL', 'Redis']),

('ApecGlobal Ecosystem', 'Hệ sinh thái kết nối tất cả các sản phẩm và dịch vụ của ApecGlobal Group, tạo ra một nền tảng tích hợp toàn diện cho khách hàng doanh nghiệp và cá nhân.', 
6, 'planning', 'high', 20, '2024-03-01', '2026-06-30', 5000000, 1000000, 50, 
ARRAY['Microservices', 'API Gateway', 'Kubernetes', 'Cloud Infrastructure', 'AI Integration', 'Data Lake']);