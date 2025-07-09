"use client"

import { useApiCache } from "@/hooks/use-api-cache"
import Image from "next/image"

interface Company {
  id: number
  name: string
  slug: string
  logo_url?: string
}

export default function OptimizedCompaniesList() {
  const { data: companies, loading, error } = useApiCache<Company[]>(
    'companies',
    async () => {
      const response = await fetch('/api/companies')
      if (!response.ok) {
        throw new Error('Failed to fetch companies')
      }
      return response.json()
    },
    5 * 60 * 1000 // Cache 5 phút
  )

  if (loading) return <div>Loading companies...</div>
  if (error) return <div>Error: {error}</div>
  if (!companies) return null

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {companies.map((company) => (
        <div key={company.id} className="flex flex-col items-center space-y-2">
          {company.logo_url ? (
            <div className="relative w-16 h-16">
              <Image
                src={company.logo_url}
                alt={`${company.name} logo`}
                fill
                className="object-contain"
                sizes="64px"
              />
            </div>
          ) : (
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium">{company.name[0]}</span>
            </div>
          )}
          <span className="text-xs text-center">{company.name}</span>
        </div>
      ))}
    </div>
  )
}