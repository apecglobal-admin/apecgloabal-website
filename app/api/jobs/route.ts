import { NextRequest, NextResponse } from 'next/server'
import { getAllJobs, getAllCompanies, query } from '@/lib/db'

export async function GET() {
  try {
    const jobs = await getAllJobs()
    const companies = await getAllCompanies()
    
    // Tạo map để tra cứu tên công ty
    const companyMap = new Map<number, string>()
    companies.forEach((company) => {
      companyMap.set(company.id, company.name)
    })
    
    // Transform data for API response
    const jobsData = jobs.map((job) => ({
      id: job.id,
      title: job.title,
      company_id: job.company_id,
      company_name: companyMap.get(job.company_id) || 'Unknown',
      company_logo: '',
      department_id: job.department_id,
      department_name: job.department_name,
      location: job.location,
      type: job.type,
      experience_required: job.experience_required,
      salary_range: job.salary_range,
      description: job.description,
      requirements: job.requirements,
      benefits: job.benefits,
      skills: job.skills,
      status: job.status || 'active',
      urgent: job.urgent,
      remote_ok: job.remote_ok,
      created_at: job.created_at,
      updated_at: job.updated_at
    }))

    return NextResponse.json({
      success: true,
      data: jobsData,
      total: jobsData.length,
      companies: companies.length
    })
  } catch (error) {
    console.error('Error fetching jobs:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch jobs',
        data: []
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Validate required fields
    if (!data.title || !data.company_id) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Title and company_id are required' 
        },
        { status: 400 }
      )
    }
    
    const result = await query(`
      INSERT INTO jobs (
        title, company_id, department_id, location, type, experience_required,
        salary_range, description, requirements, benefits, skills, status, urgent, remote_ok
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *
    `, [
      data.title,
      data.company_id,
      data.department_id || null,
      data.location || '',
      data.type || '',
      data.experience_required || '',
      data.salary_range || '',
      data.description || '',
      JSON.stringify(data.requirements || []),
      JSON.stringify(data.benefits || []),
      JSON.stringify(data.skills || []),
      data.status || 'active',
      data.urgent || false,
      data.remote_ok || false
    ])
    
    return NextResponse.json({
      success: true,
      data: result.rows[0]
    })
  } catch (error) {
    console.error('Error creating job:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create job' 
      },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Validate required fields
    if (!data.id || !data.title || !data.company_id) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'ID, title and company_id are required' 
        },
        { status: 400 }
      )
    }
    
    const result = await query(`
      UPDATE jobs 
      SET title = $1, company_id = $2, department_id = $3, location = $4, 
          type = $5, experience_required = $6, salary_range = $7, description = $8,
          requirements = $9, benefits = $10, skills = $11, status = $12, 
          urgent = $13, remote_ok = $14, updated_at = CURRENT_TIMESTAMP
      WHERE id = $15
      RETURNING *
    `, [
      data.title,
      data.company_id,
      data.department_id || null,
      data.location || '',
      data.type || '',
      data.experience_required || '',
      data.salary_range || '',
      data.description || '',
      JSON.stringify(data.requirements || []),
      JSON.stringify(data.benefits || []),
      JSON.stringify(data.skills || []),
      data.status || 'active',
      data.urgent || false,
      data.remote_ok || false,
      data.id
    ])
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Job not found' 
        },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: result.rows[0]
    })
  } catch (error) {
    console.error('Error updating job:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update job' 
      },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const data = await request.json()
    
    if (!data.id) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Job ID is required' 
        },
        { status: 400 }
      )
    }
    
    const result = await query(`
      DELETE FROM jobs WHERE id = $1 RETURNING id
    `, [data.id])
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Job not found' 
        },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: 'Job deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting job:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to delete job' 
      },
      { status: 500 }
    )
  }
}