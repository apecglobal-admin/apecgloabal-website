import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { uploadToCloudinary, getSignedCloudinaryUrl } from '@/lib/cloudinary'

const ensureApplicationsTableExists = async () => {
  await query(`
    CREATE TABLE IF NOT EXISTS applications (
      id SERIAL PRIMARY KEY,
      job_id INTEGER NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
      applicant_name VARCHAR(255) NOT NULL,
      applicant_email VARCHAR(255) NOT NULL,
      applicant_phone VARCHAR(20),
      position_applied VARCHAR(255) NOT NULL,
      introduction TEXT,
      resume_url TEXT,
      resume_public_id VARCHAR(255),
      status VARCHAR(50) DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `)
}

export async function GET(request: NextRequest) {
  try {
    await ensureApplicationsTableExists()

    const { searchParams } = new URL(request.url)
    const companyId = searchParams.get('company_id')
    const jobId = searchParams.get('job_id')
    const status = searchParams.get('status')

    const selectedFields = searchParams.get('fields')
    const includeViewer = searchParams.get('include_viewer') === 'true'

    let whereConditions = []
    let params: any[] = []
    let paramIndex = 1

    if (companyId) {
      whereConditions.push(`j.company_id = $${paramIndex}`)
      params.push(parseInt(companyId))
      paramIndex++
    }

    if (jobId) {
      whereConditions.push(`a.job_id = $${paramIndex}`)
      params.push(parseInt(jobId))
      paramIndex++
    }

    if (status) {
      whereConditions.push(`a.status = $${paramIndex}`)
      params.push(status)
      paramIndex++
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : ''

    const result = await query(`
      SELECT
        a.*,
        j.title as job_title,
        j.company_id,
        c.name as company_name,
        c.logo_url as company_logo
      FROM applications a
      LEFT JOIN jobs j ON a.job_id = j.id
      LEFT JOIN companies c ON j.company_id = c.id
      ${whereClause}
      ORDER BY a.created_at DESC
    `, params)

    let data = result.rows

    if (selectedFields) {
      const rawFields = selectedFields
        .split(',')
        .map(field => field.trim())
        .filter(Boolean)

      if (rawFields.length > 0) {
        data = data.map((row) => {
          const mappedRow: Record<string, any> = {}

          rawFields.forEach((field) => {
            // Support nested property access using dot notation, e.g. "job.title"
            if (field.includes('.')) {
              const [prefix, nestedKey] = field.split('.', 2)
              if (prefix === 'job' && nestedKey) {
                const jobInfo = {
                  title: row.job_title,
                  company_id: row.company_id,
                  company_name: row.company_name,
                  company_logo: row.company_logo
                }
                if (nestedKey in jobInfo) {
                  mappedRow.job = {
                    ...mappedRow.job,
                    [nestedKey]: jobInfo[nestedKey as keyof typeof jobInfo]
                  }
                }
              }
              return
            }

            if (field in row) {
              mappedRow[field] = row[field]
            }
          })

          if (includeViewer && row.resume_public_id) {
            mappedRow.resume_view_url = getSignedCloudinaryUrl(row.resume_public_id, {
              resource_type: 'raw',
              flags: 'attachment',
              secure: true
            })
          } else if (includeViewer && row.resume_url) {
            mappedRow.resume_view_url = row.resume_url
          }

          return mappedRow
        })
      }
    } else if (includeViewer) {
      data = data.map((row) => {
        if (row.resume_public_id) {
          return {
            ...row,
            resume_view_url: getSignedCloudinaryUrl(row.resume_public_id, {
              resource_type: 'raw',
              flags: 'attachment',
              secure: true
            })
          }
        }

        if (row.resume_url) {
          return {
            ...row,
            resume_view_url: row.resume_url
          }
        }

        return row
      })
    }

    return NextResponse.json({
      success: true,
      data,
      total: result.rows.length
    })
  } catch (error) {
    console.error('Error fetching applications:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch applications',
        data: []
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureApplicationsTableExists()

    const formData = await request.formData()

    const applicantName = (formData.get('applicant_name') ?? null) as string | null
    const applicantEmail = (formData.get('applicant_email') ?? null) as string | null
    const applicantPhone = (formData.get('applicant_phone') ?? null) as string | null
    const positionApplied = (formData.get('position_applied') ?? null) as string | null
    const introduction = (formData.get('introduction') ?? null) as string | null
    const jobIdValue = (formData.get('job_id') ?? null) as string | null
    const statusValue = (formData.get('status') ?? null) as string | null

    const resumeEntry = formData.get('resume')
    const resumeFile = resumeEntry instanceof File ? resumeEntry : null

    const jobId = jobIdValue ? parseInt(jobIdValue, 10) : null
    const status = statusValue && statusValue.trim() ? statusValue.trim() : 'pending'

    const missingFields: string[] = []
    if (!jobId || Number.isNaN(jobId)) missingFields.push('job_id')
    if (!applicantName) missingFields.push('applicant_name')
    if (!applicantEmail) missingFields.push('applicant_email')
    if (!positionApplied) missingFields.push('position_applied')

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `${missingFields.join(', ')} ${missingFields.length === 1 ? 'is' : 'are'} required`
        },
        { status: 400 }
      )
    }

    let resumeUrl: string | null = null
    let resumePublicId: string | null = null

    if (resumeFile) {
      const bytes = await resumeFile.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const uploadResult = await uploadToCloudinary(buffer, 'applications/resumes', resumeFile.type || undefined)
      resumeUrl = uploadResult.url
      resumePublicId = uploadResult.public_id
    }

    const result = await query(
      `
      INSERT INTO applications (
        job_id, applicant_name, applicant_email, applicant_phone,
        position_applied, introduction, resume_url, resume_public_id, status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `,
      [
        jobId,
        applicantName,
        applicantEmail,
        applicantPhone || null,
        positionApplied,
        introduction || null,
        resumeUrl,
        resumePublicId,
        status
      ]
    )

    return NextResponse.json({
      success: true,
      data: result.rows[0]
    })
  } catch (error) {
    console.error('Error creating application:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create application'
      },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    await ensureApplicationsTableExists()

    const data = await request.json()

    if (!data.id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Application ID is required'
        },
        { status: 400 }
      )
    }

    const result = await query(`
      UPDATE applications
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `, [data.status, data.id])

    if (result.rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Application not found'
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0]
    })
  } catch (error) {
    console.error('Error updating application:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update application'
      },
      { status: 500 }
    )
  }
}