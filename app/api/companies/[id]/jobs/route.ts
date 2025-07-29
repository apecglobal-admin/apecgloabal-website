import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const companyId = params.id;
    
    const result = await query(`
      SELECT j.*, d.name as department_name, c.name as company_name
      FROM jobs j
      LEFT JOIN departments d ON j.department_id = d.id
      LEFT JOIN companies c ON j.company_id = c.id
      WHERE j.company_id = $1 
      ORDER BY j.urgent DESC, j.created_at DESC
    `, [companyId]);
    
    return NextResponse.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching company jobs:', error);
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
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
      INSERT INTO jobs (
        title, company_id, department_id, location, type, 
        experience_required, salary_range, description, 
        requirements, benefits, skills, status, urgent, remote_ok
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *
    `, [
      data.title,
      companyId,
      data.department_id,
      data.location,
      data.type,
      data.experience_required,
      data.salary_range,
      data.description,
      data.requirements || [],
      data.benefits || [],
      data.skills || [],
      data.status || 'active',
      data.urgent || false,
      data.remote_ok || false
    ]);
    
    return NextResponse.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json({ error: 'Failed to create job' }, { status: 500 });
  }
}