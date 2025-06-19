-- Thêm dữ liệu việc làm
INSERT INTO jobs (title, company_id, department_id, location, type, experience_required, salary_range, description, requirements, benefits, skills, status, urgent, remote_ok) VALUES
('Senior AI Engineer', 1, 1, 'Hà Nội', 'full-time', '3-5 năm', '3,000 - 5,000 USD', 'Chúng tôi đang tìm kiếm một Senior AI Engineer để tham gia vào đội ngũ phát triển các giải pháp AI tiên tiến. Bạn sẽ làm việc với các công nghệ machine learning và deep learning mới nhất để xây dựng các sản phẩm AI sáng tạo.', 
ARRAY['Kinh nghiệm 3-5 năm trong lĩnh vực AI/ML', 'Thành thạo Python và các framework ML như TensorFlow, PyTorch', 'Hiểu biết sâu về các thuật toán machine learning và deep learning', 'Kinh nghiệm triển khai các mô hình ML trong môi trường production'], 
ARRAY['Mức lương cạnh tranh', 'Thưởng dự án và thưởng cuối năm', 'Bảo hiểm sức khỏe cao cấp', 'Chế độ nghỉ phép linh hoạt', 'Cơ hội đào tạo và phát triển chuyên môn'], 
ARRAY['Python', 'TensorFlow', 'PyTorch', 'Machine Learning', 'Deep Learning', 'NLP', 'Computer Vision'], 
'active', true, true),

('Full Stack Developer', 2, 2, 'Hà Nội', 'full-time', '2-4 năm', '2,000 - 3,500 USD', 'GuardCam đang tìm kiếm Full Stack Developer tài năng để phát triển các ứng dụng web và mobile cho hệ thống bảo mật thông minh của chúng tôi. Bạn sẽ làm việc với cả frontend và backend để xây dựng các giải pháp end-to-end.', 
ARRAY['Kinh nghiệm 2-4 năm trong phát triển web/mobile', 'Thành thạo JavaScript/TypeScript, React, Node.js', 'Kinh nghiệm với cơ sở dữ liệu SQL và NoSQL', 'Hiểu biết về RESTful API và GraphQL'], 
ARRAY['Mức lương cạnh tranh', 'Làm việc trong môi trường startup năng động', 'Cơ hội học hỏi và phát triển kỹ năng mới', 'Chế độ bảo hiểm và phúc lợi đầy đủ'], 
ARRAY['JavaScript', 'TypeScript', 'React', 'Node.js', 'MongoDB', 'PostgreSQL', 'RESTful API', 'GraphQL'], 
'active', false, true),

('UX/UI Designer', 3, 3, 'Hồ Chí Minh', 'full-time', '2-3 năm', '1,800 - 3,000 USD', 'EmoCommerce đang tìm kiếm UX/UI Designer tài năng để thiết kế trải nghiệm người dùng cho nền tảng thương mại điện tử của chúng tôi. Bạn sẽ làm việc chặt chẽ với đội ngũ product và development để tạo ra những trải nghiệm mua sắm trực tuyến tuyệt vời.', 
ARRAY['Kinh nghiệm 2-3 năm trong thiết kế UX/UI', 'Portfolio ấn tượng với các dự án thực tế', 'Thành thạo Figma, Adobe XD, Sketch', 'Hiểu biết về quy trình thiết kế UX và nghiên cứu người dùng'], 
ARRAY['Môi trường làm việc sáng tạo', 'Cơ hội làm việc với các công nghệ mới nhất', 'Chế độ bảo hiểm sức khỏe toàn diện', 'Các hoạt động team building thường xuyên'], 
ARRAY['UX Design', 'UI Design', 'Figma', 'Adobe XD', 'Sketch', 'Prototyping', 'User Research', 'Responsive Design'], 
'active', true, false),

('Data Scientist', 4, 4, 'Đà Nẵng', 'full-time', '3-5 năm', '2,500 - 4,000 USD', 'TimeLoop đang tìm kiếm Data Scientist để phân tích dữ liệu và xây dựng các mô hình dự đoán cho nền tảng phân tích hiệu suất của chúng tôi. Bạn sẽ làm việc với lượng dữ liệu lớn để tìm ra những insights có giá trị cho khách hàng.', 
ARRAY['Kinh nghiệm 3-5 năm trong lĩnh vực data science', 'Thành thạo Python, R và các thư viện phân tích dữ liệu', 'Kinh nghiệm với big data và các công cụ như Hadoop, Spark', 'Kiến thức vững về thống kê và các thuật toán machine learning'], 
ARRAY['Mức lương hấp dẫn', 'Môi trường làm việc quốc tế', 'Cơ hội đào tạo và tham gia các hội thảo chuyên ngành', 'Chế độ làm việc linh hoạt'], 
ARRAY['Python', 'R', 'SQL', 'Machine Learning', 'Data Visualization', 'Statistical Analysis', 'Big Data', 'Hadoop', 'Spark'], 
'active', false, true),

('DevOps Engineer', 5, 5, 'Hà Nội', 'full-time', '3-6 năm', '3,000 - 4,500 USD', 'ApecNeuroOS đang tìm kiếm DevOps Engineer để xây dựng và quản lý hạ tầng cloud cho hệ điều hành doanh nghiệp của chúng tôi. Bạn sẽ làm việc với các công nghệ container, CI/CD và cloud computing để đảm bảo hệ thống hoạt động ổn định và có khả năng mở rộng.', 
ARRAY['Kinh nghiệm 3-6 năm trong lĩnh vực DevOps', 'Thành thạo Docker, Kubernetes, Jenkins', 'Kinh nghiệm với AWS, Azure hoặc GCP', 'Hiểu biết về Infrastructure as Code (Terraform, Ansible)'], 
ARRAY['Mức lương cạnh tranh hàng đầu thị trường', 'Cơ hội làm việc với các công nghệ cutting-edge', 'Chế độ bảo hiểm sức khỏe cho nhân viên và người thân', 'Chương trình cổ phiếu thưởng'], 
ARRAY['Docker', 'Kubernetes', 'Jenkins', 'AWS', 'Azure', 'GCP', 'Terraform', 'Ansible', 'CI/CD', 'Monitoring'], 
'active', true, false),

('Product Manager', 6, 6, 'Hà Nội', 'full-time', '4-7 năm', '3,500 - 5,500 USD', 'ApecGlobal đang tìm kiếm Product Manager tài năng để dẫn dắt việc phát triển các sản phẩm công nghệ mới. Bạn sẽ làm việc với các đội ngũ kỹ thuật, thiết kế và kinh doanh để xây dựng roadmap sản phẩm và đảm bảo việc triển khai thành công.', 
ARRAY['Kinh nghiệm 4-7 năm trong quản lý sản phẩm công nghệ', 'Kinh nghiệm làm việc với các phương pháp Agile/Scrum', 'Kỹ năng phân tích dữ liệu và ra quyết định dựa trên dữ liệu', 'Khả năng giao tiếp và thuyết trình xuất sắc'], 
ARRAY['Mức lương và thưởng hấp dẫn', 'Cơ hội làm việc với các công nghệ tiên tiến', 'Chương trình đào tạo và phát triển lãnh đạo', 'Môi trường làm việc quốc tế'], 
ARRAY['Product Management', 'Agile', 'Scrum', 'Data Analysis', 'User Stories', 'Product Roadmap', 'Market Research', 'Stakeholder Management'], 
'active', false, true);