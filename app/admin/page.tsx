import { redirect } from "next/navigation";
import Link from "next/link";
import { cookies } from "next/headers";
import { 
  Newspaper, 
  Users, 
  Tag, 
  Settings, 
  BarChart3, 
  FileText, 
  MessageSquare,
  Image as ImageIcon
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { query } from "@/lib/db";
import AdminLayout from "@/components/admin/layout";

// Kiểm tra quyền admin
async function checkAdmin() {
  const cookieStore = cookies();
  const authCookie = cookieStore.get("auth");
  const adminAuthCookie = cookieStore.get("admin_auth");
  
  if (!authCookie || !adminAuthCookie) {
    redirect("/admin/login");
  }
  
  try {
    // Thử parse giá trị cookie dưới dạng JSON
    try {
      const authData = JSON.parse(authCookie.value);
      
      if (!authData.permissions?.admin_access) {
        redirect("/admin/login");
      }
      
      // Nếu là tài khoản admin (id = 999)
      if (authData.id === 999) {
        return {
          id: 999,
          username: "admin",
          email: "admin@apecglobal.com",
          role: "admin",
          is_active: true,
          permissions: {
            admin_access: true,
            portal_access: true
          }
        };
      }
      
      // Nếu không phải tài khoản admin, truy vấn database
      const result = await query(`
        SELECT u.*, p.admin_access, p.portal_access
        FROM users u
        LEFT JOIN permissions p ON u.employee_id = p.employee_id
        WHERE u.id = $1
      `, [authData.id]);
      
      if (result.rows.length === 0 || !result.rows[0].admin_access) {
        redirect("/admin/login");
      }
      
      return {
        ...result.rows[0],
        permissions: {
          admin_access: result.rows[0].admin_access,
          portal_access: result.rows[0].portal_access
        }
      };
    } catch (parseError) {
      // Nếu không parse được JSON, xử lý như cũ (giá trị cookie là userId)
      const userId = authCookie.value;
      
      // Nếu là tài khoản admin
      if (userId === "999") {
        return {
          id: 999,
          username: "admin",
          email: "admin@apecglobal.com",
          role: "admin",
          is_active: true,
          permissions: {
            admin_access: true,
            portal_access: true
          }
        };
      }
      
      const result = await query(`
        SELECT u.*, p.admin_access, p.portal_access
        FROM users u
        LEFT JOIN permissions p ON u.employee_id = p.employee_id
        WHERE u.id = $1
      `, [userId]);
      
      if (result.rows.length === 0 || !result.rows[0].admin_access) {
        redirect("/admin/login");
      }
      
      return {
        ...result.rows[0],
        permissions: {
          admin_access: result.rows[0].admin_access,
          portal_access: result.rows[0].portal_access
        }
      };
    }
  } catch (error) {
    console.error("Error checking admin:", error);
    redirect("/admin/login");
  }
}

// Lấy thống kê tổng quan
async function getDashboardStats() {
  try {
    // Lấy số lượng tin tức
    const newsResult = await query("SELECT COUNT(*) FROM news");
    const newsCount = parseInt(newsResult.rows[0].count);
    
    // Lấy số lượng người dùng
    const usersResult = await query("SELECT COUNT(*) FROM users");
    const usersCount = parseInt(usersResult.rows[0].count);
    
    // Lấy số lượng danh mục
    const categoriesResult = await query("SELECT COUNT(DISTINCT category) FROM news");
    const categoriesCount = parseInt(categoriesResult.rows[0].count);
    
    // Lấy số lượng lượt xem
    const viewsResult = await query("SELECT SUM(view_count) FROM news");
    const viewsCount = parseInt(viewsResult.rows[0].sum || 0);
    
    // Lấy tin tức mới nhất
    const latestNewsResult = await query(
      "SELECT id, title, published_at FROM news ORDER BY published_at DESC LIMIT 5"
    );
    const latestNews = latestNewsResult.rows;
    
    // Lấy tin tức phổ biến nhất
    const popularNewsResult = await query(
      "SELECT id, title, view_count FROM news ORDER BY view_count DESC LIMIT 5"
    );
    const popularNews = popularNewsResult.rows;
    
    return {
      newsCount,
      usersCount,
      categoriesCount,
      viewsCount,
      latestNews,
      popularNews
    };
  } catch (error) {
    console.error("Error getting dashboard stats:", error);
    return {
      newsCount: 0,
      usersCount: 0,
      categoriesCount: 0,
      viewsCount: 0,
      latestNews: [],
      popularNews: []
    };
  }
}

export default async function AdminDashboard() {
  const admin = await checkAdmin();
  const stats = await getDashboardStats();
  
  const adminModules = [
    {
      title: "Quản lý tin tức",
      description: "Thêm, sửa, xóa tin tức",
      icon: <Newspaper className="h-8 w-8 text-blue-500" />,
      link: "/admin/news",
      count: stats.newsCount
    },
    {
      title: "Quản lý người dùng",
      description: "Thêm, sửa, xóa người dùng",
      icon: <Users className="h-8 w-8 text-green-500" />,
      link: "/admin/users",
      count: stats.usersCount
    },
    {
      title: "Quản lý phân quyền",
      description: "Cấp quyền truy cập cho nhân viên",
      icon: <Settings className="h-8 w-8 text-red-500" />,
      link: "/admin/permissions",
      count: "Mới"
    },
    {
      title: "Quản lý danh mục",
      description: "Thêm, sửa, xóa danh mục",
      icon: <Tag className="h-8 w-8 text-yellow-500" />,
      link: "/admin/categories",
      count: stats.categoriesCount
    },
    {
      title: "Quản lý tác giả",
      description: "Thêm, sửa, xóa tác giả",
      icon: <FileText className="h-8 w-8 text-purple-500" />,
      link: "/admin/authors",
      count: "N/A"
    },
    {
      title: "Quản lý bình luận",
      description: "Duyệt, xóa bình luận",
      icon: <MessageSquare className="h-8 w-8 text-orange-500" />,
      link: "/admin/comments",
      count: "N/A"
    },
    {
      title: "Quản lý hình ảnh",
      description: "Tải lên, quản lý hình ảnh",
      icon: <ImageIcon className="h-8 w-8 text-pink-500" />,
      link: "/admin/images",
      count: "N/A"
    },
    {
      title: "Thống kê",
      description: "Xem thống kê website",
      icon: <BarChart3 className="h-8 w-8 text-indigo-500" />,
      link: "/admin/statistics",
      count: stats.viewsCount + " lượt xem"
    },
    {
      title: "Cài đặt",
      description: "Cài đặt hệ thống",
      icon: <Settings className="h-8 w-8 text-gray-500" />,
      link: "/admin/settings",
      count: "N/A"
    }
  ];
  
  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Bảng điều khiển</h1>
            <p className="text-gray-500">Xin chào, {admin.username}!</p>
          </div>
          <div className="flex gap-2">
            <Link href="/admin/news/create">
              <Button>Tạo tin tức mới</Button>
            </Link>
          </div>
        </div>
        
        {/* Admin Modules */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {adminModules.map((module, index) => (
            <Link href={module.link} key={index}>
              <Card className="h-full hover:border-primary transition-colors">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    {module.icon}
                    <div className="text-2xl font-bold">{module.count}</div>
                  </div>
                  <CardTitle className="mt-4">{module.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{module.description}</CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        
        {/* Recent Activity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Tin tức mới nhất</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {stats.latestNews.map((news, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <Link href={`/admin/news/edit/${news.id}`} className="hover:underline truncate max-w-[80%]">
                      {news.title}
                    </Link>
                    <span className="text-sm text-gray-500">
                      {new Date(news.published_at).toLocaleDateString()}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Tin tức phổ biến nhất</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {stats.popularNews.map((news, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <Link href={`/admin/news/edit/${news.id}`} className="hover:underline truncate max-w-[80%]">
                      {news.title}
                    </Link>
                    <span className="text-sm text-gray-500">
                      {news.view_count} lượt xem
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}