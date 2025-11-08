import { NextRequest, NextResponse } from 'next/server';
import {
  getClientOverflowContentById,
  updateClientOverflowContent,
  deleteClientOverflowContent
} from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid ID'
      }, { status: 400 });
    }

    const content = await getClientOverflowContentById(id);
    if (!content) {
      return NextResponse.json({
        success: false,
        error: 'Content not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: content
    });

  } catch (error) {
    console.error('Error fetching client overflow content:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch client overflow content'
    }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid ID'
      }, { status: 400 });
    }

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
      display_order,
      is_active
    } = body;

    const updatedContent = await updateClientOverflowContent(id, {
      title,
      content,
      client_name,
      client_position,
      client_company,
      client_image_url,
      rating,
      category,
      is_featured,
      display_order,
      is_active
    });

    if (!updatedContent) {
      return NextResponse.json({
        success: false,
        error: 'Content not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: updatedContent
    });

  } catch (error) {
    console.error('Error updating client overflow content:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update client overflow content'
    }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid ID'
      }, { status: 400 });
    }

    const deletedContent = await deleteClientOverflowContent(id);
    if (!deletedContent) {
      return NextResponse.json({
        success: false,
        error: 'Content not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: deletedContent
    });

  } catch (error) {
    console.error('Error deleting client overflow content:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete client overflow content'
    }, { status: 500 });
  }
}