import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const documentId = searchParams.get('id');
    
    if (!documentId) {
      return NextResponse.json(
        { error: 'Document ID is required' },
        { status: 400 }
      );
    }
    
    // Get document details
    const documentResult = await query(
      'SELECT * FROM documents WHERE id = $1',
      [documentId]
    );
    
    if (documentResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }
    
    const document = documentResult.rows[0];
    
    // Increment download count
    await query(
      'UPDATE documents SET download_count = download_count + 1 WHERE id = $1',
      [documentId]
    );
    
    // Return the document URL for the client to download
    return NextResponse.json({
      success: true,
      document: {
        id: document.id,
        name: document.name,
        file_url: document.file_url,
        file_type: document.file_type,
        download_count: document.download_count + 1
      }
    });
  } catch (error) {
    console.error('Error processing document download:', error);
    return NextResponse.json(
      { error: 'Failed to process document download' },
      { status: 500 }
    );
  }
}