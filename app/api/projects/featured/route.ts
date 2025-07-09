import { NextResponse } from 'next/server'
import { getAllProjects } from '@/lib/db'

export async function GET() {
  try {
    const projects = await getAllProjects()
    
    // Filter only featured projects
    const featuredProjects = projects
      .filter(project => project.is_featured)
      .map((project) => ({
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
      data: featuredProjects,
      total: featuredProjects.length
    })
  } catch (error) {
    console.error('Error fetching featured projects:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch featured projects',
        data: []
      },
      { status: 500 }
    )
  }
}