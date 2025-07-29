import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import fs from 'fs';
import path from 'path';

export async function POST() {
  try {
    // Đọc SQL script
    const sqlFile = path.join(process.cwd(), 'scripts', 'update-companies-table.sql');
    const sqlContent = fs.readFileSync(sqlFile, 'utf8');
    
    // Tách các câu lệnh SQL (split by semicolon)
    const sqlStatements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);
    
    // Chạy từng câu lệnh SQL
    const results = [];
    for (const statement of sqlStatements) {
      if (statement.trim()) {
        try {
          const result = await query(statement);
          results.push({
            statement: statement.substring(0, 100) + '...',
            success: true,
            rowsAffected: result.rowCount
          });
        } catch (error) {
          results.push({
            statement: statement.substring(0, 100) + '...',
            success: false,
            error: error.message
          });
        }
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Database updated successfully',
      results
    });
  } catch (error) {
    console.error('Error updating database:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}