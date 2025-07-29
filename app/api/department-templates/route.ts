import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET() {
  try {
    const result = await query(`
      SELECT 
        id, 
        name, 
        description, 
        icon, 
        color,
        sort_order,
        is_active
      FROM department_templates 
      WHERE is_active = true
      ORDER BY sort_order, name
    `)
    
    return NextResponse.json({
      success: true,
      data: result.rows,
      total: result.rows.length
    })
  } catch (error) {
    console.error('Error fetching department templates:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch department templates',
        data: []
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { name, description, icon, color, sort_order } = data
    
    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Tên phòng ban là bắt buộc' },
        { status: 400 }
      )
    }
    
    const result = await query(`
      INSERT INTO department_templates (name, description, icon, color, sort_order)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [name, description || '', icon || 'Building', color || 'gray', sort_order || 99])
    
    return NextResponse.json({
      success: true,
      data: result.rows[0],
      message: 'Tạo mẫu phòng ban thành công'
    })
  } catch (error: any) {
    console.error('Error creating department template:', error)
    
    if (error.code === '23505') { // Unique constraint violation
      return NextResponse.json(
        { success: false, error: 'Tên phòng ban đã tồn tại' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { success: false, error: 'Không thể tạo mẫu phòng ban' },
      { status: 500 }
    )
  }
}