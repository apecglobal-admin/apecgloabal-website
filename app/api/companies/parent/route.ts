import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET parent company
export async function GET(request: NextRequest) {
  try {
    const result = await query(`
      SELECT * FROM companies 
      WHERE is_parent_company = true 
      LIMIT 1
    `);
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'No parent company found' }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching parent company:', error);
    return NextResponse.json({ error: 'Failed to fetch parent company' }, { status: 500 });
  }
}

// POST set company as parent (only one can be parent)
export async function POST(request: NextRequest) {
  try {
    const { company_id } = await request.json();
    
    if (!company_id) {
      return NextResponse.json({ error: 'Company ID is required' }, { status: 400 });
    }
    
    // Begin transaction
    await query('BEGIN');
    
    try {
      // First, remove parent status from all companies
      await query('UPDATE companies SET is_parent_company = false');
      
      // Then set the selected company as parent
      const result = await query(`
        UPDATE companies 
        SET is_parent_company = true 
        WHERE id = $1 
        RETURNING *
      `, [company_id]);
      
      if (result.rows.length === 0) {
        throw new Error('Company not found');
      }
      
      // Commit transaction
      await query('COMMIT');
      
      return NextResponse.json({
        success: true,
        message: 'Parent company updated successfully',
        data: result.rows[0]
      });
    } catch (error) {
      // Rollback transaction
      await query('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('Error setting parent company:', error);
    return NextResponse.json({ error: 'Failed to set parent company' }, { status: 500 });
  }
}