import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({
        success: false,
        message: 'Không tìm thấy file'
      }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ['text/csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({
        success: false,
        message: 'Chỉ hỗ trợ file CSV hoặc Excel (.xlsx)'
      }, { status: 400 })
    }

    // Read file content
    const fileContent = await file.text()
    
    // Parse CSV (simple implementation)
    const lines = fileContent.split('\n').filter(line => line.trim())
    const headers = lines[0].split(',')
    
    // Validate headers
    const requiredHeaders = ['Tên dự án*', 'ID Công ty*']
    const missingHeaders = requiredHeaders.filter(header => 
      !headers.some(h => h.trim() === header)
    )
    
    if (missingHeaders.length > 0) {
      return NextResponse.json({
        success: false,
        message: `Thiếu cột bắt buộc: ${missingHeaders.join(', ')}`
      }, { status: 400 })
    }

    // Process data rows
    const dataRows = lines.slice(1)
    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[]
    }

    for (let i = 0; i < dataRows.length; i++) {
      const row = dataRows[i].split(',')
      const rowData = {
        name: row[0]?.trim(),
        description: row[1]?.trim() || "",
        company_id: row[2]?.trim(),
        manager_id: row[3]?.trim() || null,
        start_date: row[4]?.trim() || null,
        end_date: row[5]?.trim() || null,
        budget: parseFloat(row[6]?.trim() || "0"),
        status: row[7]?.trim() || "Nghiên cứu",
        priority: row[8]?.trim() || "Trung bình"
      }

      // Validate required fields
      if (!rowData.name || !rowData.company_id) {
        results.failed++
        results.errors.push(`Dòng ${i + 2}: Thiếu tên dự án hoặc ID công ty`)
        continue
      }

      try {
        // Here you would normally save to database
        // For now, we'll just simulate success
        console.log('Would create project:', rowData)
        results.success++
      } catch (error) {
        results.failed++
        results.errors.push(`Dòng ${i + 2}: Lỗi khi tạo dự án - ${error}`)
      }
    }

    return NextResponse.json({
      success: true,
      results
    })

  } catch (error) {
    console.error('Import error:', error)
    return NextResponse.json({
      success: false,
      message: 'Có lỗi xảy ra khi xử lý file'
    }, { status: 500 })
  }
}