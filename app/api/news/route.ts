import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

// GET /api/news - Lấy danh sách tin tức
export async function GET(request: Request) {
  try {
    // Lấy tham số truy vấn
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const featured = searchParams.get('featured') === 'true';
    const offset = (page - 1) * limit;

    // Xây dựng câu truy vấn
    let queryText = `
      SELECT n.*, a.name as author_name 
      FROM news n
      LEFT JOIN authors a ON n.author_id = a.id
      WHERE n.published = true
    `;
    const queryParams: any[] = [];
    let paramIndex = 1;

    if (category) {
      queryText += ` AND n.category = $${paramIndex}`;
      queryParams.push(category);
      paramIndex++;
    }

    if (featured) {
      queryText += ` AND n.featured = true`;
    }

    // Thêm sắp xếp và phân trang
    queryText += ` ORDER BY n.published_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    queryParams.push(limit, offset);

    // Thực hiện truy vấn
    const result = await query(queryText, queryParams);

    // Lấy tổng số tin tức
    let countQueryText = `
      SELECT COUNT(*) FROM news n
      WHERE n.published = true
    `;
    let countParams: any[] = [];
    paramIndex = 1;

    if (category) {
      countQueryText += ` AND n.category = $${paramIndex}`;
      countParams.push(category);
      paramIndex++;
    }

    if (featured) {
      countQueryText += ` AND n.featured = true`;
    }

    const countResult = await query(countQueryText, countParams);
    const totalCount = parseInt(countResult.rows[0].count);

    return NextResponse.json({
      news: result.rows,
      pagination: {
        total: totalCount,
        page,
        limit,
        pages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    console.error('Error getting news:', error);
    return NextResponse.json(
      { error: 'Lỗi server' },
      { status: 500 }
    );
  }
}

// POST /api/news - Tạo tin tức mới (chỉ admin hoặc editor)
export async function POST(request: Request) {
  // Kiểm tra xác thực
  const authResult = await requireAuth(request);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const { user } = authResult;
  
  // Kiểm tra quyền admin hoặc editor
  if (user.role !== 'admin' && user.role !== 'editor') {
    return NextResponse.json({ error: 'Không có quyền truy cập' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { 
      title, 
      excerpt, 
      content, 
      category, 
      author_id, 
      featured, 
      published, 
      image_url, 
      tags 
    } = body;

    // Kiểm tra dữ liệu đầu vào
    if (!title || !content || !category) {
      return NextResponse.json(
        { error: 'Tiêu đề, nội dung và danh mục là bắt buộc' },
        { status: 400 }
      );
    }

    // Thêm tin tức mới
    const result = await query(
      `INSERT INTO news (
        title, excerpt, content, category, author_id, featured, published, 
        image_url, tags, published_at, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW()) 
      RETURNING *`,
      [
        title, 
        excerpt || title.substring(0, 150), 
        content, 
        category, 
        author_id || null, 
        featured || false, 
        published !== undefined ? published : true, 
        image_url || null, 
        tags || [],
        published ? new Date() : null
      ]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating news:', error);
    return NextResponse.json(
      { error: 'Lỗi server' },
      { status: 500 }
    );
  }
}