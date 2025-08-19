"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Brain, Shield, Heart, Clock, Cpu, TrendingUp, CheckCircle, AlertCircle, PlayCircle, Code, Calendar, Users, Globe, Zap } from "lucide-react"

interface Project {
  id: number
  name: string
  slug: string
  description?: string
  image_url?: string
  status?: string
  start_date?: string
  end_date?: string
  technologies?: string[]
  is_featured?: boolean
  company_id?: number
  company_name?: string
  company_logo?: string
  progress?: number
  team_size?: number
  location?: string
  priority?: string
  client_name?: string
  demo_url?: string
  goals?: string[]
  created_at?: string
  updated_at?: string
}

// Hàm lấy icon dựa trên công nghệ
const getTechIcon = (technologies: string[]) => {
  if (!technologies || technologies.length === 0) return Brain;
  
  const techString = technologies.join(' ').toLowerCase();
  
  if (techString.includes('ai') || techString.includes('machine learning') || techString.includes('ml')) return Brain;
  if (techString.includes('security') || techString.includes('bảo mật')) return Shield;
  if (techString.includes('analytics') || techString.includes('phân tích')) return TrendingUp;
  if (techString.includes('iot') || techString.includes('edge')) return Cpu;
  if (techString.includes('react') || techString.includes('vue') || techString.includes('angular')) return Code;
  
  return Zap; // Default icon
}

// Hàm chuyển đổi trạng thái sang tiếng Việt
const translateStatus = (status: string) => {
  const statusLower = status?.toLowerCase() || '';
  
  if (statusLower.includes('complete') || statusLower.includes('completed')) 
    return 'Hoàn thành';
  if (statusLower.includes('progress') || statusLower.includes('in progress')) 
    return 'Đang phát triển';
  if (statusLower.includes('beta') || statusLower.includes('testing')) 
    return 'Thử nghiệm';
  if (statusLower.includes('research')) 
    return 'Nghiên cứu';
  if (statusLower.includes('plan') || statusLower.includes('planning')) 
    return 'Lên kế hoạch';
  
  return status; // Giữ nguyên nếu không khớp
}

// Hàm lấy icon dựa trên status
const getStatusIcon = (status: string) => {
  const statusLower = status?.toLowerCase() || '';
  
  if (statusLower.includes('hoàn thành') || statusLower.includes('complete'))
    return <CheckCircle className="h-5 w-5 text-green-400" />
  if (statusLower.includes('thử nghiệm') || statusLower.includes('beta') || statusLower.includes('testing'))
    return <PlayCircle className="h-5 w-5 text-blue-400" />
  if (statusLower.includes('đang phát triển') || statusLower.includes('progress'))
    return <AlertCircle className="h-5 w-5 text-orange-400" />
  
  return <AlertCircle className="h-5 w-5 text-gray-400" />
}

// Hàm lấy màu nền dựa trên status
const getStatusColor = (status: string) => {
  const statusLower = status?.toLowerCase() || '';
  
  if (statusLower.includes('hoàn thành') || statusLower.includes('complete'))
    return "bg-green-600"
  if (statusLower.includes('thử nghiệm') || statusLower.includes('beta') || statusLower.includes('testing'))
    return "bg-blue-600"
  if (statusLower.includes('đang phát triển') || statusLower.includes('progress'))
    return "bg-orange-600"
  
  return "bg-gray-600"
}

export default function HomeProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects')
        if (response.ok) {
          const result = await response.json()
          const projectsData = result.success ? result.data : result
          
          // Chuyển đổi trạng thái sang tiếng Việt
          const projectsWithVietnameseStatus = projectsData.map((project: Project) => ({
            ...project,
            status: translateStatus(project.status || '')
          }))
          
          setProjects(projectsWithVietnameseStatus)
        } else {
          console.error('Failed to fetch projects')
          setProjects([])
        }
      } catch (error) {
        console.error('Error fetching projects:', error)
        setProjects([])
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  // Tính toán số lượng dự án theo trạng thái
  const inProgressCount = projects.filter(p => 
    p.status?.toLowerCase().includes('đang phát triển') && 
    (p.progress || 0) < 100
  ).length;
  
  const completedCount = projects.filter(p => 
    p.status?.toLowerCase().includes('hoàn thành') ||
    p.progress === 100
  ).length;

  if (loading) {
    return (
      <section className="section-standard bg-gradient-to-br from-gray-50/50 to-red-50/30">
        <div className="container-standard">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6 animate-pulse">
              <Code className="w-4 h-4 mr-2" />
              Đang tải...
            </div>
            <h2 className="heading-h2 mb-4">
              Tất Cả <span className="text-red-600">Dự Án</span>
            </h2>
            <p className="text-body-lg text-gray-600 max-w-2xl mx-auto">
              Đang tải dữ liệu dự án...
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:gap-8 animate-pulse">
            {[1, 2, 3, 4].map((_, index) => (
              <div key={index} className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-lg mr-3"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="h-3 bg-gray-200 rounded mb-2 w-full"></div>
                <div className="h-3 bg-gray-200 rounded mb-2 w-full"></div>
                <div className="h-3 bg-gray-200 rounded mb-2 w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="projects-grid" className="section-standard bg-gradient-to-br from-gray-50/50 to-red-50/30">
      <div className="container-standard">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
            <Code className="w-4 h-4 mr-2" />
            Danh Sách Dự Án
          </div>
          <h2 className="heading-h2 mb-4">
            Tất Cả <span className="text-red-600">Dự Án</span>
          </h2>
          <p className="text-body-lg text-gray-600 max-w-2xl mx-auto">
            Khám phá danh mục dự án công nghệ đa dạng từ AI, machine learning đến 
            các giải pháp doanh nghiệp tiên tiến
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
            Tất cả dự án ({projects.length})
          </div>
          <div className="inline-flex items-center px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
            Đang phát triển ({inProgressCount})
          </div>
          <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium">
            Hoàn thành ({completedCount})
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {projects.slice(0, 4).map((project, index) => {
            const IconComponent = getTechIcon(project.technologies || []);
            const colors = [
              { bg: 'bg-red-100', text: 'text-red-600', gradient: 'from-red-100 to-red-200' },
              { bg: 'bg-blue-100', text: 'text-blue-600', gradient: 'from-blue-100 to-blue-200' },
              { bg: 'bg-green-100', text: 'text-green-600', gradient: 'from-green-100 to-green-200' },
              { bg: 'bg-purple-100', text: 'text-purple-600', gradient: 'from-purple-100 to-purple-200' }
            ]
            const color = colors[index % colors.length]
            
            return (
              <div key={index} className="group relative">
                <div className={`absolute inset-0 bg-gradient-to-br ${color.gradient} rounded-2xl transform ${index % 2 === 0 ? 'rotate-1' : '-rotate-1'} group-hover:${index % 2 === 0 ? 'rotate-2' : '-rotate-2'} transition-transform opacity-20`}></div>
                
                <div className="relative card-feature p-3 sm:p-4 bg-white rounded-2xl h-full">
                  <div className="flex flex-col h-full">
                    {/* Project Header */}
                    <div className="flex items-center mb-2 sm:mb-3">
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 ${color.bg} rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-500 mr-3`}>
                        <IconComponent className={`h-5 w-5 sm:h-6 sm:w-6 ${color.text}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm sm:text-base font-bold text-red-600 group-hover:text-red-700 transition-colors duration-300 truncate">
                          {project.name}
                        </h3>
                        <div className="flex items-center mt-1">
                          {getStatusIcon(project.status || '')}
                          <span className="text-gray-600 text-xs ml-1 truncate">{project.status}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Project Description */}
                    <p className="text-gray-600 text-xs sm:text-sm line-clamp-2 mb-2 sm:mb-3 flex-grow">{project.description}</p>
                    
                    {/* Project Tags */}
                    <div className="flex flex-wrap gap-1 sm:gap-2 mb-2 sm:mb-3">
                      <div className="inline-flex items-center px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">
                        {project.company_name || 'ApecTech'}
                      </div>
                      {(project.technologies || []).slice(0, 1).map((tech, idx) => (
                        <div key={idx} className="inline-flex items-center px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs">
                          {tech}
                        </div>
                      ))}
                      {(project.technologies || []).length > 1 && (
                        <div className="inline-flex items-center px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs">
                          +{(project.technologies || []).length - 1}
                        </div>
                      )}
                    </div>
                    
                    {/* Project Footer */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100 mt-auto">
                      <div className="flex items-center">
                        <Users className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 mr-1" />
                        <span className="text-gray-600 text-xs">{project.team_size || 0}</span>
                      </div>
                      
                      <Link href={`/projects/${project.slug}`} className="text-red-600 hover:text-red-700 text-xs sm:text-sm font-medium flex items-center">
                        Chi tiết
                        <ArrowRight className="ml-1 w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        
        <div className="text-center mt-12">
          <Link href="/projects">
            <Button className="w-full sm:w-auto bg-gray-800 hover:bg-gray-900 text-white border-0 px-6 sm:px-8 py-3 hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-xl">
              Xem Tất Cả Dự Án
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}