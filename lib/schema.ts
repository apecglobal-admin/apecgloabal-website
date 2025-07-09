// Định nghĩa các interface cho dữ liệu từ database

export interface Company {
  id: number;
  name: string;
  slug: string;
  description: string;
  logo_url: string;
  website_url: string;
  email: string;
  phone: string;
  address: string;
  established_date: Date;
  employee_count: number;
  industry: string;
  status: string;
  image_url?: string;
  image_public_id?: string;
  gallery?: string[];
  gallery_public_ids?: string[];
  image_url?: string;
  image_public_id?: string;
  gallery?: string[];
  gallery_public_ids?: string[];
  created_at: Date;
  updated_at: Date;
}

export interface Department {
  id: number;
  name: string;
  company_id: number;
  description: string;
  manager_name: string;
  employee_count: number;
  created_at: Date;
}

export interface Employee {
  id: number;
  name: string;
  email: string;
  phone: string;
  position: string;
  department_id: number;
  company_id: number;
  join_date: Date;
  status: string;
  avatar_url: string;
  salary: number;
  manager_id: number;
  created_at: Date;
  updated_at: Date;
}

export interface Project {
  id: number;
  name: string;
  slug: string;
  description: string;
  company_id: number;
  manager_id: number;
  status: string;
  priority: string;
  progress: number;
  start_date: Date;
  end_date: Date;
  budget: number;
  spent: number;
  team_size: number;
  technologies: string[];
  image_url?: string;
  gallery?: string[];
  features?: string[];
  challenges?: string[];
  solutions?: string[];
  results?: string[];
  testimonials?: {
    name: string;
    position: string;
    company: string;
    content: string;
    avatar?: string;
  }[];
  created_at: Date;
  updated_at: Date;
}

export interface Report {
  id: number;
  title: string;
  type: string;
  department_id: number;
  created_by: number;
  status: string;
  file_size: string;
  file_url: string;
  download_count: number;
  description: string;
  created_at: Date;
  updated_at: Date;
}

export interface Document {
  id: number;
  name: string;
  file_type: string;
  file_size: string;
  file_url: string;
  file_public_id?: string;
  file_public_id?: string;
  category: string;
  uploaded_by: number;
  download_count: number;
  description: string;
  folder_path: string;
  is_public: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface News {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author_id: number;
  featured: boolean;
  published: boolean;
  view_count: number;
  image_url: string;
  tags: string[];
  published_at: Date;
  created_at: Date;
  updated_at: Date;
}

export interface Job {
  id: number;
  title: string;
  company_id: number;
  department_id: number;
  location: string;
  type: string;
  experience_required: string;
  salary_range: string;
  description: string;
  requirements: string[];
  benefits: string[];
  skills: string[];
  status: string;
  urgent: boolean;
  remote_ok: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Service {
  id: number;
  title: string;
  company_id: number;
  description: string;
  features: string[];
  icon: string;
  category: string;
  price_range: string;
  is_featured: boolean;
  created_at: Date;
}

export interface User {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  role: string;
  employee_id: number;
  last_login: Date;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}