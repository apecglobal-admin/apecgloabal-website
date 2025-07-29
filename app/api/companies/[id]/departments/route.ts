import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const companyId = params.id;
    
    const result = await query(`
      SELECT d.*, 
        (SELECT COUNT(*) FROM employees WHERE department_id = d.id) as employee_count
      FROM departments d 
      WHERE d.company_id = $1 
      ORDER BY d.name
    `, [companyId]);
    
    return NextResponse.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching company departments:', error);
    return NextResponse.json({ error: 'Failed to fetch departments' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const companyId = params.id;
    const data = await request.json();
    
    const result = await query(`
      INSERT INTO departments (name, company_id, description, manager_name)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [
      data.name,
      companyId,
      data.description,
      data.manager_name
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