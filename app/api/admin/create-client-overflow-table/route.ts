import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    // Tạo bảng client_overflow_content
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS client_overflow_content (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT,
        client_name VARCHAR(255),
        client_position VARCHAR(255),
        client_company VARCHAR(255),
        client_image_url VARCHAR(500),
        rating INTEGER CHECK (rating >= 1 AND rating <= 5),
        category VARCHAR(100),
        is_featured BOOLEAN DEFAULT false,
        display_order INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      -- Tạo index cho các trường thường dùng
      CREATE INDEX IF NOT EXISTS idx_client_overflow_category ON client_overflow_content(category);
      CREATE INDEX IF NOT EXISTS idx_client_overflow_featured ON client_overflow_content(is_featured);
      CREATE INDEX IF NOT EXISTS idx_client_overflow_active ON client_overflow_content(is_active);
      CREATE INDEX IF NOT EXISTS idx_client_overflow_order ON client_overflow_content(display_order);
    `;

    await query(createTableQuery);

    // Tạo trigger để tự động cập nhật updated_at
    const createTriggerQuery = `
      CREATE OR REPLACE FUNCTION update_client_overflow_updated_at()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ language 'plpgsql';

      CREATE TRIGGER IF NOT EXISTS update_client_overflow_content_updated_at
        BEFORE UPDATE ON client_overflow_content
        FOR EACH ROW EXECUTE FUNCTION update_client_overflow_updated_at();
    `;

    await query(createTriggerQuery);

    return NextResponse.json({
      success: true,
      message: 'Client overflow content table created successfully'
    });

  } catch (error) {
    console.error('Error creating client overflow content table:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create client overflow content table'
    }, { status: 500 });
  }
}