import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('company_id');
    
    if (!companyId) {
      return NextResponse.json({ error: 'Company ID is required' }, { status: 400 });
    }
    
    // Get company stats
    const stats = await Promise.all([
      // Projects count
      query('SELECT COUNT(*) as count FROM projects WHERE company_id = $1', [companyId]),
      // Services count
      query('SELECT COUNT(*) as count FROM services WHERE company_id = $1', [companyId]),
      // Departments count - count departments that have employees in this company
      query('SELECT COUNT(DISTINCT department_id) as count FROM employees WHERE company_id = $1 AND department_id IS NOT NULL', [companyId]),
      // Employees count
      query('SELECT COUNT(*) as count FROM employees WHERE company_id = $1', [companyId]),
      // Jobs count
      query('SELECT COUNT(*) as count FROM jobs WHERE company_id = $1', [companyId]),
    ]);
    
    return NextResponse.json({
      success: true,
      stats: {
        projects_count: parseInt(stats[0].rows[0].count) || 0,
        services_count: parseInt(stats[1].rows[0].count) || 0,
        departments_count: parseInt(stats[2].rows[0].count) || 0,
        employees_count: parseInt(stats[3].rows[0].count) || 0,
        jobs_count: parseInt(stats[4].rows[0].count) || 0,
      }
    });
  } catch (error) {
    console.error('Error getting company stats:', error);
    return NextResponse.json({ error: 'Failed to get company stats' }, { status: 500 });
  }
}

// Update company stats
export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('company_id');
    
    if (!companyId) {
      return NextResponse.json({ error: 'Company ID is required' }, { status: 400 });
    }
    
    // Get updated stats
    const statsResponse = await GET(request);
    const statsData = await statsResponse.json();
    
    if (!statsData.success) {
      throw new Error('Failed to get stats');
    }
    
    // Update company record with new stats
    const updateResult = await query(`
      UPDATE companies 
      SET 
        projects_count = $1,
        services_count = $2,
        departments_count = $3,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
      RETURNING *
    `, [
      statsData.stats.projects_count,
      statsData.stats.services_count,
      statsData.stats.departments_count,
      companyId
    ]);
    
    if (updateResult.rows.length === 0) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Company stats updated successfully',
      stats: statsData.stats
    });
  } catch (error) {
    console.error('Error updating company stats:', error);
    return NextResponse.json({ error: 'Failed to update company stats' }, { status: 500 });
  }
}