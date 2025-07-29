import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = params.id

    const result = await query(`
      SELECT 
        pm.*,
        e.name as employee_name,
        e.email as employee_email
      FROM project_members pm
      LEFT JOIN employees e ON pm.employee_id = e.id
      WHERE pm.project_id = $1
      ORDER BY pm.join_date
    `, [projectId])

    return NextResponse.json({
      success: true,
      data: result.rows
    })
  } catch (error) {
    console.error('Error fetching project members:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch project members' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = params.id
    const data = await request.json()

    // Validate required fields
    if (!data.employee_id || !data.role) {
      return NextResponse.json(
        { success: false, error: 'Employee ID and role are required' },
        { status: 400 }
      )
    }

    // Check if member already exists
    const existingMember = await query(`
      SELECT id FROM project_members 
      WHERE project_id = $1 AND employee_id = $2
    `, [projectId, data.employee_id])

    if (existingMember.rows.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Employee is already a member of this project' },
        { status: 400 }
      )
    }

    const result = await query(`
      INSERT INTO project_members (
        project_id, employee_id, role, join_date, hourly_rate
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [
      projectId,
      data.employee_id,
      data.role,
      data.join_date || new Date().toISOString(),
      data.hourly_rate || 0
    ])

    return NextResponse.json({
      success: true,
      data: result.rows[0]
    })
  } catch (error) {
    console.error('Error adding project member:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to add project member' },
      { status: 500 }
    )
  }
}