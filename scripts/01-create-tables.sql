-- Create companies table
CREATE TABLE IF NOT EXISTS companies (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  logo_url VARCHAR(500),
  website_url VARCHAR(500),
  email VARCHAR(255),
  phone VARCHAR(50),
  address TEXT,
  established_date DATE,
  employee_count INTEGER DEFAULT 0,
  industry VARCHAR(255),
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create departments table
CREATE TABLE IF NOT EXISTS departments (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  company_id INTEGER REFERENCES companies(id),
  description TEXT,
  manager_name VARCHAR(255),
  employee_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create employees table
CREATE TABLE IF NOT EXISTS employees (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50),
  position VARCHAR(255),
  department_id INTEGER REFERENCES departments(id),
  company_id INTEGER REFERENCES companies(id),
  join_date DATE,
  status VARCHAR(50) DEFAULT 'active',
  avatar_url VARCHAR(500),
  salary DECIMAL(12,2),
  manager_id INTEGER REFERENCES employees(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  company_id INTEGER REFERENCES companies(id),
  manager_id INTEGER REFERENCES employees(id),
  status VARCHAR(100) DEFAULT 'planning',
  priority VARCHAR(50) DEFAULT 'medium',
  progress INTEGER DEFAULT 0,
  start_date DATE,
  end_date DATE,
  budget DECIMAL(15,2),
  spent DECIMAL(15,2) DEFAULT 0,
  team_size INTEGER DEFAULT 0,
  technologies TEXT[], -- Array of technologies
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create reports table
CREATE TABLE IF NOT EXISTS reports (
  id SERIAL PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  type VARCHAR(100) NOT NULL,
  department_id INTEGER REFERENCES departments(id),
  created_by INTEGER REFERENCES employees(id),
  status VARCHAR(50) DEFAULT 'draft',
  file_size VARCHAR(50),
  file_url VARCHAR(500),
  download_count INTEGER DEFAULT 0,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
  id SERIAL PRIMARY KEY,
  name VARCHAR(500) NOT NULL,
  file_type VARCHAR(50),
  file_size VARCHAR(50),
  file_url VARCHAR(500),
  category VARCHAR(100),
  uploaded_by INTEGER REFERENCES employees(id),
  download_count INTEGER DEFAULT 0,
  description TEXT,
  folder_path VARCHAR(500),
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create news table
CREATE TABLE IF NOT EXISTS news (
  id SERIAL PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  excerpt TEXT,
  content TEXT,
  category VARCHAR(100),
  author_id INTEGER REFERENCES employees(id),
  featured BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  image_url VARCHAR(500),
  tags TEXT[],
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  company_id INTEGER REFERENCES companies(id),
  department_id INTEGER REFERENCES departments(id),
  location VARCHAR(255),
  type VARCHAR(50) DEFAULT 'full-time',
  experience_required VARCHAR(100),
  salary_range VARCHAR(100),
  description TEXT,
  requirements TEXT[],
  benefits TEXT[],
  skills TEXT[],
  status VARCHAR(50) DEFAULT 'active',
  urgent BOOLEAN DEFAULT false,
  remote_ok BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create services table
CREATE TABLE IF NOT EXISTS services (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  company_id INTEGER REFERENCES companies(id),
  description TEXT,
  features TEXT[],
  icon VARCHAR(100),
  category VARCHAR(100),
  price_range VARCHAR(100),
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create users table for internal login
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  employee_id INTEGER REFERENCES employees(id),
  last_login TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_employees_company ON employees(company_id);
CREATE INDEX IF NOT EXISTS idx_employees_department ON employees(department_id);
CREATE INDEX IF NOT EXISTS idx_projects_company ON projects(company_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_reports_type ON reports(type);
CREATE INDEX IF NOT EXISTS idx_documents_category ON documents(category);
CREATE INDEX IF NOT EXISTS idx_news_category ON news(category);
CREATE INDEX IF NOT EXISTS idx_news_published ON news(published);
CREATE INDEX IF NOT EXISTS idx_jobs_company ON jobs(company_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
