import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = params.id

    const result = await query(`
      SELECT * FROM project_milestones 
      WHERE project_id = $1
      ORDER BY due_date ASC
    `, [projectId])

    return NextResponse.json({
      success: true,
      data: result.rows
    })
  } catch (error) {
    console.error('Error fetching project milestones:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch project milestones' },
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
    if (!data.name || !data.due_date) {
      return NextResponse.json(
        { success: false, error: 'Milestone name and due date are required' },
        { status: 400 }
      )
    }

    const result = await query(`
      INSERT INTO project_milestones (
        project_id, name, description, due_date, status, created_at
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [
      projectId,
      data.name,
      data.description || '',
      data.due_date,
      data.status || 'pending',
      new Date().toISOString()
    ])

    return NextResponse.json({
      success: true,
      data: result.rows[0]
    })
  } catch (error) {
    console.error('Error adding project milestone:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to add project milestone' },
      { status: 500 }
    )
  }
}