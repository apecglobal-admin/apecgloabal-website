import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(request: Request) {
  try {
    // Kiểm tra số lượng bản ghi trong các bảng
    const tables = [
      'permissions', 'notifications', 'dashboard_widgets', 
      'activity_logs', 'settings', 'documents', 'departments',
      'employees', 'projects', 'reports', 'users'
    ];
    
    const counts = {};
    
    for (const table of tables) {
      try {
        const result = await query(`SELECT COUNT(*) FROM ${table}`);
        counts[table] = result.rows[0].count;
      } catch (error) {
        console.error(`Lỗi khi đếm bản ghi trong bảng ${table}:`, error);
        counts[table] = 'error';
      }
    }
    
    // Kiểm tra dữ liệu trong bảng permissions
    const permissions = await query('SELECT * FROM permissions LIMIT 5');
    
    // Kiểm tra dữ liệu trong bảng documents
    const documents = await query('SELECT * FROM documents LIMIT 5');
    
    // Kiểm tra dữ liệu trong bảng users
    const users = await query('SELECT * FROM users LIMIT 5');
    
    return NextResponse.json({
      message: 'Kiểm tra dữ liệu thành công',
      counts,
      permissions: permissions.rows,
      documents: documents.rows,
      users: users.rows
    });
  } catch (error) {
    console.error('Lỗi khi kiểm tra dữ liệu:', error);
    return NextResponse.json(
      { error: 'Lỗi khi kiểm tra dữ liệu' },
      { status: 500 }
    );
  }
}