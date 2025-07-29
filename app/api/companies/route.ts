import { NextRequest, NextResponse } from 'next/server';
import { getAllCompanies, getCompanyBySlug } from '@/lib/db';
import { query } from '@/lib/db';

// Helper function for short descriptions
function getCompanyShortDescription(name: string) {
  switch (name) {
    case "ApecTech":
      return "AI và học tập số"
    case "GuardCam":
      return "Bảo mật công nghệ"
    case "EmoCommerce":
      return "Thương mại điện tử cảm xúc"
    case "TimeLoop":
      return "Phân tích hành vi và thời gian"
    case "ApecNeuroOS":
      return "Hệ điều hành doanh nghiệp tương lai"
    case "ApecGlobal":
      return "Tập đoàn công nghệ hàng đầu"
    default:
      return "Công nghệ tiên tiến"
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (slug) {
      // Nếu có slug, lấy thông tin chi tiết của công ty
      const company = await getCompanyBySlug(slug);
      
      if (!company) {
        return NextResponse.json({ error: 'Company not found' }, { status: 404 });
      }
      console.log("Fetched company:", company);
      return NextResponse.json(company);
    } else {
      // Nếu không có slug, lấy tất cả công ty
      const companies = await getAllCompanies();
      
      // Transform data for consistent API response
      const companiesData = companies.map((company) => ({
        id: company.id,
        name: company.name,
        slug: company.slug,
        description: company.description,
        short_description: company.short_description || getCompanyShortDescription(company.name),
        logo_url: company.logo_url,
        logo_public_id: company.logo_public_id,
        website_url: company.website_url || company.website, // Support both field names
        address: company.address,
        phone: company.phone,
        email: company.email,
        employee_count: company.employee_count,
        established_date: company.established_date,
        industry: company.industry,
        status: company.status || 'active', // Default status
        
        // Display fields
        mission: company.mission,
        vision: company.vision,
        values: company.values,
        achievements: company.achievements,
        

        
        // Social media
        facebook_url: company.facebook_url,
        twitter_url: company.twitter_url,
        linkedin_url: company.linkedin_url,
        youtube_url: company.youtube_url,
        
        // SEO and display
        is_featured: company.is_featured,
        display_order: company.display_order,
        meta_title: company.meta_title,
        meta_description: company.meta_description,
        
        created_at: company.created_at,
        updated_at: company.updated_at
      }))

      console.log("Fetched companies:", companiesData);
      
      return NextResponse.json({
        success: true,
        data: companiesData,
        total: companiesData.length
      });
    }
  } catch (error) {
    console.error('Error fetching companies:', error);
    return NextResponse.json({ error: 'Failed to fetch companies' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    console.log('POST /api/companies - Received data:', JSON.stringify(data, null, 2));
    
    // Validate required fields
    if (!data.name || !data.slug) {
      console.log('POST /api/companies - Missing required fields:', { name: data.name, slug: data.slug });
      return NextResponse.json({ 
        error: 'Name and slug are required fields' 
      }, { status: 400 });
    }
    
    // Check if slug already exists
    const existingCompany = await query(
      'SELECT id FROM companies WHERE slug = $1',
      [data.slug]
    );
    
    if (existingCompany.rows.length > 0) {
      return NextResponse.json({ 
        error: 'Company with this slug already exists' 
      }, { status: 409 });
    }
    
    // Prepare data for insertion
    const insertData = {
      name: data.name,
      slug: data.slug,
      description: data.description || '',
      short_description: data.short_description || getCompanyShortDescription(data.name),
      logo_url: data.logo_url || null,
      logo_public_id: data.logo_public_id || null,
      website_url: data.website_url || null,
      address: data.address || null,
      phone: data.phone || null,
      email: data.email || null,
      employee_count: data.employee_count || 0,
      established_date: data.established_date || null,
      industry: data.industry || null,
      status: data.status || 'active',
      mission: data.mission || null,
      vision: data.vision || null,
      values: Array.isArray(data.values) ? data.values : [],
      achievements: Array.isArray(data.achievements) ? data.achievements : [],
      facebook_url: data.facebook_url || null,
      twitter_url: data.twitter_url || null,
      linkedin_url: data.linkedin_url || null,
      youtube_url: data.youtube_url || null,
      is_featured: data.is_featured || false,
      display_order: data.display_order || 0,
      meta_title: data.meta_title || null,
      meta_description: data.meta_description || null
    };
    
    // Create the INSERT query
    const fields = Object.keys(insertData);
    const placeholders = fields.map((_, index) => `$${index + 1}`).join(', ');
    const values = fields.map(field => insertData[field]);
    
    const sql = `
      INSERT INTO companies (${fields.join(', ')}, created_at, updated_at)
      VALUES (${placeholders}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING *
    `;
    
    console.log('POST /api/companies - SQL:', sql);
    console.log('POST /api/companies - Values:', values);
    
    const result = await query(sql, values);
    
    console.log('POST /api/companies - Success:', result.rows[0]);
    
    return NextResponse.json({
      success: true,
      data: result.rows[0]
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating company:', error);
    return NextResponse.json({ 
      error: 'Failed to create company',
      details: error.message 
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const { id, ...updateData } = data;
    
    if (!id) {
      return NextResponse.json({ error: 'Company ID is required' }, { status: 400 });
    }
    
    // Create dynamic query based on provided fields
    const fields = Object.keys(updateData);
    if (fields.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }
    
    // Special handling for array fields
    const processedValues = fields.map(field => {
      if (field === 'values' || field === 'achievements') {
        return Array.isArray(updateData[field]) ? updateData[field] : [];
      }
      return updateData[field];
    });
    
    const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
    
    const sql = `
      UPDATE companies 
      SET ${setClause}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;
    
    const result = await query(sql, [id, ...processedValues]);
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }
    
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating company:', error);
    return NextResponse.json({ error: 'Failed to update company' }, { status: 500 });
  }
}