import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET all subsidiary companies (non-parent companies)
export async function GET(request: NextRequest) {
  try {
    const result = await query(`
      SELECT c.*, 
        (SELECT COUNT(*) FROM employees WHERE company_id = c.id) as employee_count,
        (SELECT COUNT(*) FROM projects WHERE company_id = c.id) as projects_count,
        (SELECT COUNT(*) FROM services WHERE company_id = c.id) as services_count,
        (SELECT COUNT(*) FROM jobs WHERE company_id = c.id) as jobs_count,
        (SELECT COUNT(DISTINCT department_id) FROM employees WHERE company_id = c.id AND department_id IS NOT NULL) as departments_count
      FROM companies c 
      WHERE is_parent_company = false 
      ORDER BY display_order, name
    `);
    
    return NextResponse.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching subsidiary companies:', error);
    return NextResponse.json({ error: 'Failed to fetch subsidiary companies' }, { status: 500 });
  }
}