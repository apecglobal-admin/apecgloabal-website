-- Thêm dữ liệu nhân viên
INSERT INTO employees (name, email, phone, position, department_id, company_id, join_date, status, avatar_url, salary) VALUES
-- ApecTech - AI Research (department_id = 1)
('Nguyễn Văn A', 'nguyenvana@apectech.com', '+84 912 345 678', 'Research Director', 1, 1, '2021-03-15', 'active', '/images/avatars/nguyen-van-a.jpg', 5000),
('Trần Thị Bình', 'tranthibinh@apectech.com', '+84 913 456 789', 'Senior AI Researcher', 1, 1, '2021-04-10', 'active', '/images/avatars/tran-thi-binh.jpg', 3500),
('Lê Văn Cường', 'levancuong@apectech.com', '+84 914 567 890', 'AI Engineer', 1, 1, '2021-05-20', 'active', '/images/avatars/le-van-cuong.jpg', 2800),

-- ApecTech - Education Technology (department_id = 2)
('Trần Thị B', 'tranthib@apectech.com', '+84 915 678 901', 'EdTech Director', 2, 1, '2021-03-20', 'active', '/images/avatars/tran-thi-b.jpg', 4800),
('Phạm Văn Dũng', 'phamvandung@apectech.com', '+84 916 789 012', 'Senior EdTech Developer', 2, 1, '2021-04-15', 'active', '/images/avatars/pham-van-dung.jpg', 3200),
('Hoàng Thị Em', 'hoangthiem@apectech.com', '+84 917 890 123', 'UX Designer', 2, 1, '2021-06-01', 'active', '/images/avatars/hoang-thi-em.jpg', 2500),

-- GuardCam - Security Systems (department_id = 4)
('Phạm Thị D', 'phamthid@guardcam.com', '+84 918 901 234', 'Security Director', 4, 2, '2022-05-20', 'active', '/images/avatars/pham-thi-d.jpg', 4500),
('Vũ Văn Giang', 'vuvangiang@guardcam.com', '+84 919 012 345', 'Security Architect', 4, 2, '2022-06-15', 'active', '/images/avatars/vu-van-giang.jpg', 3300),
('Ngô Thị Hương', 'ngothihuong@guardcam.com', '+84 920 123 456', 'Security Analyst', 4, 2, '2022-07-10', 'active', '/images/avatars/ngo-thi-huong.jpg', 2700),

-- EmoCommerce - Emotion Analytics (department_id = 7)
('Đặng Văn G', 'dangvang@emocommerce.com', '+84 921 234 567', 'Analytics Director', 7, 3, '2023-01-10', 'active', '/images/avatars/dang-van-g.jpg', 4200),
('Lý Thị Khánh', 'lythikhanh@emocommerce.com', '+84 922 345 678', 'Data Scientist', 7, 3, '2023-02-15', 'active', '/images/avatars/ly-thi-khanh.jpg', 3100),
('Trương Văn Lâm', 'truongvanlam@emocommerce.com', '+84 923 456 789', 'ML Engineer', 7, 3, '2023-03-20', 'active', '/images/avatars/truong-van-lam.jpg', 2900),

-- TimeLoop - Behavioral Analytics (department_id = 10)
('Lý Thị K', 'lythik@timeloop.com', '+84 924 567 890', 'Behavioral Director', 10, 4, '2023-07-05', 'active', '/images/avatars/ly-thi-k.jpg', 4000),
('Mai Văn Nghĩa', 'maivannghia@timeloop.com', '+84 925 678 901', 'Senior Analyst', 10, 4, '2023-08-10', 'active', '/images/avatars/mai-van-nghia.jpg', 3000),
('Đỗ Thị Oanh', 'dothioanh@timeloop.com', '+84 926 789 012', 'Data Engineer', 10, 4, '2023-09-15', 'active', '/images/avatars/do-thi-oanh.jpg', 2600),

-- ApecNeuroOS - Enterprise OS (department_id = 13)
('Phan Văn N', 'phanvann@apecneuroos.com', '+84 927 890 123', 'OS Director', 13, 5, '2024-01-15', 'active', '/images/avatars/phan-van-n.jpg', 4700),
('Huỳnh Thị Phương', 'huynhthiphuong@apecneuroos.com', '+84 928 901 234', 'System Architect', 13, 5, '2024-02-20', 'active', '/images/avatars/huynh-thi-phuong.jpg', 3400),
('Quách Văn Quân', 'quachvanquan@apecneuroos.com', '+84 929 012 345', 'DevOps Engineer', 13, 5, '2024-03-25', 'active', '/images/avatars/quach-van-quan.jpg', 3100),

-- ApecGlobal - Executive (department_id = 16)
('Trần Văn Q', 'tranvanq@apecglobal.com', '+84 930 123 456', 'CEO', 16, 6, '2020-10-01', 'active', '/images/avatars/tran-van-q.jpg', 8000),
('Lê Thị R', 'lethir@apecglobal.com', '+84 931 234 567', 'HR Director', 17, 6, '2020-10-15', 'active', '/images/avatars/le-thi-r.jpg', 5500),
('Nguyễn Văn S', 'nguyenvans@apecglobal.com', '+84 932 345 678', 'CFO', 18, 6, '2020-11-01', 'active', '/images/avatars/nguyen-van-s.jpg', 7000),
('Phạm Thị T', 'phamthit@apecglobal.com', '+84 933 456 789', 'Marketing Director', 19, 6, '2020-11-15', 'active', '/images/avatars/pham-thi-t.jpg', 5200),
('Hoàng Văn U', 'hoangvanu@apecglobal.com', '+84 934 567 890', 'CTO', 20, 6, '2020-12-01', 'active', '/images/avatars/hoang-van-u.jpg', 7500),
('Vũ Thị V', 'vuthiv@apecglobal.com', '+84 935 678 901', 'Sales Director', 21, 6, '2020-12-15', 'active', '/images/avatars/vu-thi-v.jpg', 5000);