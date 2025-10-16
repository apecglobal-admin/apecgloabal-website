import { NextRequest, NextResponse } from 'next/server'
import { getAllServices, getAllCompanies, query } from '@/lib/db'

function normalizeFeatures(rawFeatures: unknown): string[] {
  if (Array.isArray(rawFeatures)) {
    return rawFeatures
      .filter((item): item is string => typeof item === 'string')
      .map((item) => item.trim())
      .filter(Boolean)
  }

  if (typeof rawFeatures === 'string') {
    try {
      const parsed = JSON.parse(rawFeatures)
      if (Array.isArray(parsed)) {
        return parsed
          .filter((item): item is string => typeof item === 'string')
          .map((item) => item.trim())
          .filter(Boolean)
      }
    } catch (error) {
      console.warn('Failed to parse features string, defaulting to empty array:', error)
    }
  }

  return []
}

export async function GET() {
  try {
    const services = await getAllServices()
    const companies = await getAllCompanies()
    
    // Create map for company lookup
    const companyMap = new Map<number, string>()
    companies.forEach((company) => {
      companyMap.set(company.id, company.name)
    })
    
    // Transform data for API response
    const servicesData = services.map((service) => ({
      id: service.id,
      title: service.title,
      slug: service.slug || service.id.toString(),
      description: service.description,
      icon: service.icon,
      category: service.category,
      features: service.features,
      price_range: service.price_range,
      is_featured: service.is_featured,
      company_id: service.company_id,
      company_name: companyMap.get(service.company_id) || 'Unknown',
      company_logo: '', // Add if needed
      created_at: service.created_at
    }))

    return NextResponse.json({
      success: true,
      data: servicesData,
      total: servicesData.length
    })
  } catch (error) {
    console.error('Error fetching services:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch services',
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
    
    // Generate slug from title if not provided
    let slug = data.slug
    if (!slug) {
      slug = data.title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[đĐ]/g, 'd')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
    }
    
    const result = await query(`
      INSERT INTO services (
        title, slug, description, features, icon, category, price_range, is_featured, company_id
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `, [
      data.title,
      slug,
      data.description || '',
      normalizeFeatures(data.features),
      data.icon || 'Package',
      data.category || '',
      data.price_range || '',
      data.is_featured || false,
      data.company_id
    ])
    
    return NextResponse.json({
      success: true,
      data: result.rows[0]
    })
  } catch (error) {
    console.error('Error creating service:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create service' 
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
    
    // Generate slug from title if not provided
    let slug = data.slug
    if (!slug) {
      slug = data.title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[đĐ]/g, 'd')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
    }
    
    const result = await query(`
      UPDATE services 
      SET title = $1, slug = $2, description = $3, features = $4, icon = $5, 
          category = $6, price_range = $7, is_featured = $8, company_id = $9,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $10
      RETURNING *
    `, [
      data.title,
      slug,
      data.description || '',
      normalizeFeatures(data.features),
      data.icon || 'Package',
      data.category || '',
      data.price_range || '',
      data.is_featured || false,
      data.company_id,
      data.id
    ])
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Service not found' 
        },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: result.rows[0]
    })
  } catch (error) {
    console.error('Error updating service:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update service' 
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
          error: 'Service ID is required' 
        },
        { status: 400 }
      )
    }
    
    const result = await query(`
      DELETE FROM services WHERE id = $1 RETURNING id
    `, [data.id])
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Service not found' 
        },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: 'Service deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting service:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to delete service' 
      },
      { status: 500 }
    )
  }
}