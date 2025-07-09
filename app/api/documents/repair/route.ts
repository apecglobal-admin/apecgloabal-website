import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    // Get repair options from request
    const { fixFolders = true, fixCategories = true, fixMissingFields = true } = await request.json();
    
    const results = {
      fixedFolders: 0,
      fixedCategories: 0,
      fixedMissingFields: 0,
      errors: []
    };
    
    // Start transaction
    await query('BEGIN');
    
    try {
      // 1. Fix empty folder paths (replace with null)
      if (fixFolders) {
        const fixFoldersResult = await query(`
          UPDATE documents 
          SET folder_path = NULL 
          WHERE folder_path = '' OR folder_path = '/'
          RETURNING id
        `);
        
        results.fixedFolders = fixFoldersResult.rows.length;
      }
      
      // 2. Fix empty categories (set to 'Uncategorized')
      if (fixCategories) {
        const fixCategoriesResult = await query(`
          UPDATE documents 
          SET category = 'Uncategorized' 
          WHERE category IS NULL OR category = ''
          RETURNING id
        `);
        
        results.fixedCategories = fixCategoriesResult.rows.length;
      }
      
      // 3. Fix missing fields (set defaults for any NULL values)
      if (fixMissingFields) {
        const fixMissingFieldsResult = await query(`
          UPDATE documents 
          SET 
            file_type = COALESCE(file_type, 'application/octet-stream'),
            file_size = COALESCE(file_size, '0 KB'),
            is_public = COALESCE(is_public, false),
            download_count = COALESCE(download_count, 0),
            description = COALESCE(description, ''),
            updated_at = NOW()
          WHERE 
            file_type IS NULL OR 
            file_size IS NULL OR 
            is_public IS NULL OR 
            download_count IS NULL OR 
            description IS NULL
          RETURNING id
        `);
        
        results.fixedMissingFields = fixMissingFieldsResult.rows.length;
      }
      
      // Commit transaction
      await query('COMMIT');
    } catch (error) {
      // Rollback transaction on error
      await query('ROLLBACK');
      throw error;
    }
    
    return NextResponse.json({
      success: true,
      results,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error repairing documents table:', error);
    return NextResponse.json(
      { 
        error: `Failed to repair documents table: ${error.message}`,
        success: false
      },
      { status: 500 }
    );
  }
}