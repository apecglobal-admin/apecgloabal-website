import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET representative company (first by ordering)
export async function GET(request: NextRequest) {
  try {
    const result = await query(`
      SELECT * FROM companies 
      ORDER BY display_order, name 
      LIMIT 1
    `);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'No companies found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching representative company:', error);
    return NextResponse.json({ error: 'Failed to fetch company' }, { status: 500 });
  }
}

// POST is deprecated since there is no parent flag anymore
export async function POST(request: NextRequest) {
  void request; // appease unused parameter lint rule
  return NextResponse.json({
    error: 'Parent company designation is no longer supported'
  }, { status: 410 });
}