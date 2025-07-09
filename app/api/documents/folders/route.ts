import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET all folders
export async function GET(request: NextRequest) {
  try {
    // Get folders from database
    const result = await query(`
      SELECT 
        folder_path, 
        COUNT(*) as document_count 
      FROM 
        documents 
      WHERE 
        folder_path IS NOT NULL AND folder_path != '' 
      GROUP BY 
        folder_path 
      ORDER BY 
        folder_path
    `);
    
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching folders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch folders' },
      { status: 500 }
    );
  }
}

// POST to create a new folder
export async function POST(request: NextRequest) {
  try {
    console.log('Create folder API called');
    
    const { folderName, createdBy } = await request.json();
    
    console.log('Create folder params:', { folderName, createdBy });
    
    if (!folderName) {
      console.error('Missing folder name in request');
      return NextResponse.json(
        { error: 'Folder name is required' },
        { status: 400 }
      );
    }
    
    // Sanitize folder name (remove leading/trailing slashes)
    const sanitizedFolderName = folderName.replace(/^\/+|\/+$/g, '');
    
    console.log('Sanitized folder name:', sanitizedFolderName);
    
    // Check if folder already exists
    const existingFolder = await query(
      `SELECT COUNT(*) as count FROM documents WHERE folder_path = $1`,
      [sanitizedFolderName]
    );
    
    if (parseInt(existingFolder.rows[0].count) > 0) {
      console.log('Folder already exists:', sanitizedFolderName);
      
      // Instead of returning an error, we'll return success with the existing folder
      return NextResponse.json({
        folderName: sanitizedFolderName,
        created: false,
        exists: true,
        message: 'Folder already exists'
      });
    }
    
    console.log('Creating new folder in database:', sanitizedFolderName);
    
    // Create a placeholder document to represent the folder
    // This is a workaround since we don't have a separate folders table
    const result = await query(
      `INSERT INTO documents 
       (name, file_type, file_size, category, uploaded_by, description, folder_path, is_public) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING *`,
      [
        '.folder', // Special name to indicate this is a folder placeholder
        'folder',
        '0 KB',
        'System',
        createdBy || 1, // Default to admin if not specified
        `System folder: ${sanitizedFolderName}`,
        sanitizedFolderName,
        true
      ]
    );
    
    console.log('Folder created successfully with ID:', result.rows[0].id);
    
    return NextResponse.json({
      folderName: sanitizedFolderName,
      created: true,
      id: result.rows[0].id
    });
  } catch (error) {
    console.error('Error creating folder:', error);
    return NextResponse.json(
      { error: `Failed to create folder: ${error.message}` },
      { status: 500 }
    );
  }
}

// DELETE to remove a folder and its contents
export async function DELETE(request: NextRequest) {
  try {
    const { folderPath } = await request.json();
    
    if (!folderPath) {
      return NextResponse.json(
        { error: 'Folder path is required' },
        { status: 400 }
      );
    }
    
    // Get all documents in the folder to delete from Cloudinary
    const documents = await query(
      `SELECT * FROM documents WHERE folder_path = $1`,
      [folderPath]
    );
    
    // Delete all documents in the folder
    await query(
      `DELETE FROM documents WHERE folder_path = $1`,
      [folderPath]
    );
    
    return NextResponse.json({
      success: true,
      deletedCount: documents.rows.length
    });
  } catch (error) {
    console.error('Error deleting folder:', error);
    return NextResponse.json(
      { error: 'Failed to delete folder' },
      { status: 500 }
    );
  }
}