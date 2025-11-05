"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ProjectDetailModal } from "@/components/project-detail-modal"
import InternalLayout from "@/components/cms-layout"

export default function ProjectTestPage() {
  const [showModal, setShowModal] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const projectId = 1 // Test với project có ID = 1

  return (
    <InternalLayout>
      <div className="p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-4">Test Project Features</h1>
            <p className="text-white/70 mb-8">Test các chức năng thêm thành viên, công việc, cột mốc</p>
          </div>

          <div className="flex justify-center space-x-4">
            <Button 
              onClick={() => {
                setEditMode(false)
                setShowModal(true)
              }}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Xem Chi Tiết Dự Án
            </Button>
            
            <Button 
              onClick={() => {
                setEditMode(true)
                setShowModal(true)
              }}
              className="bg-green-600 hover:bg-green-700"
            >
              Chỉnh Sửa Dự Án
            </Button>
          </div>

          <div className="bg-black/50 border-purple-500/30 border rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">Hướng dẫn test:</h2>
            <div className="space-y-2 text-white/80">
              <p>1. Click "Xem Chi Tiết Dự Án" để mở modal</p>
              <p>2. Chuyển sang tab "Đội Ngũ" để test thêm thành viên</p>
              <p>3. Chuyển sang tab "Công Việc" để test thêm công việc</p>
              <p>4. Chuyển sang tab "Cột Mốc" để test thêm cột mốc</p>
              <p>5. Kiểm tra console log để xem API calls</p>
            </div>
          </div>

          <ProjectDetailModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            projectId={projectId}
            editMode={editMode}
          />
        </div>
      </div>
    </InternalLayout>
  )
}