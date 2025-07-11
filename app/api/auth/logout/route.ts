import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    // Xóa tất cả cookie xác thực
    const cookieStore = cookies();
    cookieStore.delete('auth');
    cookieStore.delete('internal_auth');
    cookieStore.delete('admin_auth');
    
    return NextResponse.json({
      message: 'Đăng xuất thành công'
    });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Lỗi server' },
      { status: 500 }
    );
  }
}