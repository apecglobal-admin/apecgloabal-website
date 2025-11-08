import { NextRequest, NextResponse } from 'next/server';
import {
  getAllClientOverflowContent,
  getFeaturedClientOverflowContent,
  createClientOverflowContent
} from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');

    let data;
    if (featured === 'true') {
      const limit = parseInt(searchParams.get('limit') || '6');
      data = await getFeaturedClientOverflowContent(limit);
    } else {
      data = await getAllClientOverflowContent();
    }

    return NextResponse.json({
      success: true,
      data: data
    });

  } catch (error) {
    console.error('Error fetching client overflow content:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch client overflow content'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      content,
      client_name,
      client_position,
      client_company,
      client_image_url,
      rating,
      category,
      is_featured,
      display_order
    } = body;

    if (!title) {
      return NextResponse.json({
        success: false,
        error: 'Title is required'
      }, { status: 400 });
    }

    const newContent = await createClientOverflowContent({
      title,
      content,
      client_name,
      client_position,
      client_company,
      client_image_url,
      rating,
      category,
      is_featured,
      display_order
    });

    return NextResponse.json({
      success: true,
      data: newContent
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating client overflow content:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create client overflow content'
    }, { status: 500 });
  }
}