"use client"

import type React from "react"
import { ReactNode } from "react"

interface InternalLayoutProps {
  children: ReactNode
}

export default function InternalLayout({ children }: InternalLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black">
      {children}
    </div>
  )
}