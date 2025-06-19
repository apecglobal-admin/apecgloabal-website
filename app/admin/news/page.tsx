import { redirect } from "next/navigation";
import Link from "next/link";
import { cookies } from "next/headers";
import { format } from "date-fns";
import { Eye, Edit, Trash2, Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

// Lấy danh sách tin tức
async function getNews(searchParams: { page?: string; limit?: string; category?: string; search?: string }) {
  try {
    const page = parseInt(searchParams.page || "1");
    const limit = parseInt(searchParams.limit || "10");
    const category = searchParams.category;
    const search = searchParams.search;
    const offset = (page - 1) * limit;
    
    // Xây dựng câu truy vấn
    let queryText = `
      SELECT n.*, a.name as author_name
      FROM news n
      LEFT JOIN authors a ON n.author_id = a.id
      WHERE 1=1
    `;
    const queryParams: any[] = [];
    let paramIndex = 1;
    
    if (category && category !== "all") {
      queryText += ` AND n.category = $${paramIndex}`;
      queryParams.push(category);
      paramIndex++;
    }
    
    if (search) {
      queryText += ` AND (n.title ILIKE $${paramIndex} OR n.excerpt ILIKE $${paramIndex})`;
      queryParams.push(`%${search}%`);
      paramIndex++;
    }
    
    // Thêm sắp xếp và phân trang
    queryText += ` ORDER BY n.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    queryParams.push(limit, offset);
    
    // Thực hiện truy vấn
    const result = await query(queryText, queryParams);
    
    // Lấy tổng số tin tức
    let countQueryText = `
      SELECT COUNT(*) FROM news n
      WHERE 1=1
    `;
    let countParams: any[] = [];
    paramIndex = 1;
    
    if (category && category !== "all") {
      countQueryText += ` AND n.category = $${paramIndex}`;
      countParams.push(category);
      paramIndex++;
    }
    
    if (search) {
      countQueryText += ` AND (n.title ILIKE $${paramIndex} OR n.excerpt ILIKE $${paramIndex})`;
      countParams.push(`%${search}%`);
      paramIndex++;
    }
    
    const countResult = await query(countQueryText, countParams);
    const totalCount = parseInt(countResult.rows[0].count);
    
    // Lấy danh sách danh mục
    const categoriesResult = await query("SELECT DISTINCT category FROM news ORDER BY category");
    const categories = categoriesResult.rows.map(row => row.category);
    
    return {
      news: result.rows,
      pagination: {
        total: totalCount,
        page,
        limit,
        pages: Math.ceil(totalCount / limit)
      },
      categories
    };
  } catch (error) {
    console.error("Error getting news:", error);
    return {
      news: [],
      pagination: {
        total: 0,
        page: 1,
        limit: 10,
        pages: 0
      },
      categories: []
    };
  }
}

export default async function AdminNews({ searchParams }: { searchParams: { page?: string; limit?: string; category?: string; search?: string } }) {
  await checkAdmin();
  const { news, pagination, categories } = await getNews(searchParams);
  
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
    
    if (searchParams.category) {
      params.set("category", searchParams.category);
    }
    
    if (searchParams.search) {
      params.set("search", searchParams.search);
    }
    
    return `/admin/news?${params.toString()}`;
  };
  
  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Quản lý tin tức</h1>
            <p className="text-gray-500">Quản lý tất cả tin tức trên website</p>
          </div>
          <Link href="/admin/news/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Thêm tin tức mới
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
                  placeholder="Tìm kiếm tin tức..."
                  defaultValue={searchParams.search || ""}
                  className="pl-10"
                />
              </form>
            </div>
            <div className="w-full md:w-48">
              <form>
                <input type="hidden" name="page" value="1" />
                {searchParams.search && (
                  <input type="hidden" name="search" value={searchParams.search} />
                )}
                <Select name="category" defaultValue={searchParams.category || "all"} onValueChange={(value) => {
                  const form = document.createElement("form");
                  form.method = "get";
                  form.action = "/admin/news";
                  
                  const pageInput = document.createElement("input");
                  pageInput.type = "hidden";
                  pageInput.name = "page";
                  pageInput.value = "1";
                  form.appendChild(pageInput);
                  
                  if (searchParams.search) {
                    const searchInput = document.createElement("input");
                    searchInput.type = "hidden";
                    searchInput.name = "search";
                    searchInput.value = searchParams.search;
                    form.appendChild(searchInput);
                  }
                  
                  const categoryInput = document.createElement("input");
                  categoryInput.type = "hidden";
                  categoryInput.name = "category";
                  categoryInput.value = value;
                  form.appendChild(categoryInput);
                  
                  document.body.appendChild(form);
                  form.submit();
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả danh mục</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </form>
            </div>
            <div className="w-full md:w-32">
              <form>
                <input type="hidden" name="page" value="1" />
                {searchParams.search && (
                  <input type="hidden" name="search" value={searchParams.search} />
                )}
                {searchParams.category && (
                  <input type="hidden" name="category" value={searchParams.category} />
                )}
                <Select name="limit" defaultValue={searchParams.limit || "10"} onValueChange={(value) => {
                  const form = document.createElement("form");
                  form.method = "get";
                  form.action = "/admin/news";
                  
                  const pageInput = document.createElement("input");
                  pageInput.type = "hidden";
                  pageInput.name = "page";
                  pageInput.value = "1";
                  form.appendChild(pageInput);
                  
                  if (searchParams.search) {
                    const searchInput = document.createElement("input");
                    searchInput.type = "hidden";
                    searchInput.name = "search";
                    searchInput.value = searchParams.search;
                    form.appendChild(searchInput);
                  }
                  
                  if (searchParams.category) {
                    const categoryInput = document.createElement("input");
                    categoryInput.type = "hidden";
                    categoryInput.name = "category";
                    categoryInput.value = searchParams.category;
                    form.appendChild(categoryInput);
                  }
                  
                  const limitInput = document.createElement("input");
                  limitInput.type = "hidden";
                  limitInput.name = "limit";
                  limitInput.value = value;
                  form.appendChild(limitInput);
                  
                  document.body.appendChild(form);
                  form.submit();
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Số lượng" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </form>
            </div>
          </div>
        </div>
        
        {/* News Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Tiêu đề</TableHead>
                <TableHead>Danh mục</TableHead>
                <TableHead>Tác giả</TableHead>
                <TableHead>Ngày đăng</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="w-24 text-right">Lượt xem</TableHead>
                <TableHead className="w-32 text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {news.length > 0 ? (
                news.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      {(pagination.page - 1) * pagination.limit + index + 1}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium truncate max-w-xs">{item.title}</div>
                      <div className="text-gray-500 dark:text-gray-400 text-sm truncate max-w-xs">
                        {item.excerpt}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.category}</Badge>
                    </TableCell>
                    <TableCell>{item.author_name || "Không có"}</TableCell>
                    <TableCell>
                      {item.published_at
                        ? format(new Date(item.published_at), "dd/MM/yyyy")
                        : "Chưa xuất bản"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          item.published
                            ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100"
                        }
                      >
                        {item.published ? "Đã xuất bản" : "Bản nháp"}
                      </Badge>
                      {item.featured && (
                        <Badge className="ml-2 bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">
                          Nổi bật
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">{item.view_count}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Link href={`/news/${item.id}`} target="_blank">
                          <Button size="icon" variant="ghost">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/admin/news/edit/${item.id}`}>
                          <Button size="icon" variant="ghost">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/admin/news/delete/${item.id}`}>
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
                  <TableCell colSpan={8} className="text-center py-8">
                    Không có tin tức nào
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
              {pagination.total} tin tức
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