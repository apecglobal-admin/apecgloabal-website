-- Thêm dữ liệu người dùng
INSERT INTO users (username, email, password_hash, role, employee_id, last_login, is_active) VALUES
-- Admin users
('admin', 'admin@apecglobal.com', '$2a$10$XDCGQOWAGu7dHOEfQX8zfO2Q2Ea4XZ3f5hK6Q3XD3QjupRJZx7wMK', 'admin', NULL, CURRENT_TIMESTAMP, true),
('tranvanq', 'tranvanq@apecglobal.com', '$2a$10$XDCGQOWAGu7dHOEfQX8zfO2Q2Ea4XZ3f5hK6Q3XD3QjupRJZx7wMK', 'admin', 19, CURRENT_TIMESTAMP, true),

-- Manager users
('nguyenvana', 'nguyenvana@apectech.com', '$2a$10$XDCGQOWAGu7dHOEfQX8zfO2Q2Ea4XZ3f5hK6Q3XD3QjupRJZx7wMK', 'manager', 1, CURRENT_TIMESTAMP, true),
('tranthib', 'tranthib@apectech.com', '$2a$10$XDCGQOWAGu7dHOEfQX8zfO2Q2Ea4XZ3f5hK6Q3XD3QjupRJZx7wMK', 'manager', 4, CURRENT_TIMESTAMP, true),
('phamthid', 'phamthid@guardcam.com', '$2a$10$XDCGQOWAGu7dHOEfQX8zfO2Q2Ea4XZ3f5hK6Q3XD3QjupRJZx7wMK', 'manager', 7, CURRENT_TIMESTAMP, true),
('dangvang', 'dangvang@emocommerce.com', '$2a$10$XDCGQOWAGu7dHOEfQX8zfO2Q2Ea4XZ3f5hK6Q3XD3QjupRJZx7wMK', 'manager', 10, CURRENT_TIMESTAMP, true),
('lythik', 'lythik@timeloop.com', '$2a$10$XDCGQOWAGu7dHOEfQX8zfO2Q2Ea4XZ3f5hK6Q3XD3QjupRJZx7wMK', 'manager', 13, CURRENT_TIMESTAMP, true),
('phanvann', 'phanvann@apecneuroos.com', '$2a$10$XDCGQOWAGu7dHOEfQX8zfO2Q2Ea4XZ3f5hK6Q3XD3QjupRJZx7wMK', 'manager', 16, CURRENT_TIMESTAMP, true),
('lethir', 'lethir@apecglobal.com', '$2a$10$XDCGQOWAGu7dHOEfQX8zfO2Q2Ea4XZ3f5hK6Q3XD3QjupRJZx7wMK', 'manager', 20, CURRENT_TIMESTAMP, true),
('nguyenvans', 'nguyenvans@apecglobal.com', '$2a$10$XDCGQOWAGu7dHOEfQX8zfO2Q2Ea4XZ3f5hK6Q3XD3QjupRJZx7wMK', 'manager', 21, CURRENT_TIMESTAMP, true),
('phamthit', 'phamthit@apecglobal.com', '$2a$10$XDCGQOWAGu7dHOEfQX8zfO2Q2Ea4XZ3f5hK6Q3XD3QjupRJZx7wMK', 'manager', 22, CURRENT_TIMESTAMP, true),
('hoangvanu', 'hoangvanu@apecglobal.com', '$2a$10$XDCGQOWAGu7dHOEfQX8zfO2Q2Ea4XZ3f5hK6Q3XD3QjupRJZx7wMK', 'manager', 23, CURRENT_TIMESTAMP, true),
('vuthiv', 'vuthiv@apecglobal.com', '$2a$10$XDCGQOWAGu7dHOEfQX8zfO2Q2Ea4XZ3f5hK6Q3XD3QjupRJZx7wMK', 'manager', 24, CURRENT_TIMESTAMP, true),

-- Regular users
('tranthibinh', 'tranthibinh@apectech.com', '$2a$10$XDCGQOWAGu7dHOEfQX8zfO2Q2Ea4XZ3f5hK6Q3XD3QjupRJZx7wMK', 'user', 2, CURRENT_TIMESTAMP, true),
('levancuong', 'levancuong@apectech.com', '$2a$10$XDCGQOWAGu7dHOEfQX8zfO2Q2Ea4XZ3f5hK6Q3XD3QjupRJZx7wMK', 'user', 3, CURRENT_TIMESTAMP, true),
('phamvandung', 'phamvandung@apectech.com', '$2a$10$XDCGQOWAGu7dHOEfQX8zfO2Q2Ea4XZ3f5hK6Q3XD3QjupRJZx7wMK', 'user', 5, CURRENT_TIMESTAMP, true),
('hoangthiem', 'hoangthiem@apectech.com', '$2a$10$XDCGQOWAGu7dHOEfQX8zfO2Q2Ea4XZ3f5hK6Q3XD3QjupRJZx7wMK', 'user', 6, CURRENT_TIMESTAMP, true),
('vuvangiang', 'vuvangiang@guardcam.com', '$2a$10$XDCGQOWAGu7dHOEfQX8zfO2Q2Ea4XZ3f5hK6Q3XD3QjupRJZx7wMK', 'user', 8, CURRENT_TIMESTAMP, true),
('ngothihuong', 'ngothihuong@guardcam.com', '$2a$10$XDCGQOWAGu7dHOEfQX8zfO2Q2Ea4XZ3f5hK6Q3XD3QjupRJZx7wMK', 'user', 9, CURRENT_TIMESTAMP, true),
('lythikhanh', 'lythikhanh@emocommerce.com', '$2a$10$XDCGQOWAGu7dHOEfQX8zfO2Q2Ea4XZ3f5hK6Q3XD3QjupRJZx7wMK', 'user', 11, CURRENT_TIMESTAMP, true),
('truongvanlam', 'truongvanlam@emocommerce.com', '$2a$10$XDCGQOWAGu7dHOEfQX8zfO2Q2Ea4XZ3f5hK6Q3XD3QjupRJZx7wMK', 'user', 12, CURRENT_TIMESTAMP, true),
('maivannghia', 'maivannghia@timeloop.com', '$2a$10$XDCGQOWAGu7dHOEfQX8zfO2Q2Ea4XZ3f5hK6Q3XD3QjupRJZx7wMK', 'user', 14, CURRENT_TIMESTAMP, true),
('dothioanh', 'dothioanh@timeloop.com', '$2a$10$XDCGQOWAGu7dHOEfQX8zfO2Q2Ea4XZ3f5hK6Q3XD3QjupRJZx7wMK', 'user', 15, CURRENT_TIMESTAMP, true),
('huynhthiphuong', 'huynhthiphuong@apecneuroos.com', '$2a$10$XDCGQOWAGu7dHOEfQX8zfO2Q2Ea4XZ3f5hK6Q3XD3QjupRJZx7wMK', 'user', 17, CURRENT_TIMESTAMP, true),
('quachvanquan', 'quachvanquan@apecneuroos.com', '$2a$10$XDCGQOWAGu7dHOEfQX8zfO2Q2Ea4XZ3f5hK6Q3XD3QjupRJZx7wMK', 'user', 18, CURRENT_TIMESTAMP, true);