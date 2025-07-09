import { NextResponse } from 'next/server'
import { getAllProjects } from '@/lib/db'

export async function GET() {
  try {
    const projects = await getAllProjects()
    
    // Transform data for API response
    const projectsData = projects.map((project) => ({
      id: project.id,
      name: project.name,
      slug: project.slug,
      description: project.description,
      image_url: project.image_url,
      status: project.status,
      start_date: project.start_date,
      end_date: project.end_date,
      technologies: project.technologies,
      is_featured: project.is_featured,
      company_id: project.company_id,
      created_at: project.created_at,
      updated_at: project.updated_at
    }))

    return NextResponse.json({
      success: true,
      data: projectsData,
      total: projectsData.length
    })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch projects',
        data: []
      },
      { status: 500 }
    )
  }
}