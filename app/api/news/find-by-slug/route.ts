import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

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

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const slug = searchParams.get('slug');
    
    if (!slug) {
      return NextResponse.json({ error: 'Slug parameter is required' }, { status: 400 });
    }
    
    console.log('Finding news with slug:', slug);
    
    // Tìm tin tức theo slug
    let result = await query(
      `SELECT id, slug, title FROM news WHERE slug = $1 LIMIT 1`,
      [slug]
    );
    
    // Nếu không tìm thấy, thử tìm bằng ID
    if (result.rows.length === 0 && !isNaN(Number(slug))) {
      result = await query(
        `SELECT id, slug, title FROM news WHERE id = $1 LIMIT 1`,
        [Number(slug)]
      );
    }
    
    // Nếu vẫn không tìm thấy, thử tìm bằng từ khóa trong tiêu đề
    if (result.rows.length === 0) {
      const searchTerms = slug.replace(/-/g, ' ').split(' ').filter(Boolean);
      
      if (searchTerms.length > 0) {
        let searchQuery = 'SELECT id, slug, title FROM news WHERE ';
        const searchConditions = searchTerms.map((_, index) => `title ILIKE $${index + 1}`);
        const searchParams = searchTerms.map(term => `%${term}%`);
        
        searchQuery += searchConditions.join(' AND ');
        searchQuery += ' LIMIT 1';
        
        result = await query(searchQuery, searchParams);
      }
    }
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'News not found' }, { status: 404 });
    }
    
    const news = result.rows[0];
    
    // Nếu không có slug, tạo slug an toàn từ tiêu đề
    if (!news.slug) {
      const safeSlug = createSafeSlug(news.title);
      
      // Cập nhật slug trong database
      await query(
        `UPDATE news SET slug = $1 WHERE id = $2`,
        [safeSlug, news.id]
      );
      
      news.slug = safeSlug;
    }
    
    return NextResponse.json({ 
      id: news.id,
      slug: news.slug,
      title: news.title,
      redirectTo: `/news/${news.slug}`
    });
    
  } catch (error) {
    console.error('Error in find-by-slug API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}