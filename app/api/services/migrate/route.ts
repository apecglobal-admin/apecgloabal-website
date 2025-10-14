import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    // Read migration file
    const migrationPath = path.join(process.cwd(), 'migrations', '012_add_slug_to_services.sql')
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8')
    
    // Execute migration
    await query(migrationSQL)
    
    return NextResponse.json({
      success: true,
      message: 'Services table migration completed successfully'
    })
  } catch (error) {
    console.error('Error running services migration:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to run services migration',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}