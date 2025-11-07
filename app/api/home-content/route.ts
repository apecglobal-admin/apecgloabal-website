import { NextRequest, NextResponse } from 'next/server';
import { getAllHomeContent, updateHomeContent } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const homeContent = await getAllHomeContent();

    // Transform data to match frontend structure
    const transformedData = {
      infoHighlights: [],
      quickFacts: [],
      valuePillars: [],
      careerBenefits: [],
      ctaMetrics: [],
      introSection: {},
      techShowcaseSection: {},
      servicesSection: {},
      companyOverviewSection: {},
      ctaSection: {}
    };

    homeContent.forEach(item => {
      if (transformedData[item.section as keyof typeof transformedData]) {
        transformedData[item.section as keyof typeof transformedData] = item.content;
      }
    });

    return NextResponse.json({
      success: true,
      data: transformedData
    });

  } catch (error) {
    console.error('Error fetching home content:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch home content'
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { section, content } = body;

    if (!section || !content) {
      return NextResponse.json({
        success: false,
        error: 'Section and content are required'
      }, { status: 400 });
    }

    const updatedContent = await updateHomeContent(section, content);

    return NextResponse.json({
      success: true,
      data: updatedContent
    });

  } catch (error) {
    console.error('Error updating home content:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update home content'
    }, { status: 500 });
  }
}