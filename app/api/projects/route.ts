import { NextRequest, NextResponse } from 'next/server'
import { getAllProjects, query } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const params = searchParams instanceof URLSearchParams
      ? Object.fromEntries(searchParams.entries())
      : {}

    const companyId = params.company_id
    const featured = params.featured
    const limitParam = params.limit
    const statusParam = params.status

    let projects
    if (companyId && companyId !== 'undefined' && companyId !== 'null') {
      const result = await query(
        `
          SELECT p.*, c.name as company_name, c.logo_url as company_logo, c.slug as company_slug
          FROM projects p
          LEFT JOIN companies c ON p.company_id = c.id
          WHERE p.company_id = $1
          ORDER BY p.created_at DESC
        `,
        [companyId]
      )
      projects = result.rows
    } else if (featured === 'true') {
      const limit = limitParam ? Math.min(parseInt(limitParam, 10) || 4, 12) : 4
      const result = await query(
        `
          SELECT p.*, c.name AS company_name, c.logo_url AS company_logo, c.slug AS company_slug
          FROM projects p
          LEFT JOIN companies c ON p.company_id = c.id
          WHERE p.is_featured = true
          ORDER BY COALESCE(p.display_order, EXTRACT(EPOCH FROM p.start_date)) DESC, p.start_date DESC
          LIMIT $1
        `,
        [limit]
      )
      projects = result.rows
    } else {
      const allParams = new URLSearchParams()
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '' && value !== 'undefined' && value !== 'null') {
          allParams.append(key, value)
        }
      })

      projects = await getAllProjects(allParams)
    }

    let filteredProjects = projects
    if (statusParam) {
      const normalizedStatuses = statusParam
        .split(',')
        .map((status) => status.trim().toLowerCase())
        .filter(Boolean)

      if (normalizedStatuses.length > 0) {
        filteredProjects = projects.filter((project) => {
          const projectStatus = (project.status || '').toLowerCase()
          return normalizedStatuses.some((status) => projectStatus.includes(status))
        })
      }
    }

    const projectsData = filteredProjects.map((project) => ({
      id: project.id,
      name: project.name,
      slug: project.slug,
      description: project.description,
      image_url: project.image_url,
      status: project.status,
      priority: project.priority,
      progress: project.progress,
      start_date: project.start_date,
      end_date: project.end_date,
      budget: project.budget,
      spent: project.spent,
      team_size: project.team_size,
      technologies: project.technologies,
      features: project.features,
      challenges: project.challenges,
      solutions: project.solutions,
      results: project.results,
      testimonials: project.testimonials,
      is_featured: project.is_featured,
      company_id: project.company_id,
      company_name: project.company_name,
      company_logo: project.company_logo,
      company_slug: project.company_slug,
      manager_id: project.manager_id,
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

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Validate required fields
    if (!data.name || !data.company_id) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Name and company_id are required' 
        },
        { status: 400 }
      )
    }
    
    // Generate slug from name
    const slug = data.name.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
    
    const result = await query(`
      INSERT INTO projects (
        name, slug, description, company_id, manager_id, status, priority, 
        progress, start_date, end_date, budget, spent, team_size, 
        technologies, features, challenges, solutions, results, testimonials
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
      RETURNING *
    `, [
      data.name,
      slug,
      data.description || '',
      data.company_id,
      data.manager_id || null,
      data.status || 'planning',
      data.priority || 'medium',
      data.progress || 0,
      data.start_date || null,
      data.end_date || null,
      data.budget || 0,
      data.spent || 0,
      data.team_size || 1,
      data.technologies || [],
      data.features || [],
      data.challenges || [],
      data.solutions || [],
      data.results || [],
      data.testimonials || []
    ])
    
    return NextResponse.json({
      success: true,
      data: result.rows[0]
    })
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create project' 
      },
      { status: 500 }
    )
  }
}