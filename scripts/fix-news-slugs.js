const { Pool } = require('pg');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Create a new pool using the connection string from environment variables
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Hàm tạo slug an toàn
function createSafeSlug(text) {
  if (!text) return '';
  
  // Chuyển đổi tiếng Việt sang không dấu
  const vietnameseMap = {
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

async function fixNewsSlugs() {
  const client = await pool.connect();
  try {
    console.log('Bắt đầu cập nhật slug cho tin tức...');
    
    // Lấy tất cả tin tức
    const result = await client.query('SELECT id, title, slug FROM news');
    
    // Cập nhật slug cho từng tin tức
    for (const news of result.rows) {
      const safeSlug = createSafeSlug(news.title);
      
      // Kiểm tra xem slug đã tồn tại chưa
      const checkResult = await client.query('SELECT id FROM news WHERE slug = $1 AND id != $2', [safeSlug, news.id]);
      
      // Nếu slug đã tồn tại, thêm id vào cuối
      const finalSlug = checkResult.rows.length > 0 ? `${safeSlug}-${news.id}` : safeSlug;
      
      // Cập nhật slug
      await client.query('UPDATE news SET slug = $1 WHERE id = $2', [finalSlug, news.id]);
      
      console.log(`Đã cập nhật tin tức ID ${news.id}: "${news.title}" -> "${finalSlug}"`);
    }
    
    console.log('Hoàn thành cập nhật slug cho tin tức!');
  } catch (err) {
    console.error('Lỗi khi cập nhật slug:', err);
  } finally {
    client.release();
  }
}

// Chạy hàm cập nhật
fixNewsSlugs().then(() => {
  pool.end();
  console.log('Đã đóng kết nối database.');
});