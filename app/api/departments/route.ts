import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET all departments (they now belong to parent company)
export async function GET(request: NextRequest) {
  try {
    const result = await query(`
      SELECT d.*, 
        (SELECT COUNT(*) FROM employees WHERE department_id = d.id) as employee_count
      FROM departments d 
      ORDER BY d.name
    `);
    
    return NextResponse.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching departments:', error);
    return NextResponse.json({ error: 'Failed to fetch departments' }, { status: 500 });
  }
}

// POST create new department (belongs to parent company)
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    const result = await query(`
      INSERT INTO departments (name, description, manager_name)
      VALUES ($1, $2, $3)
      RETURNING *
    `, [
      data.name,
      data.description || '',
      data.manager_name || ''
    ]);
    
    return NextResponse.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating department:', error);
    return NextResponse.json({ error: 'Failed to create department' }, { status: 500 });
  }
}