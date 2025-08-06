import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const migrationsDir = path.join(process.cwd(), 'migrations');
    
    // Đọc tất cả file migration
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();

    const results = [];

    for (const file of migrationFiles) {
      try {
        const filePath = path.join(migrationsDir, file);
        const sql = fs.readFileSync(filePath, 'utf8');
        
        // Thực thi migration
        await query(sql);
        results.push({ file, status: 'success' });
        console.log(`Migration ${file} executed successfully`);
      } catch (error) {
        console.error(`Error executing migration ${file}:`, error);
        results.push({ file, status: 'error', error: error.message });
      }
    }

    return NextResponse.json({
      message: 'Migrations completed',
      results
    });

  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json(
      { error: 'Lỗi khi chạy migration' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Kiểm tra trạng thái database
    const tablesResult = await query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    const tables = tablesResult.rows.map(row => row.table_name);

    // Kiểm tra xem bảng reports có tồn tại không
    const reportsExists = tables.includes('reports');
    
    let reportsCount = 0;
    if (reportsExists) {
      const countResult = await query('SELECT COUNT(*) as count FROM reports');
      reportsCount = parseInt(countResult.rows[0].count);
    }

    return NextResponse.json({
      database_connected: true,
      tables,
      reports_table_exists: reportsExists,
      reports_count: reportsCount
    });

  } catch (error) {
    console.error('Database check error:', error);
    return NextResponse.json(
      { 
        database_connected: false,
        error: error.message 
      },
      { status: 500 }
    );
  }
}