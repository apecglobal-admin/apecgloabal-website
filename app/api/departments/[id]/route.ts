import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const departmentId = parseInt(params.id)

    if (isNaN(departmentId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid department ID' },
        { status: 400 }
      )
    }

    // Get department with company info
    const departmentResult = await query(`
      SELECT 
        d.*,
        c.name as company_name,
        e.name as manager_name
      FROM departments d
      LEFT JOIN companies c ON d.company_id = c.id
      LEFT JOIN employees e ON d.manager_id = e.id
      WHERE d.id = $1
    `, [departmentId])

    if (departmentResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Department not found' },
        { status: 404 }
      )
    }

    const department = departmentResult.rows[0]

    // Get department employees
    try {
      const employeeResult = await query(`
        SELECT 
          id,
          name,
          email,
          position,
          status,
          avatar_url
        FROM employees
        WHERE department_id = $1
        ORDER BY name
      `, [departmentId])
      
      department.employees = employeeResult.rows
      department.employee_count = employeeResult.rows.length
    } catch (error) {
      console.log('Error fetching employees for department:', error)
      department.employees = []
      department.employee_count = 0
    }

    // Get department projects
    try {
      const projectResult = await query(`
        SELECT 
          id,
          name,
          status,
          progress,
          start_date
        FROM projects
        WHERE department_id = $1
        ORDER BY start_date DESC
      `, [departmentId])
      
      department.projects = projectResult.rows
      department.project_count = projectResult.rows.length
      department.completed_projects = projectResult.rows.filter(p => p.status === 'completed').length
      department.active_projects = projectResult.rows.filter(p => p.status === 'in_progress' || p.status === 'active').length
    } catch (error) {
      console.log('Error fetching projects for department:', error)
      department.projects = []
      department.project_count = 0
      department.completed_projects = 0
      department.active_projects = 0
    }

    return NextResponse.json({
      success: true,
      data: department
    })

  } catch (error) {
    console.error('Error fetching department:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const departmentId = parseInt(params.id)
    const data = await request.json()

    if (isNaN(departmentId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid department ID' },
        { status: 400 }
      )
    }

    // Validate required fields
    if (!data.name || !data.company_id) {
      return NextResponse.json(
        { success: false, error: 'Name and company are required' },
        { status: 400 }
      )
    }

    // Check if department exists
    const existingResult = await query(
      'SELECT id FROM departments WHERE id = $1',
      [departmentId]
    )

    if (existingResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Department not found' },
        { status: 404 }
      )
    }

    // Update department (using existing table structure)
    await query(`
      UPDATE departments SET
        name = $1,
        description = $2,
        company_id = $3,
        manager_id = $4,
        updated_at = NOW()
      WHERE id = $5
    `, [
      data.name,
      data.description || null,
      data.company_id,
      data.manager_id || null,
      departmentId
    ])

    return NextResponse.json({
      success: true,
      message: 'Department updated successfully'
    })

  } catch (error) {
    console.error('Error updating department:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const departmentId = parseInt(params.id)

    if (isNaN(departmentId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid department ID' },
        { status: 400 }
      )
    }

    // Check if department exists
    const existingResult = await query(
      'SELECT id FROM departments WHERE id = $1',
      [departmentId]
    )

    if (existingResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Department not found' },
        { status: 404 }
      )
    }

    // Check if department has employees
    const employeeResult = await query(
      'SELECT COUNT(*) as count FROM employees WHERE department_id = $1',
      [departmentId]
    )

    const employeeCount = parseInt(employeeResult.rows[0].count)
    if (employeeCount > 0) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete department with employees. Please reassign employees first.' },
        { status: 400 }
      )
    }

    // Delete department
    await query('DELETE FROM departments WHERE id = $1', [departmentId])

    return NextResponse.json({
      success: true,
      message: 'Department deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting department:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}