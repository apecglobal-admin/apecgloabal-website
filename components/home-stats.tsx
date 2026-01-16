"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Building2, Users, Globe, Zap } from "lucide-react"

interface Company {
  id: number
  name: string
  slug: string
  description?: string
  short_description?: string
  logo_url?: string
  website?: string
  address?: string
  phone?: string
  email?: string
  employee_count?: number
  established_year?: number
  industry?: string
  is_featured?: boolean
  created_at?: string
  updated_at?: string
}

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
  created_at?: string
  updated_at?: string
}

interface Stats {
  companies: number
  employees: number
  projects: number
  countries: number
}

export default function HomeStats() {
  const [stats, setStats] = useState<Stats>({
    companies: 0,
    employees: 0,
    projects: 0,
    countries: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '/api'
        // Fetch companies and projects from API
        const [companiesResponse, projectsResponse] = await Promise.all([
          fetch(`${baseUrl}/companies`),
          fetch(`${baseUrl}/projects`)
        ])

        let companies: Company[] = []
        let projects: Project[] = []

        if (companiesResponse.ok) {
          const companiesResult = await companiesResponse.json()
          companies = companiesResult.success ? companiesResult.data : companiesResult
        }

        if (projectsResponse.ok) {
          const projectsResult = await projectsResponse.json()
          projects = projectsResult.success ? projectsResult.data : projectsResult
        }

        // Calculate stats
        const completedProjects = projects.filter(
          (project: Project) => project.status?.toLowerCase().includes('hoàn thành') || 
                                 project.status?.toLowerCase().includes('complete')
        ).length
        
        const totalEmployees = companies.reduce((sum, company) => sum + (company.employee_count || 0), 0)
        
        // Count unique countries from addresses
        const countries = new Set()
        companies.forEach((company) => {
          if (company.address) {
            const addressParts = company.address.split(',')
            const country = addressParts[addressParts.length - 1].trim()
            if (country) countries.add(country)
          }
        })

        setStats({
          companies: companies.length,
          employees: totalEmployees,
          projects: completedProjects,
          countries: countries.size || 3 // Default to 3 if no data
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
        // Set default values on error
        setStats({
          companies: 5,
          employees: 200,
          projects: 15,
          countries: 3
        })
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const statsData = [
    { label: "Công ty thành viên", value: `${stats.companies}+`, icon: Building2 },
    { label: "Nhân viên", value: `${stats.employees}+`, icon: Users },
    { label: "Dự án hoàn thành", value: `${stats.projects}+`, icon: Zap },
    { label: "Quốc gia", value: `${stats.countries}+`, icon: Globe },
  ]

  return (
    <section className="py-8 sm:py-12 lg:py-16 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {statsData.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <Card
                key={index}
                className="bg-white border-gray-200 text-center hover:scale-105 transition-all duration-300 p-4 sm:p-6 shadow-lg hover:shadow-xl hover:border-red-300"
              >
                <CardContent className="p-3 sm:p-6">
                  <IconComponent className="h-6 w-6 sm:h-8 sm:w-8 mx-auto text-red-700 mb-3 sm:mb-4" />
                  <div className={`text-2xl sm:text-3xl font-bold text-red-700 mb-1 sm:mb-2 ${loading ? 'animate-pulse' : ''}`}>
                    {loading ? '...' : stat.value}
                  </div>
                  <div className="text-black/70 text-xs sm:text-sm">{stat.label}</div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}