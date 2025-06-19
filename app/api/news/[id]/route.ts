import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

// GET /api/news/[id] - Lấy chi tiết tin tức
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // Lấy chi tiết tin tức
    const result = await query(
      `SELECT n.*, a.name as author_name, a.avatar_url as author_avatar
       FROM news n
       LEFT JOIN authors a ON n.author_id = a.id
       WHERE n.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Không tìm thấy tin tức' }, { status: 404 });
    }

    // Tăng lượt xem
    await query('UPDATE news SET view_count = view_count + 1 WHERE id = $1', [id]);

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error getting news:', error);
    return NextResponse.json(
      { error: 'Lỗi server' },
      { status: 500 }
    );
  }
}

// PUT /api/news/[id] - Cập nhật tin tức (chỉ admin hoặc editor)
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  // Kiểm tra xác thực
  const authResult = await requireAuth(request);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const { user } = authResult;
  const id = params.id;
  
  // Kiểm tra quyền admin hoặc editor
  if (user.role !== 'admin' && user.role !== 'editor') {
    return NextResponse.json({ error: 'Không có quyền truy cập' }, { status: 403 });
  }

  try {
    // Kiểm tra tin tức tồn tại
    const newsResult = await query('SELECT * FROM news WHERE id = $1', [id]);
    if (newsResult.rows.length === 0) {
      return NextResponse.json({ error: 'Không tìm thấy tin tức' }, { status: 404 });
    }

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

    // Xây dựng câu truy vấn cập nhật
    let updateQuery = 'UPDATE news SET updated_at = NOW()';
    const queryParams: any[] = [];
    let paramIndex = 1;

    if (title !== undefined) {
      updateQuery += `, title = $${paramIndex}`;
      queryParams.push(title);
      paramIndex++;
    }

    if (excerpt !== undefined) {
      updateQuery += `, excerpt = $${paramIndex}`;
      queryParams.push(excerpt);
      paramIndex++;
    }

    if (content !== undefined) {
      updateQuery += `, content = $${paramIndex}`;
      queryParams.push(content);
      paramIndex++;
    }

    if (category !== undefined) {
      updateQuery += `, category = $${paramIndex}`;
      queryParams.push(category);
      paramIndex++;
    }

    if (author_id !== undefined) {
      updateQuery += `, author_id = $${paramIndex}`;
      queryParams.push(author_id);
      paramIndex++;
    }

    if (featured !== undefined) {
      updateQuery += `, featured = $${paramIndex}`;
      queryParams.push(featured);
      paramIndex++;
    }

    if (published !== undefined) {
      updateQuery += `, published = $${paramIndex}`;
      queryParams.push(published);
      paramIndex++;

      // Nếu đang xuất bản lần đầu, cập nhật thời gian xuất bản
      if (published && !newsResult.rows[0].published_at) {
        updateQuery += `, published_at = NOW()`;
      }
    }

    if (image_url !== undefined) {
      updateQuery += `, image_url = $${paramIndex}`;
      queryParams.push(image_url);
      paramIndex++;
    }

    if (tags !== undefined) {
      updateQuery += `, tags = $${paramIndex}`;
      queryParams.push(tags);
      paramIndex++;
    }

    // Thêm điều kiện WHERE
    updateQuery += ` WHERE id = $${paramIndex} RETURNING *`;
    queryParams.push(id);

    // Thực hiện cập nhật
    const result = await query(updateQuery, queryParams);

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating news:', error);
    return NextResponse.json(
      { error: 'Lỗi server' },
      { status: 500 }
    );
  }
}

// DELETE /api/news/[id] - Xóa tin tức (chỉ admin)
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  // Kiểm tra xác thực
  const authResult = await requireAuth(request);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const { user } = authResult;
  const id = params.id;
  
  // Chỉ admin mới có thể xóa tin tức
  if (user.role !== 'admin') {
    return NextResponse.json({ error: 'Không có quyền truy cập' }, { status: 403 });
  }

  try {
    // Kiểm tra tin tức tồn tại
    const newsResult = await query('SELECT * FROM news WHERE id = $1', [id]);
    if (newsResult.rows.length === 0) {
      return NextResponse.json({ error: 'Không tìm thấy tin tức' }, { status: 404 });
    }

    // Xóa tin tức
    await query('DELETE FROM news WHERE id = $1', [id]);

    return NextResponse.json({ message: 'Xóa tin tức thành công' });
  } catch (error) {
    console.error('Error deleting news:', error);
    return NextResponse.json(
      { error: 'Lỗi server' },
      { status: 500 }
    );
  }
}