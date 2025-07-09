export default function DebugPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-2xl font-bold mb-6">Debug Information</h1>
      
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Environment Variables:</h2>
          <pre className="bg-gray-800 p-4 rounded mt-2">
            NEXT_PUBLIC_API_URL: {process.env.NEXT_PUBLIC_API_URL || 'undefined'}
            {'\n'}NEXT_PUBLIC_APP_URL: {process.env.NEXT_PUBLIC_APP_URL || 'undefined'}
            {'\n'}NODE_ENV: {process.env.NODE_ENV || 'undefined'}
          </pre>
        </div>
        
        <div>
          <h2 className="text-lg font-semibold">Current Port Detection:</h2>
          <p className="text-sm text-gray-300">
            Check the browser URL to see what port we're running on
          </p>
        </div>
        
        <div>
          <h2 className="text-lg font-semibold">API Test:</h2>
          <div className="space-y-2">
            <a 
              href="/api/companies" 
              className="block text-blue-400 hover:text-blue-300 underline"
              target="_blank"
            >
              Test /api/companies
            </a>
            <a 
              href="/api/projects" 
              className="block text-blue-400 hover:text-blue-300 underline"
              target="_blank"
            >
              Test /api/projects
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}