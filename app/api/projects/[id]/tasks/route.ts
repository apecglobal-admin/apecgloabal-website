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
        pt.*,
        e.name as assignee_name
      FROM project_tasks pt
      LEFT JOIN employees e ON pt.assignee_id = e.id
      WHERE pt.project_id = $1
      ORDER BY pt.created_at
    `, [projectId])

    return NextResponse.json({
      success: true,
      data: result.rows
    })
  } catch (error) {
    console.error('Error fetching project tasks:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch project tasks' },
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
    if (!data.name) {
      return NextResponse.json(
        { success: false, error: 'Task name is required' },
        { status: 400 }
      )
    }

    const result = await query(`
      INSERT INTO project_tasks (
        project_id, name, description, assignee_id, status, 
        priority, due_date, created_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [
      projectId,
      data.name,
      data.description || null,
      data.assignee_id || null,
      data.status || 'pending',
      data.priority || 'medium',
      data.due_date || null,
      new Date().toISOString()
    ])

    return NextResponse.json({
      success: true,
      data: result.rows[0]
    })
  } catch (error) {
    console.error('Error creating project task:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create project task' },
      { status: 500 }
    )
  }
}