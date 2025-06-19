const { Pool } = require('pg');

// Khởi tạo kết nối PostgreSQL
const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_JGyM4NXEfVS6@ep-tiny-poetry-a45r81hy-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require',
});

// Dữ liệu mẫu cho các dự án
const sampleProjects = [
  {
    name: 'AI Vision Analytics',
    slug: 'ai-vision-analytics',
    description: 'Hệ thống phân tích hình ảnh sử dụng trí tuệ nhân tạo để nhận diện và phân loại đối tượng trong thời gian thực.',
    company_id: 1,
    manager_id: 1,
    status: 'In Progress',
    priority: 'High',
    progress: 75,
    start_date: '2023-01-15',
    end_date: '2023-12-31',
    budget: 500000000,
    spent: 350000000,
    team_size: 8,
    technologies: ['Python', 'TensorFlow', 'OpenCV', 'AWS', 'React'],
    image_url: '/images/projects/ai-vision.jpg',
    features: [
      'Nhận diện đối tượng trong thời gian thực',
      'Phân tích hành vi người dùng',
      'Tích hợp với hệ thống an ninh',
      'Dashboard theo dõi và báo cáo',
      'API cho ứng dụng bên thứ ba'
    ],
    challenges: [
      'Xử lý dữ liệu lớn với độ trễ thấp',
      'Đảm bảo độ chính xác cao trong các điều kiện ánh sáng khác nhau',
      'Tối ưu hóa mô hình AI cho thiết bị edge'
    ],
    solutions: [
      'Sử dụng kiến trúc microservices để xử lý dữ liệu phân tán',
      'Áp dụng kỹ thuật transfer learning để cải thiện độ chính xác',
      'Tối ưu hóa mô hình với TensorFlow Lite cho thiết bị edge'
    ],
    results: [
      'Độ chính xác nhận diện đạt 95%',
      'Giảm 40% thời gian xử lý so với giải pháp truyền thống',
      'Tích hợp thành công với 5 hệ thống khác nhau'
    ]
  },
  {
    name: 'Smart Factory Automation',
    slug: 'smart-factory-automation',
    description: 'Giải pháp tự động hóa nhà máy thông minh sử dụng IoT và AI để tối ưu hóa quy trình sản xuất và giảm chi phí vận hành.',
    company_id: 2,
    manager_id: 2,
    status: 'Completed',
    priority: 'High',
    progress: 100,
    start_date: '2022-06-01',
    end_date: '2023-05-30',
    budget: 800000000,
    spent: 750000000,
    team_size: 12,
    technologies: ['IoT', 'Python', 'Node.js', 'MongoDB', 'Docker', 'Azure'],
    image_url: '/images/projects/smart-factory.jpg',
    features: [
      'Giám sát thiết bị theo thời gian thực',
      'Dự đoán bảo trì dựa trên AI',
      'Tối ưu hóa năng lượng tự động',
      'Quản lý chuỗi cung ứng thông minh',
      'Báo cáo hiệu suất và phân tích xu hướng'
    ],
    challenges: [
      'Tích hợp với hệ thống legacy đang hoạt động',
      'Đảm bảo hoạt động liên tục 24/7',
      'Bảo mật dữ liệu nhạy cảm của nhà máy'
    ],
    solutions: [
      'Phát triển các adapter tùy chỉnh cho hệ thống legacy',
      'Triển khai kiến trúc dự phòng với khả năng tự phục hồi',
      'Áp dụng mã hóa end-to-end và kiểm soát truy cập nghiêm ngặt'
    ],
    results: [
      'Giảm 30% chi phí vận hành',
      'Tăng 25% hiệu suất sản xuất',
      'Giảm 45% thời gian ngừng hoạt động do sự cố'
    ]
  },
  {
    name: 'FinTech AI Advisor',
    slug: 'fintech-ai-advisor',
    description: 'Nền tảng tư vấn tài chính sử dụng trí tuệ nhân tạo để phân tích dữ liệu thị trường và đưa ra các khuyến nghị đầu tư cá nhân hóa.',
    company_id: 1,
    manager_id: 3,
    status: 'In Progress',
    priority: 'Medium',
    progress: 60,
    start_date: '2023-03-10',
    end_date: '2024-02-28',
    budget: 600000000,
    spent: 320000000,
    team_size: 7,
    technologies: ['Python', 'Django', 'React', 'PostgreSQL', 'AWS', 'Machine Learning'],
    image_url: '/images/projects/fintech-advisor.jpg',
    features: [
      'Phân tích dữ liệu thị trường theo thời gian thực',
      'Tạo danh mục đầu tư cá nhân hóa',
      'Dự đoán xu hướng thị trường',
      'Quản lý rủi ro tự động',
      'Báo cáo hiệu suất đầu tư'
    ],
    challenges: [
      'Xử lý dữ liệu thị trường lớn và phức tạp',
      'Đảm bảo độ chính xác cao trong dự đoán',
      'Tuân thủ các quy định về bảo mật tài chính'
    ],
    solutions: [
      'Sử dụng Apache Kafka để xử lý dữ liệu theo thời gian thực',
      'Áp dụng mô hình ensemble learning để cải thiện độ chính xác',
      'Triển khai hệ thống tuân thủ tự động theo các quy định tài chính'
    ],
    results: [
      'Độ chính xác dự đoán đạt 82%',
      'Tăng 18% hiệu suất danh mục đầu tư',
      'Giảm 35% thời gian phân tích thị trường'
    ]
  },
  {
    name: 'Healthcare AI Diagnostics',
    slug: 'healthcare-ai-diagnostics',
    description: 'Hệ thống chẩn đoán y tế hỗ trợ bởi AI giúp bác sĩ phát hiện sớm các bệnh lý thông qua phân tích hình ảnh y tế và dữ liệu bệnh nhân.',
    company_id: 3,
    manager_id: 4,
    status: 'Planning',
    priority: 'High',
    progress: 25,
    start_date: '2023-09-01',
    end_date: '2024-08-31',
    budget: 900000000,
    spent: 150000000,
    team_size: 10,
    technologies: ['Python', 'TensorFlow', 'PyTorch', 'React', 'Node.js', 'MongoDB', 'Google Cloud'],
    image_url: '/images/projects/healthcare-ai.jpg',
    features: [
      'Phân tích hình ảnh X-quang, CT và MRI',
      'Dự đoán nguy cơ bệnh dựa trên dữ liệu bệnh nhân',
      'Hỗ trợ chẩn đoán theo thời gian thực',
      'Tích hợp với hệ thống quản lý bệnh viện',
      'Bảo mật dữ liệu y tế theo tiêu chuẩn HIPAA'
    ],
    challenges: [
      'Đảm bảo độ chính xác cao trong chẩn đoán',
      'Xử lý dữ liệu y tế đa dạng và phức tạp',
      'Tuân thủ các quy định nghiêm ngặt về dữ liệu y tế'
    ],
    solutions: [
      'Phát triển mô hình AI chuyên biệt cho từng loại hình ảnh y tế',
      'Áp dụng kỹ thuật federated learning để bảo vệ dữ liệu',
      'Triển khai hệ thống kiểm soát chất lượng và xác minh kết quả'
    ],
    results: [
      'Dự kiến giảm 40% thời gian chẩn đoán',
      'Dự kiến tăng 30% tỷ lệ phát hiện sớm bệnh lý',
      'Dự kiến giảm 25% chi phí chẩn đoán'
    ]
  },
  {
    name: 'Smart City Management',
    slug: 'smart-city-management',
    description: 'Nền tảng quản lý đô thị thông minh tích hợp IoT, AI và dữ liệu lớn để tối ưu hóa giao thông, năng lượng và an ninh công cộng.',
    company_id: 2,
    manager_id: 5,
    status: 'In Progress',
    priority: 'High',
    progress: 45,
    start_date: '2023-02-15',
    end_date: '2024-06-30',
    budget: 1200000000,
    spent: 480000000,
    team_size: 15,
    technologies: ['IoT', 'Big Data', 'AI', 'Cloud Computing', 'React', 'Node.js', 'PostgreSQL'],
    image_url: '/images/projects/smart-city.jpg',
    features: [
      'Quản lý giao thông thông minh',
      'Tối ưu hóa năng lượng công cộng',
      'Giám sát an ninh và phát hiện sự cố',
      'Quản lý chất thải và môi trường',
      'Dashboard tích hợp cho chính quyền'
    ],
    challenges: [
      'Tích hợp với hạ tầng đô thị hiện có',
      'Xử lý dữ liệu lớn từ hàng nghìn cảm biến',
      'Đảm bảo quyền riêng tư của người dân'
    ],
    solutions: [
      'Phát triển kiến trúc microservices có khả năng mở rộng',
      'Triển khai hệ thống xử lý dữ liệu phân tán',
      'Áp dụng kỹ thuật ẩn danh hóa dữ liệu'
    ],
    results: [
      'Giảm 20% thời gian di chuyển trong đô thị',
      'Tiết kiệm 15% năng lượng công cộng',
      'Giảm 25% tỷ lệ tội phạm đường phố'
    ]
  }
];

async function seedProjectsData() {
  const client = await pool.connect();
  
  try {
    // Bắt đầu transaction
    await client.query('BEGIN');
    
    // Kiểm tra xem bảng projects đã tồn tại chưa
    const checkTableResult = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'projects'
      )
    `);
    
    if (!checkTableResult.rows[0].exists) {
      console.log('Bảng projects chưa tồn tại. Tạo bảng mới...');
      
      // Tạo bảng projects nếu chưa tồn tại
      await client.query(`
        CREATE TABLE projects (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          slug VARCHAR(255) UNIQUE,
          description TEXT,
          company_id INTEGER,
          manager_id INTEGER,
          status VARCHAR(50),
          priority VARCHAR(50),
          progress INTEGER,
          start_date DATE,
          end_date DATE,
          budget NUMERIC,
          spent NUMERIC,
          team_size INTEGER,
          technologies TEXT[],
          image_url TEXT,
          gallery TEXT[],
          features TEXT[],
          challenges TEXT[],
          solutions TEXT[],
          results TEXT[],
          testimonials JSONB,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      
      console.log('Đã tạo bảng projects thành công.');
    } else {
      // Kiểm tra xem cột slug đã tồn tại chưa
      const checkColumnResult = await client.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'projects' AND column_name = 'slug'
      `);
      
      // Nếu cột slug chưa tồn tại, thêm vào
      if (checkColumnResult.rows.length === 0) {
        console.log('Thêm cột slug vào bảng projects...');
        await client.query(`
          ALTER TABLE projects 
          ADD COLUMN slug VARCHAR(255) UNIQUE
        `);
        console.log('Đã thêm cột slug thành công.');
      }
      
      // Kiểm tra các cột mở rộng khác
      const columns = ['image_url', 'gallery', 'features', 'challenges', 'solutions', 'results', 'testimonials'];
      
      for (const column of columns) {
        const checkColumnResult = await client.query(`
          SELECT column_name 
          FROM information_schema.columns 
          WHERE table_name = 'projects' AND column_name = $1
        `, [column]);
        
        if (checkColumnResult.rows.length === 0) {
          console.log(`Thêm cột ${column} vào bảng projects...`);
          
          let dataType = 'TEXT';
          if (column === 'gallery' || column === 'features' || column === 'challenges' || column === 'solutions' || column === 'results') {
            dataType = 'TEXT[]';
          } else if (column === 'testimonials') {
            dataType = 'JSONB';
          }
          
          await client.query(`
            ALTER TABLE projects 
            ADD COLUMN ${column} ${dataType}
          `);
          
          console.log(`Đã thêm cột ${column} thành công.`);
        }
      }
    }
    
    // Thêm dữ liệu mẫu
    console.log('Thêm dữ liệu mẫu vào bảng projects...');
    
    for (const project of sampleProjects) {
      // Kiểm tra xem dự án với slug này đã tồn tại chưa
      const checkProjectResult = await client.query(`
        SELECT id FROM projects WHERE slug = $1
      `, [project.slug]);
      
      if (checkProjectResult.rows.length === 0) {
        // Thêm dự án mới
        await client.query(`
          INSERT INTO projects (
            name, slug, description, company_id, manager_id, status, priority, 
            progress, start_date, end_date, budget, spent, team_size, 
            technologies, image_url, features, challenges, solutions, results
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19
          )
        `, [
          project.name, project.slug, project.description, project.company_id, 
          project.manager_id, project.status, project.priority, project.progress, 
          project.start_date, project.end_date, project.budget, project.spent, 
          project.team_size, project.technologies, project.image_url, 
          project.features, project.challenges, project.solutions, project.results
        ]);
        
        console.log(`Đã thêm dự án "${project.name}" thành công.`);
      } else {
        // Cập nhật dự án hiện có
        await client.query(`
          UPDATE projects SET
            name = $1, description = $2, company_id = $3, manager_id = $4, 
            status = $5, priority = $6, progress = $7, start_date = $8, 
            end_date = $9, budget = $10, spent = $11, team_size = $12, 
            technologies = $13, image_url = $14, features = $15, 
            challenges = $16, solutions = $17, results = $18,
            updated_at = CURRENT_TIMESTAMP
          WHERE slug = $19
        `, [
          project.name, project.description, project.company_id, 
          project.manager_id, project.status, project.priority, project.progress, 
          project.start_date, project.end_date, project.budget, project.spent, 
          project.team_size, project.technologies, project.image_url, 
          project.features, project.challenges, project.solutions, project.results,
          project.slug
        ]);
        
        console.log(`Đã cập nhật dự án "${project.name}" thành công.`);
      }
    }
    
    // Commit transaction
    await client.query('COMMIT');
    console.log('Hoàn tất cập nhật dữ liệu mẫu cho bảng projects.');
    
  } catch (error) {
    // Rollback transaction nếu có lỗi
    await client.query('ROLLBACK');
    console.error('Lỗi khi cập nhật dữ liệu mẫu:', error);
  } finally {
    // Giải phóng client
    client.release();
    // Đóng pool
    pool.end();
  }
}

// Thực thi hàm
seedProjectsData();