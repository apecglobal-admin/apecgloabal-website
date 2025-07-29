import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const companyId = params.id;
    
    const result = await query(`
      SELECT * FROM services 
      WHERE company_id = $1 
      ORDER BY is_featured DESC, title
    `, [companyId]);
    
    return NextResponse.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching company services:', error);
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const companyId = params.id;
    const data = await request.json();
    
    const result = await query(`
      INSERT INTO services (
        title, company_id, description, features, icon, 
        category, price_range, is_featured
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [
      data.title,
      companyId,
      data.description,
      data.features || [],
      data.icon,
      data.category,
      data.price_range,
      data.is_featured || false
    ]);
    
    return NextResponse.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json({ error: 'Failed to create service' }, { status: 500 });
  }
}