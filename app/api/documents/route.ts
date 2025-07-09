import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET all documents with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const folderPath = searchParams.get('folderPath');
    const search = searchParams.get('search');
    const id = searchParams.get('id');
    
    let sql = 'SELECT d.*, u.username as uploader_name FROM documents d LEFT JOIN users u ON d.uploaded_by = u.id';
    const params = [];
    const conditions = [];
    
    if (id) {
      conditions.push(`d.id = $${params.length + 1}`);
      params.push(id);
    }
    
    if (category) {
      conditions.push(`d.category = $${params.length + 1}`);
      params.push(category);
    }
    
    if (folderPath) {
      conditions.push(`d.folder_path = $${params.length + 1}`);
      params.push(folderPath);
    }
    
    if (search) {
      conditions.push(`(d.name ILIKE $${params.length + 1} OR d.description ILIKE $${params.length + 1})`);
      params.push(`%${search}%`);
    }
    
    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }
    
    sql += ' ORDER BY d.created_at DESC';
    
    const result = await query(sql, params);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch documents' },
      { status: 500 }
    );
  }
}

// POST to create a new document (without file upload)
export async function POST(request: NextRequest) {
  try {
    const { name, description, category, uploadedBy, isPublic, folderPath } = await request.json();
    
    if (!name || !uploadedBy) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const result = await query(
      `INSERT INTO documents 
       (name, description, category, uploaded_by, is_public, folder_path) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [name, description || '', category || 'Uncategorized', uploadedBy, isPublic || false, folderPath || '']
    );
    
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error creating document:', error);
    return NextResponse.json(
      { error: 'Failed to create document' },
      { status: 500 }
    );
  }
}

// PATCH to update document details
export async function PATCH(request: NextRequest) {
  try {
    const { id, name, description, category, isPublic, folderPath } = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: 'Document ID is required' },
        { status: 400 }
      );
    }
    
    const updateFields = [];
    const params = [id];
    let paramIndex = 2;
    
    if (name) {
      updateFields.push(`name = $${paramIndex++}`);
      params.push(name);
    }
    
    if (description !== undefined) {
      updateFields.push(`description = $${paramIndex++}`);
      params.push(description);
    }
    
    if (category) {
      updateFields.push(`category = $${paramIndex++}`);
      params.push(category);
    }
    
    if (isPublic !== undefined) {
      updateFields.push(`is_public = $${paramIndex++}`);
      params.push(isPublic);
    }
    
    if (folderPath !== undefined) {
      updateFields.push(`folder_path = $${paramIndex++}`);
      params.push(folderPath);
    }
    
    if (updateFields.length === 0) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      );
    }
    
    const sql = `UPDATE documents SET ${updateFields.join(', ')}, updated_at = NOW() WHERE id = $1 RETURNING *`;
    const result = await query(sql, params);
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating document:', error);
    return NextResponse.json(
      { error: 'Failed to update document' },
      { status: 500 }
    );
  }
}