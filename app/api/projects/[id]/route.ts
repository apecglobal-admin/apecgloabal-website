import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = params.id

    const result = await query(`
      SELECT p.*, c.name as company_name, c.logo_url as company_logo, c.slug as company_slug
      FROM projects p
      LEFT JOIN companies c ON p.company_id = c.id
      WHERE p.id = $1
    `, [projectId])

    if (result.rows.length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Project not found' 
        },
        { status: 404 }
      )
    }

    const project = result.rows[0]
    
    return NextResponse.json({
      success: true,
      data: project
    })
  } catch (error) {
    console.error('Error fetching project:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch project' 
      },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = params.id
    const data = await request.json()

    // Build update query dynamically
    const updateFields = []
    const values = []
    let paramIndex = 1

    // List of allowed fields to update
    const allowedFields = [
      'name', 'description', 'manager_id', 'company_id', 'status', 'priority',
      'progress', 'start_date', 'end_date', 'budget', 'spent',
      'team_size', 'technologies', 'features', 'challenges',
      'solutions', 'results', 'testimonials'
    ]

    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        let value = data[field]

        // Convert empty strings for date fields to null to satisfy Postgres DATE type
        if ((field === 'start_date' || field === 'end_date') && value === '') {
          value = null
        }

        if (field === 'company_id') {
          // Normalize company_id to number or null for Postgres INTEGER type
          if (value === '' || value === null) {
            value = null
          } else {
            const parsedValue = Number(value)
            value = Number.isNaN(parsedValue) ? null : parsedValue
          }
        }

        updateFields.push(`${field} = $${paramIndex}`)
        values.push(value)
        paramIndex++
      }
    }

    // Update slug if name is changed
    if (data.name) {
      const slug = data.name.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
      
      updateFields.push(`slug = $${paramIndex}`)
      values.push(slug)
      paramIndex++
    }

    if (updateFields.length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'No valid fields to update' 
        },
        { status: 400 }
      )
    }

    // Add updated_at
    updateFields.push(`updated_at = CURRENT_TIMESTAMP`)
    values.push(projectId)

    const result = await query(`
      UPDATE projects 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `, values)

    if (result.rows.length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Project not found' 
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0]
    })
  } catch (error) {
    console.error('Error updating project:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update project' 
      },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = params.id

    const result = await query(`
      DELETE FROM projects 
      WHERE id = $1
      RETURNING *
    `, [projectId])

    if (result.rows.length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Project not found' 
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Project deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to delete project' 
      },
      { status: 500 }
    )
  }
}