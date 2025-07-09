import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { deleteFromCloudinary } from '@/lib/cloudinary';

// Update company image
export async function PUT(request: NextRequest) {
  try {
    const { companyId, imageUrl, imagePublicId, gallery, galleryPublicIds } = await request.json();
    
    if (!companyId) {
      return NextResponse.json(
        { error: 'Company ID is required' },
        { status: 400 }
      );
    }

    // Update company with new image information
    const result = await query(
      `UPDATE companies 
       SET image_url = $1, 
           image_public_id = $2, 
           gallery = $3, 
           gallery_public_ids = $4,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $5
       RETURNING *`,
      [imageUrl, imagePublicId, gallery, galleryPublicIds, companyId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating company images:', error);
    return NextResponse.json(
      { error: 'Failed to update company images' },
      { status: 500 }
    );
  }
}

// Delete company image
export async function DELETE(request: NextRequest) {
  try {
    const { companyId, field } = await request.json();
    
    if (!companyId || !field) {
      return NextResponse.json(
        { error: 'Company ID and field are required' },
        { status: 400 }
      );
    }

    // Get current company data
    const companyResult = await query(
      'SELECT * FROM companies WHERE id = $1',
      [companyId]
    );

    if (companyResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      );
    }

    const company = companyResult.rows[0];
    
    // Delete from Cloudinary if public_id exists
    if (field === 'image' && company.image_public_id) {
      await deleteFromCloudinary(company.image_public_id);
      
      // Update company record
      await query(
        'UPDATE companies SET image_url = NULL, image_public_id = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = $1',
        [companyId]
      );
    } else if (field === 'gallery' && company.gallery_public_ids) {
      // Delete all gallery images from Cloudinary
      for (const publicId of company.gallery_public_ids) {
        await deleteFromCloudinary(publicId);
      }
      
      // Update company record
      await query(
        'UPDATE companies SET gallery = NULL, gallery_public_ids = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = $1',
        [companyId]
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting company image:', error);
    return NextResponse.json(
      { error: 'Failed to delete company image' },
      { status: 500 }
    );
  }
}