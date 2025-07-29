import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const jobId = parseInt(params.id)

    if (isNaN(jobId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid job ID' },
        { status: 400 }
      )
    }

    // Get job with company and department info
    const jobResult = await query(`
      SELECT 
        j.*,
        c.name as company_name,
        d.name as department_name
      FROM jobs j
      LEFT JOIN companies c ON j.company_id = c.id
      LEFT JOIN departments d ON j.department_id = d.id
      WHERE j.id = $1
    `, [jobId])

    if (jobResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Job not found' },
        { status: 404 }
      )
    }

    const job = jobResult.rows[0]

    // Mock applications data since we don't have job_applications table yet
    job.applications = []
    job.application_count = 0
    job.view_count = job.view_count || Math.floor(Math.random() * 100) + 50
    job.interview_count = 0
    job.hired_count = 0

    // Calculate rates
    job.application_rate = job.view_count > 0 ? Math.round((job.application_count / job.view_count) * 100) : 0
    job.interview_rate = job.application_count > 0 ? Math.round((job.interview_count / job.application_count) * 100) : 0
    job.hire_rate = job.interview_count > 0 ? Math.round((job.hired_count / job.interview_count) * 100) : 0

    return NextResponse.json({
      success: true,
      data: job
    })

  } catch (error) {
    console.error('Error fetching job:', error)
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
    const jobId = parseInt(params.id)
    const data = await request.json()

    if (isNaN(jobId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid job ID' },
        { status: 400 }
      )
    }

    // Validate required fields
    if (!data.title || !data.company_id) {
      return NextResponse.json(
        { success: false, error: 'Title and company are required' },
        { status: 400 }
      )
    }

    // Check if job exists
    const existingResult = await query(
      'SELECT id FROM jobs WHERE id = $1',
      [jobId]
    )

    if (existingResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Job not found' },
        { status: 404 }
      )
    }

    // Update job
    await query(`
      UPDATE jobs SET
        title = $1,
        description = $2,
        requirements = $3,
        benefits = $4,
        company_id = $5,
        department_id = $6,
        location = $7,
        salary_min = $8,
        salary_max = $9,
        employment_type = $10,
        experience_level = $11,
        status = $12,
        deadline = $13,
        contact_email = $14,
        contact_phone = $15,
        updated_at = NOW()
      WHERE id = $16
    `, [
      data.title,
      data.description || null,
      data.requirements || null,
      data.benefits || null,
      data.company_id,
      data.department_id || null,
      data.location || null,
      data.salary_min || 0,
      data.salary_max || 0,
      data.employment_type || 'full_time',
      data.experience_level || 'mid',
      data.status || 'active',
      data.deadline || null,
      data.contact_email || null,
      data.contact_phone || null,
      jobId
    ])

    return NextResponse.json({
      success: true,
      message: 'Job updated successfully'
    })

  } catch (error) {
    console.error('Error updating job:', error)
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
    const jobId = parseInt(params.id)

    if (isNaN(jobId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid job ID' },
        { status: 400 }
      )
    }

    // Check if job exists
    const existingResult = await query(
      'SELECT id FROM jobs WHERE id = $1',
      [jobId]
    )

    if (existingResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Job not found' },
        { status: 404 }
      )
    }

    // Delete job
    await query('DELETE FROM jobs WHERE id = $1', [jobId])

    return NextResponse.json({
      success: true,
      message: 'Job deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting job:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}