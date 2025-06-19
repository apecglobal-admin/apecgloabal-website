-- Thêm dữ liệu cho bảng categories
INSERT INTO categories (name, slug, description, parent_id, icon) VALUES
-- Danh mục chính
('Công Nghệ', 'cong-nghe', 'Các bài viết về công nghệ mới', NULL, 'cpu'),
('Kinh Doanh', 'kinh-doanh', 'Các bài viết về kinh doanh và thị trường', NULL, 'briefcase'),
('Sự Kiện', 'su-kien', 'Các sự kiện và hội thảo', NULL, 'calendar'),
('Giải Pháp', 'giai-phap', 'Các giải pháp công nghệ', NULL, 'lightbulb'),
('Tuyển Dụng', 'tuyen-dung', 'Thông tin tuyển dụng', NULL, 'users'),

-- Danh mục con của Công Nghệ
('AI & Machine Learning', 'ai-machine-learning', 'Trí tuệ nhân tạo và học máy', 1, 'brain'),
('Bảo Mật', 'bao-mat', 'An ninh mạng và bảo mật thông tin', 1, 'shield'),
('Cloud Computing', 'cloud-computing', 'Điện toán đám mây', 1, 'cloud'),
('IoT', 'iot', 'Internet vạn vật', 1, 'wifi'),
('Big Data', 'big-data', 'Dữ liệu lớn và phân tích', 1, 'database'),

-- Danh mục con của Kinh Doanh
('Khởi Nghiệp', 'khoi-nghiep', 'Thông tin về khởi nghiệp', 2, 'rocket'),
('Đầu Tư', 'dau-tu', 'Thông tin về đầu tư', 2, 'trending-up'),
('Thị Trường', 'thi-truong', 'Phân tích thị trường', 2, 'bar-chart'),
('Chiến Lược', 'chien-luoc', 'Chiến lược kinh doanh', 2, 'target'),

-- Danh mục con của Giải Pháp
('Giải Pháp Doanh Nghiệp', 'giai-phap-doanh-nghiep', 'Giải pháp cho doanh nghiệp', 4, 'building'),
('Giải Pháp Giáo Dục', 'giai-phap-giao-duc', 'Giải pháp cho giáo dục', 4, 'book-open'),
('Giải Pháp Thương Mại Điện Tử', 'giai-phap-thuong-mai-dien-tu', 'Giải pháp cho thương mại điện tử', 4, 'shopping-cart'),
('Giải Pháp An Ninh', 'giai-phap-an-ninh', 'Giải pháp an ninh và giám sát', 4, 'shield');

-- Thêm dữ liệu cho bảng tags
INSERT INTO tags (name, slug) VALUES
('AI', 'ai'),
('Machine Learning', 'machine-learning'),
('Deep Learning', 'deep-learning'),
('Computer Vision', 'computer-vision'),
('NLP', 'nlp'),
('Cloud', 'cloud'),
('AWS', 'aws'),
('Azure', 'azure'),
('GCP', 'gcp'),
('Security', 'security'),
('IoT', 'iot'),
('Big Data', 'big-data'),
('Analytics', 'analytics'),
('Business Intelligence', 'business-intelligence'),
('Startup', 'startup'),
('Investment', 'investment'),
('E-commerce', 'e-commerce'),
('Education', 'education'),
('EdTech', 'edtech'),
('FinTech', 'fintech'),
('Blockchain', 'blockchain'),
('Cryptocurrency', 'cryptocurrency'),
('Mobile', 'mobile'),
('Web Development', 'web-development'),
('UX/UI', 'ux-ui'),
('DevOps', 'devops'),
('Automation', 'automation'),
('Digital Transformation', 'digital-transformation'),
('Remote Work', 'remote-work'),
('Innovation', 'innovation');

-- Thêm dữ liệu cho bảng content_tags (liên kết tin tức với thẻ)
INSERT INTO content_tags (content_type, content_id, tag_id) VALUES
-- Liên kết tin tức với thẻ
('news', 1, 1), -- Tin tức 1 - AI
('news', 1, 2), -- Tin tức 1 - Machine Learning
('news', 1, 19), -- Tin tức 1 - EdTech
('news', 2, 10), -- Tin tức 2 - Security
('news', 2, 11), -- Tin tức 2 - IoT
('news', 3, 17), -- Tin tức 3 - E-commerce
('news', 3, 13), -- Tin tức 3 - Analytics
('news', 4, 13), -- Tin tức 4 - Analytics
('news', 4, 14), -- Tin tức 4 - Business Intelligence
('news', 5, 27), -- Tin tức 5 - Automation
('news', 5, 28); -- Tin tức 5 - Digital Transformation

-- Thêm dữ liệu cho bảng project_members
INSERT INTO project_members (project_id, employee_id, role, join_date) VALUES
-- ApecLearn AI (project_id = 1)
(1, 1, 'leader', '2022-01-15'),
(1, 2, 'member', '2022-01-20'),
(1, 3, 'member', '2022-02-01'),
(1, 4, 'consultant', '2022-03-15'),
(1, 5, 'member', '2022-02-10'),

-- SmartCity Security (project_id = 2)
(2, 7, 'leader', '2023-08-20'),
(2, 8, 'member', '2023-08-25'),
(2, 9, 'member', '2023-09-01'),
(2, 16, 'consultant', '2023-10-15'),

-- EmoShop Platform (project_id = 3)
(3, 10, 'leader', '2023-11-05'),
(3, 11, 'member', '2023-11-10'),
(3, 12, 'member', '2023-11-15'),
(3, 23, 'consultant', '2023-12-01'),

-- TimeLoop Analytics (project_id = 4)
(4, 13, 'leader', '2023-02-10'),
(4, 14, 'member', '2023-02-15'),
(4, 15, 'member', '2023-02-20'),

-- NeuroOS Enterprise (project_id = 5)
(5, 16, 'leader', '2024-01-20'),
(5, 17, 'member', '2024-01-25'),
(5, 18, 'member', '2024-02-01'),
(5, 23, 'consultant', '2024-02-15'),
(5, 1, 'consultant', '2024-03-01'),

-- ApecGlobal Ecosystem (project_id = 6)
(6, 19, 'leader', '2024-03-01'),
(6, 20, 'member', '2024-03-05'),
(6, 21, 'member', '2024-03-10'),
(6, 22, 'member', '2024-03-15'),
(6, 23, 'member', '2024-03-20'),
(6, 24, 'member', '2024-03-25'),
(6, 1, 'consultant', '2024-04-01'),
(6, 7, 'consultant', '2024-04-01'),
(6, 10, 'consultant', '2024-04-01'),
(6, 13, 'consultant', '2024-04-01'),
(6, 16, 'consultant', '2024-04-01');

-- Thêm dữ liệu cho bảng project_tasks
INSERT INTO project_tasks (project_id, title, description, assignee_id, status, priority, start_date, due_date, completed_date, progress) VALUES
-- ApecLearn AI (project_id = 1)
(1, 'Phân tích yêu cầu', 'Phân tích yêu cầu và lập kế hoạch dự án', 1, 'done', 'high', '2022-01-15', '2022-02-15', '2022-02-10', 100),
(1, 'Thiết kế kiến trúc', 'Thiết kế kiến trúc hệ thống', 2, 'done', 'high', '2022-02-15', '2022-03-15', '2022-03-10', 100),
(1, 'Phát triển mô hình AI', 'Phát triển các mô hình AI cho nền tảng', 3, 'done', 'high', '2022-03-15', '2022-06-15', '2022-06-10', 100),
(1, 'Phát triển frontend', 'Phát triển giao diện người dùng', 5, 'done', 'medium', '2022-04-15', '2022-07-15', '2022-07-10', 100),
(1, 'Phát triển backend', 'Phát triển backend và API', 2, 'done', 'high', '2022-04-15', '2022-07-15', '2022-07-20', 100),
(1, 'Kiểm thử', 'Kiểm thử hệ thống', 3, 'done', 'medium', '2022-07-20', '2022-09-20', '2022-09-15', 100),
(1, 'Triển khai', 'Triển khai hệ thống lên môi trường production', 1, 'done', 'high', '2022-09-20', '2022-10-20', '2022-10-15', 100),

-- SmartCity Security (project_id = 2)
(2, 'Phân tích yêu cầu', 'Phân tích yêu cầu và lập kế hoạch dự án', 7, 'done', 'high', '2023-08-20', '2023-09-20', '2023-09-15', 100),
(2, 'Thiết kế kiến trúc', 'Thiết kế kiến trúc hệ thống', 8, 'done', 'high', '2023-09-20', '2023-10-20', '2023-10-15', 100),
(2, 'Phát triển mô hình nhận diện', 'Phát triển các mô hình nhận diện hình ảnh', 9, 'in-progress', 'high', '2023-10-20', '2024-01-20', NULL, 80),
(2, 'Phát triển hệ thống giám sát', 'Phát triển hệ thống giám sát thời gian thực', 8, 'in-progress', 'high', '2023-11-20', '2024-02-20', NULL, 70),
(2, 'Tích hợp IoT', 'Tích hợp với các thiết bị IoT', 9, 'in-progress', 'medium', '2023-12-20', '2024-03-20', NULL, 60),
(2, 'Phát triển dashboard', 'Phát triển dashboard quản lý', 7, 'todo', 'medium', '2024-02-20', '2024-04-20', NULL, 20),
(2, 'Kiểm thử', 'Kiểm thử hệ thống', 8, 'todo', 'medium', '2024-04-20', '2024-05-20', NULL, 0),

-- EmoShop Platform (project_id = 3)
(3, 'Phân tích yêu cầu', 'Phân tích yêu cầu và lập kế hoạch dự án', 10, 'done', 'high', '2023-11-05', '2023-12-05', '2023-12-01', 100),
(3, 'Thiết kế UX/UI', 'Thiết kế giao diện người dùng', 11, 'done', 'high', '2023-12-05', '2024-01-05', '2024-01-10', 100),
(3, 'Phát triển mô hình phân tích cảm xúc', 'Phát triển mô hình phân tích cảm xúc', 12, 'in-progress', 'high', '2024-01-10', '2024-03-10', NULL, 75),
(3, 'Phát triển frontend', 'Phát triển giao diện người dùng', 11, 'in-progress', 'medium', '2024-01-20', '2024-03-20', NULL, 65),
(3, 'Phát triển backend', 'Phát triển backend và API', 10, 'in-progress', 'high', '2024-01-20', '2024-03-20', NULL, 60),
(3, 'Tích hợp thanh toán', 'Tích hợp các cổng thanh toán', 12, 'todo', 'medium', '2024-03-20', '2024-04-20', NULL, 0),

-- Thêm dữ liệu cho bảng contacts
INSERT INTO contacts (name, email, phone, company, subject, message, status) VALUES
('Nguyễn Văn X', 'nguyenvanx@example.com', '0912345678', 'Công ty X', 'Hợp tác kinh doanh', 'Tôi muốn tìm hiểu về cơ hội hợp tác kinh doanh với ApecGlobal.', 'new'),
('Trần Thị Y', 'tranthiy@example.com', '0923456789', 'Công ty Y', 'Tư vấn giải pháp AI', 'Công ty chúng tôi đang tìm kiếm giải pháp AI cho hệ thống quản lý khách hàng.', 'read'),
('Lê Văn Z', 'levanz@example.com', '0934567890', 'Công ty Z', 'Báo giá dịch vụ', 'Vui lòng gửi báo giá chi tiết về dịch vụ phát triển phần mềm của quý công ty.', 'replied'),
('Phạm Thị W', 'phamthiw@example.com', '0945678901', 'Công ty W', 'Hỗ trợ kỹ thuật', 'Chúng tôi đang gặp vấn đề với hệ thống đã triển khai, cần hỗ trợ kỹ thuật gấp.', 'new'),
('Hoàng Văn V', 'hoangvanv@example.com', '0956789012', 'Công ty V', 'Tuyển dụng', 'Tôi muốn ứng tuyển vào vị trí AI Engineer tại công ty.', 'read');

-- Thêm dữ liệu cho bảng subscriptions
INSERT INTO subscriptions (email, name, status, subscription_date) VALUES
('subscriber1@example.com', 'Người đăng ký 1', 'active', '2023-01-15'),
('subscriber2@example.com', 'Người đăng ký 2', 'active', '2023-02-20'),
('subscriber3@example.com', 'Người đăng ký 3', 'active', '2023-03-25'),
('subscriber4@example.com', 'Người đăng ký 4', 'active', '2023-04-30'),
('subscriber5@example.com', 'Người đăng ký 5', 'active', '2023-05-05'),
('unsubscriber1@example.com', 'Người hủy đăng ký 1', 'unsubscribed', '2023-01-10'),
('unsubscriber2@example.com', 'Người hủy đăng ký 2', 'unsubscribed', '2023-02-15');

-- Thêm dữ liệu cho bảng settings
INSERT INTO settings (setting_key, setting_value, setting_group, description) VALUES
('site_name', 'ApecGlobal Group', 'general', 'Tên website'),
('site_description', 'Tập đoàn công nghệ hàng đầu Việt Nam', 'general', 'Mô tả website'),
('contact_email', 'info@apecglobal.com', 'contact', 'Email liên hệ'),
('contact_phone', '+84 24 3456 7890', 'contact', 'Số điện thoại liên hệ'),
('contact_address', 'Tầng 25, Tòa tháp Landmark 81, TP.HCM', 'contact', 'Địa chỉ liên hệ'),
('social_facebook', 'https://facebook.com/apecglobal', 'social', 'Facebook'),
('social_twitter', 'https://twitter.com/apecglobal', 'social', 'Twitter'),
('social_linkedin', 'https://linkedin.com/company/apecglobal', 'social', 'LinkedIn'),
('social_youtube', 'https://youtube.com/apecglobal', 'social', 'YouTube'),
('mail_driver', 'smtp', 'mail', 'Driver email'),
('mail_host', 'smtp.gmail.com', 'mail', 'Host email'),
('mail_port', '587', 'mail', 'Port email'),
('mail_encryption', 'tls', 'mail', 'Encryption email'),
('google_analytics', 'UA-XXXXXXXXX-X', 'analytics', 'Google Analytics ID'),
('recaptcha_site_key', '6LcXXXXXXXXXXXXXXXXXXXX', 'security', 'reCAPTCHA Site Key'),
('recaptcha_secret_key', '6LcXXXXXXXXXXXXXXXXXXXX', 'security', 'reCAPTCHA Secret Key');

-- Thêm dữ liệu cho bảng testimonials
INSERT INTO testimonials (client_name, client_position, client_company, content, rating, is_featured) VALUES
('Nguyễn Văn Anh', 'CEO', 'Công ty ABC', 'ApecTech đã giúp chúng tôi xây dựng một hệ thống AI tuyệt vời, giúp tăng hiệu quả kinh doanh lên 30%.', 5, true),
('Trần Thị Bình', 'CTO', 'Tập đoàn XYZ', 'Giải pháp bảo mật của GuardCam đã giúp chúng tôi bảo vệ dữ liệu một cách toàn diện và hiệu quả.', 5, true),
('Lê Văn Cường', 'Marketing Director', 'Công ty DEF', 'EmoCommerce đã giúp chúng tôi hiểu rõ hơn về cảm xúc của khách hàng, từ đó cải thiện trải nghiệm mua sắm.', 4, true),
('Phạm Thị Dung', 'COO', 'Tập đoàn GHI', 'TimeLoop giúp chúng tôi tối ưu hóa quy trình làm việc, tiết kiệm thời gian và tăng năng suất.', 5, false),
('Hoàng Văn Em', 'CFO', 'Công ty JKL', 'ApecNeuroOS đã giúp chúng tôi tự động hóa nhiều quy trình, giảm chi phí vận hành đáng kể.', 4, false),
('Vũ Thị Giang', 'HR Director', 'Tập đoàn MNO', 'Dịch vụ tư vấn của ApecGlobal đã giúp chúng tôi xây dựng chiến lược chuyển đổi số hiệu quả.', 5, false);

-- Thêm dữ liệu cho bảng job_applications
INSERT INTO job_applications (job_id, applicant_name, applicant_email, applicant_phone, resume_url, cover_letter, status) VALUES
(1, 'Ứng viên A', 'ungviena@example.com', '0912345678', '/resumes/ungviena-resume.pdf', 'Tôi có 5 năm kinh nghiệm trong lĩnh vực AI và Machine Learning...', 'reviewing'),
(1, 'Ứng viên B', 'ungvienb@example.com', '0923456789', '/resumes/ungvienb-resume.pdf', 'Tôi đã làm việc với các công nghệ AI tiên tiến như TensorFlow, PyTorch...', 'new'),
(2, 'Ứng viên C', 'ungvienc@example.com', '0934567890', '/resumes/ungvienc-resume.pdf', 'Tôi có kinh nghiệm phát triển web/mobile với React, Node.js...', 'interview'),
(3, 'Ứng viên D', 'ungviend@example.com', '0945678901', '/resumes/ungviend-resume.pdf', 'Tôi có portfolio với nhiều dự án UX/UI ấn tượng...', 'new'),
(4, 'Ứng viên E', 'ungviene@example.com', '0956789012', '/resumes/ungviene-resume.pdf', 'Tôi có kinh nghiệm phân tích dữ liệu lớn và xây dựng mô hình dự đoán...', 'reviewing'),
(5, 'Ứng viên F', 'ungvienf@example.com', '0967890123', '/resumes/ungvienf-resume.pdf', 'Tôi có kinh nghiệm với Docker, Kubernetes và AWS...', 'new'),
(6, 'Ứng viên G', 'ungvieng@example.com', '0978901234', '/resumes/ungvieng-resume.pdf', 'Tôi có kinh nghiệm quản lý sản phẩm và làm việc với Agile/Scrum...', 'interview');

-- Thêm dữ liệu cho bảng service_requests
INSERT INTO service_requests (service_id, client_name, client_email, client_phone, client_company, requirements, budget, timeline, status, assigned_to) VALUES
(1, 'Khách hàng A', 'khachhanga@example.com', '0912345678', 'Công ty A', 'Chúng tôi cần một hệ thống AI để phân tích dữ liệu khách hàng...', '50,000 - 100,000 USD', '6 tháng', 'processing', 1),
(2, 'Khách hàng B', 'khachhangb@example.com', '0923456789', 'Công ty B', 'Chúng tôi cần một hệ thống bảo mật cho văn phòng mới...', '30,000 - 50,000 USD', '3 tháng', 'new', NULL),
(3, 'Khách hàng C', 'khachhangc@example.com', '0934567890', 'Công ty C', 'Chúng tôi muốn xây dựng một nền tảng thương mại điện tử...', '40,000 - 70,000 USD', '4 tháng', 'processing', 10),
(4, 'Khách hàng D', 'khachhangd@example.com', '0945678901', 'Công ty D', 'Chúng tôi cần một hệ thống phân tích dữ liệu kinh doanh...', '20,000 - 40,000 USD', '2 tháng', 'completed', 13),
(5, 'Khách hàng E', 'khachhange@example.com', '0956789012', 'Công ty E', 'Chúng tôi muốn triển khai hệ điều hành doanh nghiệp...', '80,000 - 120,000 USD', '8 tháng', 'new', NULL);