import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const companyId = params.id;
    
    const result = await query(`
      SELECT p.*, 
        e.name as manager_name,
        c.name as company_name
      FROM projects p
      LEFT JOIN employees e ON p.manager_id = e.id
      LEFT JOIN companies c ON p.company_id = c.id
      WHERE p.company_id = $1 
      ORDER BY p.created_at DESC
    `, [companyId]);
    
    return NextResponse.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching company projects:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const companyId = params.id;
    const data = await request.json();
    
    // Validate required fields
    if (!data.name) {
      return NextResponse.json({ error: 'Project name is required' }, { status: 400 });
    }
    
    // Generate slug from name if not provided
    const slug = data.slug || data.name.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    
    const result = await query(`
      INSERT INTO projects (
        name, slug, description, company_id, manager_id, status, 
        priority, progress, start_date, end_date, budget, spent, 
        team_size, technologies, image_url, gallery, features, 
        challenges, solutions, results, testimonials
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
      RETURNING *
    `, [
      data.name,
      slug,
      data.description || '',
      companyId,
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
      data.image_url || null,
      data.gallery || [],
      data.features || [],
      data.challenges || [],
      data.solutions || [],
      data.results || [],
      data.testimonials || []
    ]);
    
    return NextResponse.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}