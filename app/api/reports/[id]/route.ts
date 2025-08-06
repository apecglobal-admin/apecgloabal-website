import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET - Lấy chi tiết báo cáo
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const reportId = parseInt(params.id);

    if (isNaN(reportId)) {
      return NextResponse.json(
        { error: 'ID báo cáo không hợp lệ' },
        { status: 400 }
      );
    }

    const reportQuery = `
      SELECT 
        r.*,
        d.name as department_name,
        e.name as created_by_name,
        e.email as created_by_email,
        c.name as company_name
      FROM reports r
      LEFT JOIN departments d ON r.department_id = d.id
      LEFT JOIN employees e ON r.created_by = e.id
      LEFT JOIN companies c ON d.company_id = c.id
      WHERE r.id = $1
    `;

    const result = await query(reportQuery, [reportId]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Không tìm thấy báo cáo' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      report: result.rows[0]
    });

  } catch (error) {
    console.error('Error fetching report details:', error);
    return NextResponse.json(
      { error: 'Lỗi khi lấy chi tiết báo cáo' },
      { status: 500 }
    );
  }
}

// PUT - Cập nhật báo cáo
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const reportId = parseInt(params.id);
    const body = await request.json();

    if (isNaN(reportId)) {
      return NextResponse.json(
        { error: 'ID báo cáo không hợp lệ' },
        { status: 400 }
      );
    }

    const { title, type, description, status, file_url, file_size } = body;

    const updateQuery = `
      UPDATE reports 
      SET 
        title = COALESCE($1, title),
        type = COALESCE($2, type),
        description = COALESCE($3, description),
        status = COALESCE($4, status),
        file_url = COALESCE($5, file_url),
        file_size = COALESCE($6, file_size),
        updated_at = NOW()
      WHERE id = $7
      RETURNING *
    `;

    const result = await query(updateQuery, [
      title,
      type,
      description,
      status,
      file_url,
      file_size,
      reportId
    ]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Không tìm thấy báo cáo' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Cập nhật báo cáo thành công',
      report: result.rows[0]
    });

  } catch (error) {
    console.error('Error updating report:', error);
    return NextResponse.json(
      { error: 'Lỗi khi cập nhật báo cáo' },
      { status: 500 }
    );
  }
}

// DELETE - Xóa báo cáo
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const reportId = parseInt(params.id);

    if (isNaN(reportId)) {
      return NextResponse.json(
        { error: 'ID báo cáo không hợp lệ' },
        { status: 400 }
      );
    }

    const deleteQuery = 'DELETE FROM reports WHERE id = $1 RETURNING *';
    const result = await query(deleteQuery, [reportId]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Không tìm thấy báo cáo' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Xóa báo cáo thành công'
    });

  } catch (error) {
    console.error('Error deleting report:', error);
    return NextResponse.json(
      { error: 'Lỗi khi xóa báo cáo' },
      { status: 500 }
    );
  }
}