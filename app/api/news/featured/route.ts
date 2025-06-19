import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET /api/news/featured - Lấy tin tức nổi bật
export async function GET(request: Request) {
  try {
    // Lấy tham số truy vấn
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '5');

    // Lấy tin tức nổi bật
    const result = await query(
      `SELECT n.*, a.name as author_name, a.avatar_url as author_avatar
       FROM news n
       LEFT JOIN authors a ON n.author_id = a.id
       WHERE n.published = true AND n.featured = true
       ORDER BY n.published_at DESC
       LIMIT $1`,
      [limit]
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error getting featured news:', error);
    return NextResponse.json(
      { error: 'Lỗi server' },
      { status: 500 }
    );
  }
}