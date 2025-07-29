import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const employeeId = parseInt(params.id)

    if (isNaN(employeeId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid employee ID' },
        { status: 400 }
      )
    }

    // Get employee with company and department info
    const employeeResult = await query(`
      SELECT 
        e.*,
        c.name as company_name,
        d.name as department_name
      FROM employees e
      LEFT JOIN companies c ON e.company_id = c.id
      LEFT JOIN departments d ON e.department_id = d.id
      WHERE e.id = $1
    `, [employeeId])

    if (employeeResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Employee not found' },
        { status: 404 }
      )
    }

    const employee = employeeResult.rows[0]

    // Get employee's projects (if project_members table exists)
    try {
      const projectResult = await query(`
        SELECT 
          pm.id,
          pm.role,
          pm.join_date,
          p.name as project_name,
          p.status as project_status
        FROM project_members pm
        JOIN projects p ON pm.project_id = p.id
        WHERE pm.employee_id = $1
        ORDER BY pm.join_date DESC
      `, [employeeId])
      
      employee.projects = projectResult.rows
    } catch (error) {
      console.log('project_members table not found, setting empty projects array')
      employee.projects = []
    }

    return NextResponse.json({
      success: true,
      data: employee
    })

  } catch (error) {
    console.error('Error fetching employee:', error)
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
    const employeeId = parseInt(params.id)
    const data = await request.json()

    if (isNaN(employeeId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid employee ID' },
        { status: 400 }
      )
    }

    // Validate required fields
    if (!data.name || !data.email || !data.company_id) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and company are required' },
        { status: 400 }
      )
    }

    // Check if employee exists
    const existingResult = await query(
      'SELECT id FROM employees WHERE id = $1',
      [employeeId]
    )

    if (existingResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Employee not found' },
        { status: 404 }
      )
    }

    // Update employee (using existing table structure)
    await query(`
      UPDATE employees SET
        name = $1,
        email = $2,
        phone = $3,
        position = $4,
        department_id = $5,
        company_id = $6,
        join_date = $7,
        salary = $8,
        status = $9,
        address = $10,
        skills = $11,
        education = $12,
        bio = $13,
        avatar_url = $14,
        updated_at = NOW()
      WHERE id = $15
    `, [
      data.name,
      data.email,
      data.phone || null,
      data.position || null,
      data.department_id || null,
      data.company_id,
      data.hire_date || data.join_date || null,
      data.salary || null,
      data.status || 'active',
      data.address || null,
      data.skills || null,
      data.education || null,
      data.notes || data.bio || null,
      data.avatar_url || null,
      employeeId
    ])

    return NextResponse.json({
      success: true,
      message: 'Employee updated successfully'
    })

  } catch (error) {
    console.error('Error updating employee:', error)
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
    const employeeId = parseInt(params.id)

    if (isNaN(employeeId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid employee ID' },
        { status: 400 }
      )
    }

    // Check if employee exists
    const existingResult = await query(
      'SELECT id FROM employees WHERE id = $1',
      [employeeId]
    )

    if (existingResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Employee not found' },
        { status: 404 }
      )
    }

    // Delete employee (this will also cascade delete project_members due to foreign key)
    await query('DELETE FROM employees WHERE id = $1', [employeeId])

    return NextResponse.json({
      success: true,
      message: 'Employee deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting employee:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}