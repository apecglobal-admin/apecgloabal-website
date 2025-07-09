import { NextResponse } from 'next/server'
import { getAllServices } from '@/lib/db'

export async function GET() {
  try {
    const services = await getAllServices()
    
    // Transform data for API response
    const servicesData = services.map((service) => ({
      id: service.id,
      title: service.title,
      slug: service.slug,
      description: service.description,
      icon: service.icon,
      features: service.features,
      price_range: service.price_range,
      is_featured: service.is_featured,
      company_id: service.company_id,
      created_at: service.created_at,
      updated_at: service.updated_at
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