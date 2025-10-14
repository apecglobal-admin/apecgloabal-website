import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const limitParam = url.searchParams.get('limit')
    const limit = limitParam ? Math.min(parseInt(limitParam, 10) || 4, 12) : 4

    const result = await query(
      `
        SELECT p.*, c.name AS company_name, c.logo_url AS company_logo, c.slug AS company_slug
        FROM projects p
        LEFT JOIN companies c ON p.company_id = c.id
        WHERE p.is_featured = true
        ORDER BY p.display_order NULLS LAST, p.created_at DESC
        LIMIT $1
      `,
      [limit]
    )

    const featuredProjects = result.rows.map((project) => ({
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
      company_name: project.company_name,
      company_logo: project.company_logo,
      company_slug: project.company_slug,
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