import { redirect } from "next/navigation";
import Link from "next/link";
import { cookies } from "next/headers";
import { format } from "date-fns";
import { Edit, Trash2, Plus, Search, Mail, Link as LinkIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { query } from "@/lib/db";
import AdminLayout from "@/components/admin/layout";

// Kiểm tra quyền admin
async function checkAdmin() {
  const cookieStore = cookies();
  const authCookie = cookieStore.get("auth");
  
  if (!authCookie) {
    redirect("/admin/login");
  }
  
  try {
    const userId = authCookie.value;
    const result = await query("SELECT * FROM users WHERE id = $1", [userId]);
    
    if (result.rows.length === 0 || result.rows[0].role !== "admin") {
      redirect("/admin/login");
    }
    
    return result.rows[0];
  } catch (error) {
    console.error("Error checking admin:", error);
    redirect("/admin/login");
  }
}

// Lấy danh sách tác giả
async function getAuthors(searchParams: { page?: string; limit?: string; search?: string }) {
  try {
    const page = parseInt(searchParams.page || "1");
    const limit = parseInt(searchParams.limit || "10");
    const search = searchParams.search;
    const offset = (page - 1) * limit;
    
    // Xây dựng câu truy vấn
    let queryText = "SELECT * FROM authors WHERE 1=1";
    const queryParams: any[] = [];
    let paramIndex = 1;
    
    if (search) {
      queryText += ` AND (name ILIKE $${paramIndex} OR bio ILIKE $${paramIndex})`;
      queryParams.push(`%${search}%`);
      paramIndex++;
    }
    
    // Thêm sắp xếp và phân trang
    queryText += ` ORDER BY name ASC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    queryParams.push(limit, offset);
    
    // Thực hiện truy vấn
    const result = await query(queryText, queryParams);
    
    // Lấy tổng số tác giả
    let countQueryText = "SELECT COUNT(*) FROM authors WHERE 1=1";
    let countParams: any[] = [];
    paramIndex = 1;
    
    if (search) {
      countQueryText += ` AND (name ILIKE $${paramIndex} OR bio ILIKE $${paramIndex})`;
      countParams.push(`%${search}%`);
      paramIndex++;
    }
    
    const countResult = await query(countQueryText, countParams);
    const totalCount = parseInt(countResult.rows[0].count);
    
    // Lấy số lượng tin tức của mỗi tác giả
    const authorsWithNewsCount = await Promise.all(
      result.rows.map(async (author) => {
        const newsCountResult = await query(
          "SELECT COUNT(*) FROM news WHERE author_id = $1",
          [author.id]
        );
        return {
          ...author,
          news_count: parseInt(newsCountResult.rows[0].count),
        };
      })
    );
    
    return {
      authors: authorsWithNewsCount,
      pagination: {
        total: totalCount,
        page,
        limit,
        pages: Math.ceil(totalCount / limit)
      }
    };
  } catch (error) {
    console.error("Error getting authors:", error);
    return {
      authors: [],
      pagination: {
        total: 0,
        page: 1,
        limit: 10,
        pages: 0
      }
    };
  }
}

export default async function AdminAuthors({ searchParams }: { searchParams: { page?: string; limit?: string; search?: string } }) {
  await checkAdmin();
  const { authors, pagination } = await getAuthors(searchParams);
  
  // Tạo mảng các trang để hiển thị phân trang
  const pages = [];
  for (let i = 1; i <= pagination.pages; i++) {
    pages.push(i);
  }
  
  // Hàm tạo URL với các tham số tìm kiếm
  const createUrl = (page: number) => {
    const params = new URLSearchParams();
    params.set("page", page.toString());
    
    if (searchParams.limit) {
      params.set("limit", searchParams.limit);
    }
    
    if (searchParams.search) {
      params.set("search", searchParams.search);
    }
    
    return `/admin/authors?${params.toString()}`;
  };
  
  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Quản lý tác giả</h1>
            <p className="text-gray-500">Quản lý tất cả tác giả trên website</p>
          </div>
          <Link href="/admin/authors/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Thêm tác giả mới
            </Button>
          </Link>
        </div>
        
        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <form className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                <Input
                  type="search"
                  name="search"
                  placeholder="Tìm kiếm tác giả..."
                  defaultValue={searchParams.search || ""}
                  className="pl-10"
                />
              </form>
            </div>
          </div>
        </div>
        
        {/* Authors Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Tác giả</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Mạng xã hội</TableHead>
                <TableHead className="text-center">Số bài viết</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {authors.length > 0 ? (
                authors.map((author, index) => (
                  <TableRow key={author.id}>
                    <TableCell className="font-medium">
                      {(pagination.page - 1) * pagination.limit + index + 1}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={author.avatar_url || "/placeholder-avatar.svg"} alt={author.name} />
                          <AvatarFallback>{author.name.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{author.name}</div>
                          <div className="text-gray-500 dark:text-gray-400 text-sm line-clamp-1">
                            {author.bio || "Không có thông tin"}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {author.email ? (
                        <a href={`mailto:${author.email}`} className="flex items-center text-blue-500 hover:underline">
                          <Mail className="h-4 w-4 mr-1" />
                          {author.email}
                        </a>
                      ) : (
                        <span className="text-gray-500">Không có</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {author.social_links && Object.keys(author.social_links).length > 0 ? (
                        <div className="flex space-x-2">
                          {Object.entries(author.social_links).map(([platform, url]) => (
                            <a
                              key={platform}
                              href={url as string}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:text-blue-700"
                            >
                              <LinkIcon className="h-4 w-4" />
                            </a>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-500">Không có</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">{author.news_count}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/authors/edit/${author.id}`}>
                          <Button size="icon" variant="ghost">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/admin/authors/delete/${author.id}`}>
                          <Button size="icon" variant="ghost" className="text-red-500">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Không có tác giả nào
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex justify-between items-center mt-6">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Hiển thị {(pagination.page - 1) * pagination.limit + 1} đến{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)} trong số{" "}
              {pagination.total} tác giả
            </div>
            <div className="flex gap-1">
              <Link
                href={createUrl(Math.max(1, pagination.page - 1))}
                className={`px-3 py-1 rounded-md ${
                  pagination.page === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700"
                    : "bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
                }`}
              >
                Trước
              </Link>
              {pages.map((page) => (
                <Link
                  key={page}
                  href={createUrl(page)}
                  className={`px-3 py-1 rounded-md ${
                    pagination.page === page
                      ? "bg-blue-500 text-white"
                      : "bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
                  }`}
                >
                  {page}
                </Link>
              ))}
              <Link
                href={createUrl(Math.min(pagination.pages, pagination.page + 1))}
                className={`px-3 py-1 rounded-md ${
                  pagination.page === pagination.pages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700"
                    : "bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
                }`}
              >
                Sau
              </Link>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}