import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function POST() {
  try {
    // Get first company ID (ApecGlobal or first available)
    const companiesResult = await query('SELECT id FROM companies ORDER BY id LIMIT 1')
    
    if (companiesResult.rows.length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'No companies found. Please create a company first.' 
        },
        { status: 400 }
      )
    }
    
    const companyId = companiesResult.rows[0].id
    
    // Sample services data
    const services = [
      {
        title: 'Phát Triển Phần Mềm',
        slug: 'phat-trien-phan-mem',
        description: 'Thiết kế và phát triển ứng dụng web, mobile, desktop với công nghệ hiện đại và quy trình chuyên nghiệp',
        features: ['Web Apps', 'Mobile Apps', 'Desktop Apps', 'API Development'],
        icon: 'code',
        category: 'Development',
        price_range: 'Từ 50 triệu đồng',
        is_featured: true
      },
      {
        title: 'Tư Vấn Công Nghệ',
        slug: 'tu-van-cong-nghe',
        description: 'Tư vấn chiến lược công nghệ, chuyển đổi số và tối ưu hóa quy trình kinh doanh',
        features: ['Digital Transform', 'Tech Strategy', 'Process Optimization', 'IT Consulting'],
        icon: 'briefcase',
        category: 'Consulting',
        price_range: 'Liên hệ báo giá',
        is_featured: true
      },
      {
        title: 'Cloud & DevOps',
        slug: 'cloud-devops',
        description: 'Triển khai và quản lý hạ tầng cloud, CI/CD pipeline và monitoring hệ thống',
        features: ['AWS/Azure', 'CI/CD', 'Docker/Kubernetes', 'Monitoring'],
        icon: 'server',
        category: 'Infrastructure',
        price_range: 'Từ 30 triệu đồng/tháng',
        is_featured: true
      },
      {
        title: 'AI & Data Analytics',
        slug: 'ai-data-analytics',
        description: 'Phân tích dữ liệu, xây dựng mô hình machine learning và trí tuệ nhân tạo',
        features: ['ML Models', 'Data Visualization', 'Predictive Analytics', 'Big Data'],
        icon: 'barchart3',
        category: 'AI/ML',
        price_range: 'Từ 100 triệu đồng',
        is_featured: true
      },
      {
        title: 'Bảo Mật & Audit',
        slug: 'bao-mat-audit',
        description: 'Đánh giá bảo mật, penetration testing và đảm bảo tuân thủ các tiêu chuẩn',
        features: ['Security Assessment', 'Penetration Testing', 'Compliance', 'Security Training'],
        icon: 'shield',
        category: 'Security',
        price_range: 'Từ 40 triệu đồng',
        is_featured: true
      },
      {
        title: 'UI/UX Design',
        slug: 'ui-ux-design',
        description: 'Thiết kế giao diện người dùng và trải nghiệm người dùng chuyên nghiệp',
        features: ['User Research', 'Wireframing', 'Prototyping', 'Design System'],
        icon: 'smartphone',
        category: 'Design',
        price_range: 'Từ 20 triệu đồng',
        is_featured: false
      },
      {
        title: 'Database Management',
        slug: 'database-management',
        description: 'Quản lý và tối ưu hóa cơ sở dữ liệu, backup và recovery',
        features: ['Database Design', 'Performance Tuning', 'Backup/Recovery', 'Migration'],
        icon: 'database',
        category: 'Database',
        price_range: 'Từ 25 triệu đồng',
        is_featured: false
      },
      {
        title: 'Technical Support',
        slug: 'technical-support',
        description: 'Hỗ trợ kỹ thuật 24/7, bảo trì và nâng cấp hệ thống',
        features: ['24/7 Support', 'System Maintenance', 'Bug Fixing', 'Updates'],
        icon: 'headphones',
        category: 'Support',
        price_range: 'Từ 15 triệu đồng/tháng',
        is_featured: false
      }
    ]
    
    // Insert services
    const insertedServices = []
    for (const service of services) {
      const result = await query(`
        INSERT INTO services (
          title, slug, description, features, icon, category, price_range, is_featured, company_id
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (slug) DO UPDATE
        SET title = EXCLUDED.title,
            description = EXCLUDED.description,
            features = EXCLUDED.features,
            icon = EXCLUDED.icon,
            category = EXCLUDED.category,
            price_range = EXCLUDED.price_range,
            is_featured = EXCLUDED.is_featured,
            updated_at = CURRENT_TIMESTAMP
        RETURNING *
      `, [
        service.title,
        service.slug,
        service.description,
        JSON.stringify(service.features),
        service.icon,
        service.category,
        service.price_range,
        service.is_featured,
        companyId
      ])
      
      insertedServices.push(result.rows[0])
    }
    
    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${insertedServices.length} services`,
      data: insertedServices
    })
  } catch (error) {
    console.error('Error seeding services:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to seed services',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}