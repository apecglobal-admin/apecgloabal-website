import { NextResponse } from 'next/server'
import { getAllJobs, getAllCompanies } from '@/lib/db'

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
      location: job.location,
      type: job.type,
      description: job.description,
      requirements: job.requirements,
      salary_range: job.salary_range,
      experience_required: job.experience_required,
      skills: job.skills,
      remote_ok: job.remote_ok,
      urgent: job.urgent,
      is_active: job.is_active,
      posted_at: job.posted_at,
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