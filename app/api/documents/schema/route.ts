import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Get table schema
    const schemaResult = await query(`
      SELECT 
        column_name, 
        data_type, 
        character_maximum_length,
        column_default,
        is_nullable
      FROM 
        information_schema.columns
      WHERE 
        table_name = 'documents'
      ORDER BY 
        ordinal_position
    `);
    
    // Get table constraints
    const constraintsResult = await query(`
      SELECT
        tc.constraint_name,
        tc.constraint_type,
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
      FROM
        information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu
          ON tc.constraint_name = kcu.constraint_name
          AND tc.table_schema = kcu.table_schema
        LEFT JOIN information_schema.constraint_column_usage ccu
          ON ccu.constraint_name = tc.constraint_name
          AND ccu.table_schema = tc.table_schema
      WHERE
        tc.table_name = 'documents'
    `);
    
    // Get table indexes
    const indexesResult = await query(`
      SELECT
        indexname,
        indexdef
      FROM
        pg_indexes
      WHERE
        tablename = 'documents'
    `);
    
    // Get row count
    const countResult = await query(`
      SELECT COUNT(*) FROM documents
    `);
    
    return NextResponse.json({
      columns: schemaResult.rows,
      constraints: constraintsResult.rows,
      indexes: indexesResult.rows,
      rowCount: parseInt(countResult.rows[0].count),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching documents schema:', error);
    return NextResponse.json(
      { error: `Failed to fetch documents schema: ${error.message}` },
      { status: 500 }
    );
  }
}