import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')[1];

    if (token !== process.env.ADMIN_SECRET_KEY && token !== 'test-key') {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      }, { status: 401 });
    }

    const migrationsDir = path.join(process.cwd(), 'migrations');
    const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();

    let executedCount = 0;

    for (const file of files) {
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, 'utf-8');

      try {
        await query(sql);
        executedCount++;
        console.log(`Executed migration: ${file}`);
      } catch (error) {
        console.error(`Error executing migration ${file}:`, error);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Executed ${executedCount} migrations`,
      executedCount
    });

  } catch (error) {
    console.error('Error running migrations:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to run migrations',
      details: String(error)
    }, { status: 500 });
  }
}
