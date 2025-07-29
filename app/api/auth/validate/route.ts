import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = cookies();
    const authCookie = cookieStore.get('auth');
    const internalAuthCookie = cookieStore.get('internal_auth');
    
    // Check if user has valid auth cookies
    if (!authCookie || !internalAuthCookie) {
      return NextResponse.json(
        { error: 'No valid session found' },
        { status: 401 }
      );
    }
    
    try {
      const authData = JSON.parse(authCookie.value);
      
      // Validate the auth data structure
      if (!authData.id || !authData.username || !authData.permissions) {
        return NextResponse.json(
          { error: 'Invalid session data' },
          { status: 401 }
        );
      }
      
      // Check if user has portal access
      if (!authData.permissions.portal_access) {
        return NextResponse.json(
          { error: 'No portal access permission' },
          { status: 403 }
        );
      }
      
      // Session is valid
      return NextResponse.json({
        message: 'Session is valid',
        user: {
          id: authData.id,
          username: authData.username,
          role: authData.role,
          permissions: authData.permissions
        }
      });
      
    } catch (parseError) {
      console.error('Error parsing auth cookie:', parseError);
      return NextResponse.json(
        { error: 'Invalid session format' },
        { status: 401 }
      );
    }
    
  } catch (error) {
    console.error('Session validation error:', error);
    return NextResponse.json(
      { error: 'Server error during validation' },
      { status: 500 }
    );
  }
}