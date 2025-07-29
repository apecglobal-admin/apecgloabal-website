import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { uploadToCloudinary, deleteFromCloudinary } from '@/lib/cloudinary';

export async function POST(request: NextRequest) {
  try {
    console.log('Document upload API called');
    
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const name = formData.get('name') as string || file?.name;
    const description = formData.get('description') as string || '';
    const folderPath = formData.get('folderPath') as string || '';
    // Sử dụng folderPath làm category nếu có, nếu không thì dùng 'Uncategorized'
    const category = folderPath || 'Uncategorized';
    const uploadedByStr = formData.get('uploadedBy') as string;
    const uploadedBy = uploadedByStr ? parseInt(uploadedByStr) : 1;
    const isPublic = formData.get('isPublic') === 'true';
    
    console.log('Upload params:', { 
      fileName: file?.name, 
      name, 
      category, 
      uploadedBy, 
      folderPath,
      fileSize: file?.size
    });
    
    if (!file) {
      console.error('Missing file in upload request');
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Get file size in KB or MB
    const fileSizeInKB = Math.round(file.size / 1024);
    const fileSize = fileSizeInKB >= 1024 
      ? `${(fileSizeInKB / 1024).toFixed(2)} MB` 
      : `${fileSizeInKB} KB`;
    
    // Get file type
    const fileType = file.type || 'application/octet-stream';

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    console.log('Uploading to Cloudinary...');
    
    // Upload to Cloudinary with folder path included
    const cloudinaryFolder = folderPath 
      ? `documents/${folderPath.replace(/\//g, '_')}` 
      : 'documents';
      
    console.log('Using Cloudinary folder:', cloudinaryFolder);
    
    // Upload to Cloudinary with MIME type
    const result = await uploadToCloudinary(buffer, cloudinaryFolder, fileType);
    
    console.log('Cloudinary upload successful, saving to database...');

    // Save document to database
    const dbResult = await query(
      `INSERT INTO documents 
       (name, file_type, file_size, file_url, file_public_id, resource_type, category, uploaded_by, description, folder_path, is_public) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
       RETURNING *`,
      [name, fileType, fileSize, result.url, result.public_id, result.resource_type, category, uploadedBy, description, folderPath, isPublic]
    );

    console.log('Document saved to database with ID:', dbResult.rows[0].id);
    
    return NextResponse.json(dbResult.rows[0]);
  } catch (error) {
    console.error('Error in document upload API:', error);
    return NextResponse.json(
      { error: `Failed to upload document: ${error.message}` },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { documentId } = await request.json();
    
    if (!documentId) {
      return NextResponse.json(
        { error: 'Document ID is required' },
        { status: 400 }
      );
    }

    // Get document details
    const documentResult = await query(
      'SELECT * FROM documents WHERE id = $1',
      [documentId]
    );

    if (documentResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    const document = documentResult.rows[0];
    
    // Delete from Cloudinary if public_id exists
    if (document.file_public_id) {
      await deleteFromCloudinary(document.file_public_id);
    }
    
    // Delete from database
    await query(
      'DELETE FROM documents WHERE id = $1',
      [documentId]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting document:', error);
    return NextResponse.json(
      { error: 'Failed to delete document' },
      { status: 500 }
    );
  }
}