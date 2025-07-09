import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { documentIds, targetFolder } = await request.json();
    
    if (!documentIds || !documentIds.length) {
      return NextResponse.json(
        { error: 'No documents specified' },
        { status: 400 }
      );
    }
    
    if (targetFolder === undefined) {
      return NextResponse.json(
        { error: 'Target folder is required' },
        { status: 400 }
      );
    }
    
    console.log(`Moving ${documentIds.length} documents to folder: ${targetFolder || 'root'}`);
    
    // Check if target folder exists (if not root)
    if (targetFolder) {
      const folderExists = await query(
        `SELECT COUNT(*) as count FROM documents WHERE folder_path = $1`,
        [targetFolder]
      );
      
      if (parseInt(folderExists.rows[0].count) === 0) {
        // Create the folder if it doesn't exist
        await query(
          `INSERT INTO documents 
           (name, file_type, file_size, category, uploaded_by, description, folder_path, is_public) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [
            '.folder',
            'folder',
            '0 KB',
            'System',
            1, // Default to admin
            `System folder: ${targetFolder}`,
            targetFolder,
            true
          ]
        );
        console.log('Created target folder:', targetFolder);
      }
    }
    
    // Update documents with new folder path
    const result = await query(
      `UPDATE documents 
       SET folder_path = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = ANY($2::int[])
       RETURNING *`,
      [targetFolder || '', documentIds]
    );
    
    console.log(`Moved ${result.rowCount} documents to folder: ${targetFolder || 'root'}`);
    
    return NextResponse.json({
      success: true,
      movedCount: result.rowCount,
      documents: result.rows
    });
  } catch (error) {
    console.error('Error moving documents:', error);
    return NextResponse.json(
      { error: `Failed to move documents: ${error.message}` },
      { status: 500 }
    );
  }
}