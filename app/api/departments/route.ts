import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const companyId = searchParams.get('company_id')
    
    let result
    if (companyId) {
      // Lấy phòng ban theo company_id từ view mới
      result = await query(`
        SELECT * FROM departments_view
        WHERE company_id = $1
        ORDER BY name
      `, [companyId])
    } else {
      // Lấy tất cả phòng ban từ view mới
      result = await query(`
        SELECT * FROM departments_view
        ORDER BY company_name, name
      `)
    }
    
    return NextResponse.json({
      success: true,
      data: result.rows,
      total: result.rows.length
    })
  } catch (error) {
    console.error('Error fetching departments:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch departments',
        data: []
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { company_id, department_template_id, manager_id, location, phone, email, budget, notes } = data
    
    // Validate required fields
    if (!company_id || !department_template_id) {
      return NextResponse.json(
        { success: false, error: 'Company ID và Department Template ID là bắt buộc' },
        { status: 400 }
      )
    }
    
    // Kiểm tra xem công ty đã có phòng ban này chưa
    const existing = await query(`
      SELECT id FROM company_departments 
      WHERE company_id = $1 AND department_template_id = $2
    `, [company_id, department_template_id])
    
    if (existing.rows.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Công ty này đã có phòng ban này rồi' },
        { status: 400 }
      )
    }
    
    const result = await query(`
      INSERT INTO company_departments (
        company_id, 
        department_template_id, 
        manager_id, 
        location, 
        phone, 
        email, 
        budget, 
        notes,
        status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'active')
      RETURNING *
    `, [company_id, department_template_id, manager_id || null, location, phone, email, budget || 0, notes])
    
    // Lấy thông tin đầy đủ từ view
    const fullData = await query(`
      SELECT * FROM departments_view WHERE id = $1
    `, [result.rows[0].id])
    
    return NextResponse.json({
      success: true,
      data: fullData.rows[0],
      message: 'Tạo phòng ban thành công'
    })
  } catch (error: any) {
    console.error('Error creating department:', error)
    
    if (error.code === '23505') { // Unique constraint violation
      return NextResponse.json(
        { success: false, error: 'Công ty này đã có phòng ban này rồi' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { success: false, error: 'Không thể tạo phòng ban' },
      { status: 500 }
    )
  }
}