import { NextRequest, NextResponse } from 'next/server';
import { uploadToCloudinary, deleteFromCloudinary } from '@/lib/cloudinary';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string;
    const saveToDb = formData.get('saveToDb') === 'true';
    const description = formData.get('description') as string || '';
    // Sử dụng folder làm category
    const category = folder || 'Uncategorized';
    const uploadedByStr = formData.get('uploadedBy') as string;
    const uploadedBy = uploadedByStr ? parseInt(uploadedByStr) : 1;
    const isPublic = formData.get('isPublic') === 'true';
    
    if (!file) {
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
    
    // Determine folder based on file type
    let typeFolder = 'documents';
    if (fileType.startsWith('image/')) {
      typeFolder = 'images';
    } else if (fileType.includes('pdf')) {
      typeFolder = 'pdfs';
    } else if (fileType.includes('word') || fileType.includes('document')) {
      typeFolder = 'documents';
    } else if (fileType.includes('excel') || fileType.includes('spreadsheet')) {
      typeFolder = 'spreadsheets';
    } else if (fileType.includes('video')) {
      typeFolder = 'videos';
    }
    
    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create the final folder path: main folder + type subfolder
    // This ensures all files are organized by type within the main folder
    const mainFolder = folder && folder.trim() ? folder : null;
    
    // Check if folder exists, if not create it
    if (saveToDb && mainFolder) {
      try {
        const folderExists = await query(
          `SELECT COUNT(*) as count FROM documents WHERE folder_path = $1`,
          [mainFolder]
        );
        
        if (parseInt(folderExists.rows[0].count) === 0) {
          // Create folder if it doesn't exist
          await query(
            `INSERT INTO documents 
             (name, file_type, file_size, category, uploaded_by, description, folder_path, is_public) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [
              '.folder',
              'folder',
              '0 KB',
              'System',
              uploadedBy,
              `System folder: ${mainFolder}`,
              mainFolder,
              true
            ]
          );
          console.log('Created new folder in database:', mainFolder);
        }
      } catch (folderError) {
        console.error('Error checking/creating folder:', folderError);
        // Continue with upload even if folder creation fails
      }
    }
    
    // Determine Cloudinary folder path
    let cloudinaryFolder = null;
    if (mainFolder) {
      cloudinaryFolder = `${mainFolder}/${typeFolder}`;
    }
    
    console.log('File type:', fileType);
    console.log('Uploading to Cloudinary folder:', cloudinaryFolder || 'root');

    // Upload to Cloudinary with the specified folder (or root if no folder)
    const result = await uploadToCloudinary(buffer, cloudinaryFolder);
    
    // Save to database if requested
    if (saveToDb) {
      try {
        const dbResult = await query(
          `INSERT INTO documents 
           (name, file_type, file_size, file_url, file_public_id, category, uploaded_by, description, folder_path, is_public) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
           RETURNING *`,
          [file.name, fileType, fileSize, result.url, result.public_id, category, uploadedBy, description, mainFolder, isPublic]
        );
        
        console.log('File saved to database with ID:', dbResult.rows[0].id);
        
        // Return database record along with upload result
        return NextResponse.json({
          ...result,
          dbRecord: dbResult.rows[0]
        });
      } catch (dbError) {
        console.error('Error saving to database:', dbError);
        // Return upload result even if database save fails
        return NextResponse.json({
          ...result,
          dbError: 'Failed to save to database, but file was uploaded successfully'
        });
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in upload API:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { publicId } = await request.json();
    
    if (!publicId) {
      return NextResponse.json(
        { error: 'No public_id provided' },
        { status: 400 }
      );
    }

    // Delete from Cloudinary
    const result = await deleteFromCloudinary(publicId);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in delete API:', error);
    return NextResponse.json(
      { error: 'Failed to delete file' },
      { status: 500 }
    );
  }
}