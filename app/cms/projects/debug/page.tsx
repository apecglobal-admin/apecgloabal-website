"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import InternalLayout from "@/components/cms-layout"

export default function ProjectDebugPage() {
  const [companies, setCompanies] = useState<any[]>([])
  const [employees, setEmployees] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const fetchCompanies = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/companies')
      const result = await response.json()
      console.log('Companies API response:', result)
      setCompanies(result.data || [])
    } catch (error) {
      console.error('Error fetching companies:', error)
      setCompanies([])
    } finally {
      setLoading(false)
    }
  }

  const fetchEmployees = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/employees')
      const result = await response.json()
      console.log('Employees API response:', result)
      setEmployees(result.data || [])
    } catch (error) {
      console.error('Error fetching employees:', error)
      setEmployees([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCompanies()
    fetchEmployees()
  }, [])

  return (
    <InternalLayout>
      <div className="p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-4">Debug Project APIs</h1>
            <p className="text-white/70">Kiểm tra API endpoints và dữ liệu</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Companies Section */}
            <div className="bg-black/50 border-blue-500/30 border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Companies ({companies?.length || 0})</h2>
                <Button onClick={fetchCompanies} disabled={loading}>
                  Refresh
                </Button>
              </div>
              
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {Array.isArray(companies) && companies.length > 0 ? (
                  companies.map((company) => (
                    <div key={company.id} className="bg-black/30 p-3 rounded">
                      <div className="text-white font-medium">{company.name}</div>
                      <div className="text-white/60 text-sm">ID: {company.id}</div>
                    </div>
                  ))
                ) : (
                  <div className="text-white/60">No companies found</div>
                )}
              </div>
            </div>

            {/* Employees Section */}
            <div className="bg-black/50 border-green-500/30 border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Employees ({employees?.length || 0})</h2>
                <Button onClick={fetchEmployees} disabled={loading}>
                  Refresh
                </Button>
              </div>
              
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {Array.isArray(employees) && employees.length > 0 ? (
                  employees.map((employee) => (
                    <div key={employee.id} className="bg-black/30 p-3 rounded">
                      <div className="text-white font-medium">{employee.name}</div>
                      <div className="text-white/60 text-sm">
                        Company ID: {employee.company_id} | Email: {employee.email}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-white/60">No employees found</div>
                )}
              </div>
            </div>
          </div>

          {/* Raw API Response */}
          <div className="bg-black/50 border-purple-500/30 border rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">Debug Info</h2>
            <div className="text-white/80 text-sm space-y-2">
              <div>Companies type: {Array.isArray(companies) ? 'Array' : typeof companies}</div>
              <div>Employees type: {Array.isArray(employees) ? 'Array' : typeof employees}</div>
              <div>Companies length: {companies?.length || 'undefined'}</div>
              <div>Employees length: {employees?.length || 'undefined'}</div>
            </div>
          </div>
        </div>
      </div>
    </InternalLayout>
  )
}