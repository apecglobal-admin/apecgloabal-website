import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET /api/positions/[id] - Lấy thông tin chức vụ theo ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'ID chức vụ không hợp lệ' },
        { status: 400 }
      );
    }

    const positionQuery = `
      SELECT 
        id,
        title,
        description,
        level,
        is_manager_position,
        is_active,
        created_at,
        updated_at
      FROM positions
      WHERE id = $1
    `;

    const result = await query(positionQuery, [id]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy chức vụ' },
        { status: 404 }
      );
    }

    const position = result.rows[0];

    return NextResponse.json({
      success: true,
      data: position
    });

  } catch (error) {
    console.error('Error fetching position:', error);
    return NextResponse.json(
      { success: false, error: 'Lỗi server khi lấy thông tin chức vụ' },
      { status: 500 }
    );
  }
}

// PUT /api/positions/[id] - Cập nhật chức vụ
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'ID chức vụ không hợp lệ' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const {
      title,
      description,
      level,
      is_manager_position,
      is_active
    } = body;

    if (!title?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Tên chức vụ không được để trống' },
        { status: 400 }
      );
    }

    // Kiểm tra trùng tên chức vụ (trừ chính nó)
    const existingPosition = await query(
      'SELECT id FROM positions WHERE title = $1 AND id != $2',
      [title.trim(), id]
    );

    if (existingPosition.rows.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Chức vụ này đã tồn tại' },
        { status: 400 }
      );
    }

    const updateQuery = `
      UPDATE positions SET
        title = $1,
        description = $2,
        level = $3,
        is_manager_position = $4,
        is_active = $5,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $6
      RETURNING *
    `;

    const values = [
      title.trim(),
      description?.trim() || null,
      level || 'staff',
      is_manager_position || false,
      is_active !== undefined ? is_active : true,
      id
    ];

    const result = await query(updateQuery, values);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy chức vụ để cập nhật' },
        { status: 404 }
      );
    }

    const updatedPosition = result.rows[0];

    return NextResponse.json({
      success: true,
      data: updatedPosition,
      message: 'Cập nhật chức vụ thành công'
    });

  } catch (error) {
    console.error('Error updating position:', error);
    return NextResponse.json(
      { success: false, error: 'Lỗi server khi cập nhật chức vụ' },
      { status: 500 }
    );
  }
}

// DELETE /api/positions/[id] - Xóa chức vụ
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'ID chức vụ không hợp lệ' },
        { status: 400 }
      );
    }

    // Kiểm tra xem có nhân viên nào đang sử dụng chức vụ này không
    const employeeCheck = await query(
      'SELECT COUNT(*) as count FROM employees WHERE position = (SELECT title FROM positions WHERE id = $1)',
      [id]
    );

    const employeeCount = parseInt(employeeCheck.rows[0].count);
    
    if (employeeCount > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Không thể xóa chức vụ này vì đang có ${employeeCount} nhân viên sử dụng. Vui lòng thay đổi chức vụ của họ trước khi xóa.` 
        },
        { status: 400 }
      );
    }

    const result = await query(
      'DELETE FROM positions WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy chức vụ để xóa' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Xóa chức vụ thành công'
    });

  } catch (error) {
    console.error('Error deleting position:', error);
    return NextResponse.json(
      { success: false, error: 'Lỗi server khi xóa chức vụ' },
      { status: 500 }
    );
  }
}