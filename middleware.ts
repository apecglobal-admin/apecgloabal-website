import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Hàm tạo slug an toàn
function createSafeSlug(text: string) {
  if (!text) return '';
  
  // Chuyển đổi tiếng Việt sang không dấu
  const vietnameseMap: Record<string, string> = {
    'à': 'a', 'á': 'a', 'ả': 'a', 'ã': 'a', 'ạ': 'a',
    'ă': 'a', 'ằ': 'a', 'ắ': 'a', 'ẳ': 'a', 'ẵ': 'a', 'ặ': 'a',
    'â': 'a', 'ầ': 'a', 'ấ': 'a', 'ẩ': 'a', 'ẫ': 'a', 'ậ': 'a',
    'đ': 'd',
    'è': 'e', 'é': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ẹ': 'e',
    'ê': 'e', 'ề': 'e', 'ế': 'e', 'ể': 'e', 'ễ': 'e', 'ệ': 'e',
    'ì': 'i', 'í': 'i', 'ỉ': 'i', 'ĩ': 'i', 'ị': 'i',
    'ò': 'o', 'ó': 'o', 'ỏ': 'o', 'õ': 'o', 'ọ': 'o',
    'ô': 'o', 'ồ': 'o', 'ố': 'o', 'ổ': 'o', 'ỗ': 'o', 'ộ': 'o',
    'ơ': 'o', 'ờ': 'o', 'ớ': 'o', 'ở': 'o', 'ỡ': 'o', 'ợ': 'o',
    'ù': 'u', 'ú': 'u', 'ủ': 'u', 'ũ': 'u', 'ụ': 'u',
    'ư': 'u', 'ừ': 'u', 'ứ': 'u', 'ử': 'u', 'ữ': 'u', 'ự': 'u',
    'ỳ': 'y', 'ý': 'y', 'ỷ': 'y', 'ỹ': 'y', 'ỵ': 'y',
    'À': 'A', 'Á': 'A', 'Ả': 'A', 'Ã': 'A', 'Ạ': 'A',
    'Ă': 'A', 'Ằ': 'A', 'Ắ': 'A', 'Ẳ': 'A', 'Ẵ': 'A', 'Ặ': 'A',
    'Â': 'A', 'Ầ': 'A', 'Ấ': 'A', 'Ẩ': 'A', 'Ẫ': 'A', 'Ậ': 'A',
    'Đ': 'D',
    'È': 'E', 'É': 'E', 'Ẻ': 'E', 'Ẽ': 'E', 'Ẹ': 'E',
    'Ê': 'E', 'Ề': 'E', 'Ế': 'E', 'Ể': 'E', 'Ễ': 'E', 'Ệ': 'E',
    'Ì': 'I', 'Í': 'I', 'Ỉ': 'I', 'Ĩ': 'I', 'Ị': 'I',
    'Ò': 'O', 'Ó': 'O', 'Ỏ': 'O', 'Õ': 'O', 'Ọ': 'O',
    'Ô': 'O', 'Ồ': 'O', 'Ố': 'O', 'Ổ': 'O', 'Ỗ': 'O', 'Ộ': 'O',
    'Ơ': 'O', 'Ờ': 'O', 'Ớ': 'O', 'Ở': 'O', 'Ỡ': 'O', 'Ợ': 'O',
    'Ù': 'U', 'Ú': 'U', 'Ủ': 'U', 'Ũ': 'U', 'Ụ': 'U',
    'Ư': 'U', 'Ừ': 'U', 'Ứ': 'U', 'Ử': 'U', 'Ữ': 'U', 'Ự': 'U',
    'Ỳ': 'Y', 'Ý': 'Y', 'Ỷ': 'Y', 'Ỹ': 'Y', 'Ỵ': 'Y'
  };
  
  // Chuyển đổi tiếng Việt sang không dấu
  let slug = text.split('').map(char => vietnameseMap[char] || char).join('');
  
  // Chuyển đổi sang chữ thường
  slug = slug.toLowerCase();
  
  // Thay thế các ký tự đặc biệt bằng dấu gạch ngang
  slug = slug.replace(/[^a-z0-9]+/g, '-');
  
  // Loại bỏ dấu gạch ngang ở đầu và cuối
  slug = slug.replace(/^-+|-+$/g, '');
  
  return slug;
}

// Kiểm tra xem URL có chứa ký tự đặc biệt không
function hasSpecialCharacters(url: string): boolean {
  // Kiểm tra các ký tự đặc biệt, ký tự tiếng Việt, và các ký tự mã hóa URL
  return /[%đĐáàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵÁÀẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬÉÈẺẼẸÊẾỀỂỄỆÍÌỈĨỊÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÚÙỦŨỤƯỨỪỬỮỰÝỲỶỸỴ]/.test(url);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Xử lý xác thực cho trang admin
  if (pathname.startsWith('/admin') && !pathname.includes('/admin/login')) {
    // Lấy cookie xác thực
    const authCookie = request.cookies.get('auth');
    const adminAuthCookie = request.cookies.get('admin_auth');
    
    // Nếu không có cookie xác thực, chuyển hướng đến trang đăng nhập
    if (!authCookie || !adminAuthCookie) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }
    
    // Kiểm tra quyền admin_access
    try {
      const authData = JSON.parse(authCookie.value);
      if (!authData.permissions?.admin_access) {
        const url = request.nextUrl.clone();
        url.pathname = '/admin/login';
        return NextResponse.redirect(url);
      }
    } catch (error) {
      // Nếu không parse được JSON, chuyển hướng đến trang đăng nhập
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }
  }
  
  // Xử lý xác thực cho trang internal
  if (pathname.startsWith('/cms/') && !pathname.includes('/cms/login')) {
    // Lấy cookie xác thực
    const authCookie = request.cookies.get('auth');
    const internalAuthCookie = request.cookies.get('internal_auth');
    
    // Nếu không có cookie xác thực, chuyển hướng đến trang đăng nhập
    if (!authCookie || !internalAuthCookie) {
      const url = request.nextUrl.clone();
      url.pathname = '/cms';
      return NextResponse.redirect(url);
    }
    
    // Kiểm tra quyền portal_access
    try {
      const authData = JSON.parse(authCookie.value);
      if (!authData.permissions?.portal_access) {
        const url = request.nextUrl.clone();
        url.pathname = '/cms';
        return NextResponse.redirect(url);
      }
    } catch (error) {
      // Nếu không parse được JSON, chuyển hướng đến trang đăng nhập
      const url = request.nextUrl.clone();
      url.pathname = '/cms';
      return NextResponse.redirect(url);
    }
  }
  
  // Xử lý các URL tin tức
  if (pathname.startsWith('/news/') && pathname !== '/news/redirect' && pathname !== '/news/fix-url') {
    // Lấy slug từ URL
    const slug = pathname.replace('/news/', '');
    
    try {
      // Kiểm tra xem slug có chứa ký tự đặc biệt không hoặc cần được chuẩn hóa
      if (hasSpecialCharacters(slug) || slug !== decodeURIComponent(slug)) {
        // Tạo slug an toàn - bọc trong try-catch để tránh lỗi khi giải mã
        let decodedSlug;
        try {
          decodedSlug = decodeURIComponent(slug);
        } catch (error) {
          // Nếu không thể giải mã, sử dụng slug gốc
          decodedSlug = slug;
        }
        
        const safeSlug = createSafeSlug(decodedSlug);
        
        // Tạo URL mới với slug an toàn
        const url = request.nextUrl.clone();
        url.pathname = `/news/${safeSlug}`;
        
        // Chuyển hướng đến URL an toàn
        return NextResponse.redirect(url);
      }
    } catch (error) {
      // Nếu có lỗi trong quá trình xử lý, tạo slug an toàn từ slug gốc
      const safeSlug = createSafeSlug(slug);
      
      // Tạo URL mới với slug an toàn
      const url = request.nextUrl.clone();
      url.pathname = `/news/${safeSlug}`;
      
      // Chuyển hướng đến URL an toàn
      return NextResponse.redirect(url);
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/cms/:path*', '/news/:path*'],
};