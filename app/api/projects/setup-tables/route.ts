import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    // Create project_members table
    await query(`
      CREATE TABLE IF NOT EXISTS project_members (
        id SERIAL PRIMARY KEY,
        project_id INTEGER NOT NULL,
        employee_id INTEGER NOT NULL,
        role VARCHAR(100) NOT NULL,
        join_date DATE DEFAULT CURRENT_DATE,
        hourly_rate DECIMAL(10,2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(project_id, employee_id)
      )
    `)

    // Create project_tasks table
    await query(`
      CREATE TABLE IF NOT EXISTS project_tasks (
        id SERIAL PRIMARY KEY,
        project_id INTEGER NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        assignee_id INTEGER,
        status VARCHAR(50) DEFAULT 'pending',
        priority VARCHAR(20) DEFAULT 'medium',
        due_date DATE,
        estimated_hours DECIMAL(8,2) DEFAULT 0,
        actual_hours DECIMAL(8,2) DEFAULT 0,
        completed_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Create project_milestones table
    await query(`
      CREATE TABLE IF NOT EXISTS project_milestones (
        id SERIAL PRIMARY KEY,
        project_id INTEGER NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        due_date DATE NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        completed_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Create indexes for better performance
    await query(`
      CREATE INDEX IF NOT EXISTS idx_project_members_project_id ON project_members(project_id)
    `)
    
    await query(`
      CREATE INDEX IF NOT EXISTS idx_project_tasks_project_id ON project_tasks(project_id)
    `)
    
    await query(`
      CREATE INDEX IF NOT EXISTS idx_project_milestones_project_id ON project_milestones(project_id)
    `)

    // Insert sample data for testing
    const sampleProjectId = 1

    // Sample project members
    await query(`
      INSERT INTO project_members (project_id, employee_id, role, join_date, hourly_rate)
      VALUES 
        ($1, 1, 'Project Manager', '2024-01-01', 50.00),
        ($1, 2, 'Frontend Developer', '2024-01-15', 40.00),
        ($1, 3, 'Backend Developer', '2024-01-15', 45.00)
      ON CONFLICT (project_id, employee_id) DO NOTHING
    `, [sampleProjectId])

    // Sample project tasks
    await query(`
      INSERT INTO project_tasks (project_id, name, description, assignee_id, status, priority, due_date)
      VALUES 
        ($1, 'Thiết kế giao diện', 'Thiết kế UI/UX cho trang chủ', 2, 'in_progress', 'high', '2024-12-31'),
        ($1, 'Phát triển API', 'Xây dựng REST API cho backend', 3, 'pending', 'high', '2024-12-25'),
        ($1, 'Testing', 'Kiểm thử tính năng đăng nhập', 1, 'pending', 'medium', '2024-12-28')
      ON CONFLICT DO NOTHING
    `, [sampleProjectId])

    // Sample project milestones
    await query(`
      INSERT INTO project_milestones (project_id, name, description, due_date, status)
      VALUES 
        ($1, 'Hoàn thành thiết kế', 'Hoàn thành toàn bộ thiết kế UI/UX', '2024-12-20', 'pending'),
        ($1, 'Alpha Release', 'Phiên bản Alpha đầu tiên', '2024-12-31', 'pending'),
        ($1, 'Beta Release', 'Phiên bản Beta để test', '2025-01-15', 'pending')
      ON CONFLICT DO NOTHING
    `, [sampleProjectId])

    return NextResponse.json({
      success: true,
      message: 'Project tables created successfully with sample data'
    })

  } catch (error) {
    console.error('Error setting up project tables:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to setup project tables',
      details: error
    }, { status: 500 })
  }
}