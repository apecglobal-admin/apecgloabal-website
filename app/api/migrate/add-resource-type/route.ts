import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST() {
  try {
    console.log('Running migration: Add resource_type column to documents table');
    
    // Add the column if it doesn't exist
    await query(`
      ALTER TABLE documents 
      ADD COLUMN IF NOT EXISTS resource_type VARCHAR(50) DEFAULT 'raw'
    `);
    
    // Update existing records to have 'raw' as default resource_type
    const updateResult = await query(`
      UPDATE documents 
      SET resource_type = 'raw' 
      WHERE resource_type IS NULL
    `);
    
    console.log('Migration completed successfully');
    console.log('Updated rows:', updateResult.rowCount);
    
    return NextResponse.json({
      success: true,
      message: 'Migration completed successfully',
      updatedRows: updateResult.rowCount
    });
  } catch (error) {
    console.error('Migration failed:', error);
    return NextResponse.json(
      { error: `Migration failed: ${error.message}` },
      { status: 500 }
    );
  }
}