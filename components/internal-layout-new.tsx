"use client"

import React from "react"

interface InternalLayoutProps {
  children: React.ReactNode
}

function InternalLayout({ children }: InternalLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black">
      <div className="lg:ml-64 min-h-screen pt-16">
        <main>{children}</main>
      </div>
    </div>
  )
}

export default InternalLayout