import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    // Tạo bảng home_content
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS home_content (
        id SERIAL PRIMARY KEY,
        section VARCHAR(50) NOT NULL UNIQUE,
        content JSONB NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      -- Tạo index cho section
      CREATE INDEX IF NOT EXISTS idx_home_content_section ON home_content(section);
    `;

    await query(createTableQuery);

    // Tạo trigger để tự động cập nhật updated_at
    const createTriggerQuery = `
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ language 'plpgsql';

      CREATE TRIGGER IF NOT EXISTS update_home_content_updated_at
        BEFORE UPDATE ON home_content
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `;

    await query(createTriggerQuery);

    return NextResponse.json({
      success: true,
      message: 'Home content table created successfully'
    });

  } catch (error) {
    console.error('Error creating home content table:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create home content table'
    }, { status: 500 });
  }
}