'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'

export default function SetupServicesPage() {
  const [migrationStatus, setMigrationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [seedStatus, setSeedStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [migrationMessage, setMigrationMessage] = useState('')
  const [seedMessage, setSeedMessage] = useState('')

  const runMigration = async () => {
    setMigrationStatus('loading')
    setMigrationMessage('')
    
    try {
      const response = await fetch('/api/services/migrate')
      const data = await response.json()
      
      if (data.success) {
        setMigrationStatus('success')
        setMigrationMessage(data.message)
      } else {
        setMigrationStatus('error')
        setMigrationMessage(data.error || 'Migration failed')
      }
    } catch (error) {
      setMigrationStatus('error')
      setMigrationMessage('Failed to run migration')
    }
  }

  const runSeed = async () => {
    setSeedStatus('loading')
    setSeedMessage('')
    
    try {
      const response = await fetch('/api/services/seed', {
        method: 'POST'
      })
      const data = await response.json()
      
      if (data.success) {
        setSeedStatus('success')
        setSeedMessage(data.message)
      } else {
        setSeedStatus('error')
        setSeedMessage(data.error || 'Seed failed')
      }
    } catch (error) {
      setSeedStatus('error')
      setSeedMessage('Failed to seed data')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Setup Services Database
          </h1>
          <p className="text-lg text-gray-600">
            Run migration and seed sample data for services
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Migration Card */}
          <Card>
            <CardHeader>
              <CardTitle>1. Run Migration</CardTitle>
              <CardDescription>
                Add slug and updated_at columns to services table
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={runMigration} 
                disabled={migrationStatus === 'loading'}
                className="w-full"
              >
                {migrationStatus === 'loading' && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Run Migration
              </Button>
              
              {migrationStatus === 'success' && (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  <span>{migrationMessage}</span>
                </div>
              )}
              
              {migrationStatus === 'error' && (
                <div className="flex items-center gap-2 text-red-600">
                  <XCircle className="h-5 w-5" />
                  <span>{migrationMessage}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Seed Card */}
          <Card>
            <CardHeader>
              <CardTitle>2. Seed Sample Data</CardTitle>
              <CardDescription>
                Insert sample services data into database
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={runSeed} 
                disabled={seedStatus === 'loading' || migrationStatus !== 'success'}
                className="w-full"
              >
                {seedStatus === 'loading' && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Seed Sample Data
              </Button>
              
              {seedStatus === 'success' && (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  <span>{seedMessage}</span>
                </div>
              )}
              
              {seedStatus === 'error' && (
                <div className="flex items-center gap-2 text-red-600">
                  <XCircle className="h-5 w-5" />
                  <span>{seedMessage}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {migrationStatus === 'success' && seedStatus === 'success' && (
          <Card className="bg-green-50 border-green-200">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
                <h3 className="text-xl font-semibold text-green-900">
                  Setup Complete!
                </h3>
                <p className="text-green-700">
                  Services database is ready. You can now view services on the home page and services page.
                </p>
                <div className="flex gap-4 justify-center pt-4">
                  <Button asChild>
                    <a href="/home">View Home Page</a>
                  </Button>
                  <Button variant="outline" asChild>
                    <a href="/services">View Services Page</a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}