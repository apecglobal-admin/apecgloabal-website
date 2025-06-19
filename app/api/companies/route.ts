import { NextResponse } from 'next/server';
import { getAllCompanies, getCompanyBySlug } from '@/lib/db';

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
      return NextResponse.json(companies);
    }
  } catch (error) {
    console.error('Error fetching companies:', error);
    return NextResponse.json({ error: 'Failed to fetch companies' }, { status: 500 });
  }
}