import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET - Lấy danh sách tin tức
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    
    const offset = (page - 1) * limit;
    
    let whereClause = 'WHERE 1=1';
    const params: any[] = [];
    
    if (category) {
      whereClause += ` AND category = $${params.length + 1}`;
      params.push(category);
    }
    
    if (status) {
      whereClause += ` AND published = $${params.length + 1}`;
      params.push(status === 'published');
    }
    
    // Lấy danh sách tin tức
    const newsQuery = `
      SELECT n.*, a.name as author_name, a.avatar_url as author_avatar
      FROM news n
      LEFT JOIN authors a ON n.author_id = a.id
      ${whereClause}
      ORDER BY n.created_at DESC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `;
    
    params.push(limit, offset);
    
    const result = await query(newsQuery, params);
    
    // Lấy tổng số tin tức
    const countQuery = `
      SELECT COUNT(*) as total
      FROM news n
      ${whereClause}
    `;
    
    const countResult = await query(countQuery, params.slice(0, -2));
    const total = parseInt(countResult.rows[0].total);
    
    return NextResponse.json({
      success: true,
      data: result.rows,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { success: false, error: 'Lỗi khi tải tin tức' },
      { status: 500 }
    );
  }
}

// POST - Tạo tin tức mới
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      excerpt,
      content,
      category,
      tags,
      featured = false,
      published = false,
      author_id = 1 // Sẽ lấy từ session sau
    } = body;
    
    // Validate dữ liệu
    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: 'Thiếu thông tin bắt buộc' },
        { status: 400 }
      );
    }
    
    // Tạo slug từ title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    
    // Thêm tin tức mới
    const insertQuery = `
      INSERT INTO news (
        title, slug, excerpt, content, category, tags, featured, published, author_id,
        published_at, created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW()
      )
      RETURNING *
    `;
    
    const publishedAt = published ? new Date().toISOString() : null;
    
    const result = await query(insertQuery, [
      title,
      slug,
      excerpt,
      content,
      category,
      tags,
      featured,
      published,
      author_id,
      publishedAt
    ]);
    
    return NextResponse.json({
      success: true,
      data: result.rows[0],
      message: 'Tin tức đã được tạo thành công'
    });
  } catch (error) {
    console.error('Error creating news:', error);
    return NextResponse.json(
      { success: false, error: 'Lỗi khi tạo tin tức' },
      { status: 500 }
    );
  }
}