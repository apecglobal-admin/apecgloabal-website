-- Create project_members table
CREATE TABLE IF NOT EXISTS project_members (
  id SERIAL PRIMARY KEY,
  project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  employee_id INTEGER NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  role VARCHAR(100) NOT NULL,
  join_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  hourly_rate DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(project_id, employee_id)
);

-- Create project_tasks table
CREATE TABLE IF NOT EXISTS project_tasks (
  id SERIAL PRIMARY KEY,
  project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  assignee_id INTEGER REFERENCES employees(id) ON DELETE SET NULL,
  status VARCHAR(50) DEFAULT 'todo',
  priority VARCHAR(50) DEFAULT 'medium',
  due_date TIMESTAMP,
  estimated_hours INTEGER DEFAULT 0,
  actual_hours INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create project_milestones table
CREATE TABLE IF NOT EXISTS project_milestones (
  id SERIAL PRIMARY KEY,
  project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  due_date TIMESTAMP NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  completion_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_project_members_project_id ON project_members(project_id);
CREATE INDEX IF NOT EXISTS idx_project_members_employee_id ON project_members(employee_id);
CREATE INDEX IF NOT EXISTS idx_project_tasks_project_id ON project_tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_project_tasks_assignee_id ON project_tasks(assignee_id);
CREATE INDEX IF NOT EXISTS idx_project_milestones_project_id ON project_milestones(project_id);

-- Add some sample data for testing
INSERT INTO project_members (project_id, employee_id, role, hourly_rate) VALUES
(1, 1, 'Project Manager', 500000),
(1, 2, 'Developer', 400000),
(2, 3, 'Lead Developer', 450000)
ON CONFLICT (project_id, employee_id) DO NOTHING;

INSERT INTO project_tasks (project_id, name, description, assignee_id, status, priority, due_date, estimated_hours) VALUES
(1, 'Thiết kế giao diện', 'Thiết kế UI/UX cho trang chủ', 2, 'in_progress', 'high', '2024-02-15', 40),
(1, 'Phát triển backend', 'Xây dựng API và database', 1, 'todo', 'high', '2024-02-20', 60),
(2, 'Tích hợp thanh toán', 'Tích hợp cổng thanh toán online', 3, 'todo', 'medium', '2024-02-25', 30)
ON CONFLICT DO NOTHING;

INSERT INTO project_milestones (project_id, name, description, due_date, status) VALUES
(1, 'Hoàn thành thiết kế', 'Hoàn thành tất cả mockup và wireframe', '2024-02-10', 'completed'),
(1, 'Alpha version', 'Phiên bản alpha đầu tiên', '2024-02-28', 'in_progress'),
(2, 'Beta testing', 'Bắt đầu giai đoạn beta testing', '2024-03-15', 'pending')
ON CONFLICT DO NOTHING;