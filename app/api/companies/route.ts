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
        website: company.website,
        address: company.address,
        phone: company.phone,
        email: company.email,
        employee_count: company.employee_count,
        established_year: company.established_year,
        industry: company.industry,
        is_featured: company.is_featured,
        created_at: company.created_at,
        updated_at: company.updated_at
      }))

      
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
    
    const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
    const values = fields.map(field => updateData[field]);
    
    const sql = `
      UPDATE companies 
      SET ${setClause}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;
    
    const result = await query(sql, [id, ...values]);
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }
    
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating company:', error);
    return NextResponse.json({ error: 'Failed to update company' }, { status: 500 });
  }
}