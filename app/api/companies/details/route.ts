import { NextResponse } from 'next/server';
import { getCompanyDetails, getProjectsByCompany, getServicesByCompany } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    // Lấy thông tin chi tiết của công ty
    const companyData = await getCompanyDetails(slug);
    
    if (!companyData) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }
    
    // Lấy dự án và dịch vụ của công ty
    const projects = await getProjectsByCompany(companyData.id);
    const services = await getServicesByCompany(companyData.id);
    
    return NextResponse.json({
      company: companyData,
      projects,
      services
    });
  } catch (error) {
    console.error('Error fetching company details:', error);
    return NextResponse.json({ error: 'Failed to fetch company details' }, { status: 500 });
  }
}