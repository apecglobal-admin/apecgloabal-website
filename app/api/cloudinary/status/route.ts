import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

export async function GET(request: NextRequest) {
  try {
    // Get Cloudinary configuration
    const config = {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET ? '***' : undefined,
    };
    
    // Check if Cloudinary is configured
    const isConfigured = !!(
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
    );
    
    // Test Cloudinary connection if configured
    let connectionStatus = 'not_tested';
    let error = null;
    
    if (isConfigured) {
      try {
        // Try to ping Cloudinary
        const result = await cloudinary.api.ping();
        connectionStatus = result.status === 'ok' ? 'connected' : 'error';
      } catch (err) {
        connectionStatus = 'error';
        error = err.message;
      }
    }
    
    return NextResponse.json({
      isConfigured,
      config,
      connectionStatus,
      error,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error checking Cloudinary status:', error);
    return NextResponse.json(
      { error: `Failed to check Cloudinary status: ${error.message}` },
      { status: 500 }
    );
  }
}