import React from "react"
import { 
  FileText, 
  Image, 
  Video, 
  Music, 
  FileSpreadsheet, 
  Presentation, 
  File,
  FileCode
} from "lucide-react"

interface FileTypeIconProps {
  fileType: string
  fileName?: string
  className?: string
}

export default function FileTypeIcon({ fileType, fileName = "", className = "h-5 w-5" }: FileTypeIconProps) {
  const getFileTypeFromName = () => {
    const name = fileName.toLowerCase()
    const type = fileType.toLowerCase()
    
    if (type.includes('pdf') || name.endsWith('.pdf')) return 'pdf'
    if (type.includes('image') || ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'].some(ext => type.includes(ext) || name.endsWith(`.${ext}`))) return 'image'
    if (type.includes('video') || ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'].some(ext => type.includes(ext) || name.endsWith(`.${ext}`))) return 'video'
    if (type.includes('audio') || ['mp3', 'wav', 'ogg', 'aac', 'm4a'].some(ext => type.includes(ext) || name.endsWith(`.${ext}`))) return 'audio'
    if (type.includes('excel') || type.includes('spreadsheetml') || ['xls', 'xlsx'].some(ext => type.includes(ext) || name.endsWith(`.${ext}`))) return 'excel'
    if (type.includes('powerpoint') || type.includes('presentationml') || ['ppt', 'pptx'].some(ext => type.includes(ext) || name.endsWith(`.${ext}`))) return 'powerpoint'
    if (type.includes('msword') || type.includes('wordprocessingml') || ['doc', 'docx'].some(ext => type.includes(ext) || name.endsWith(`.${ext}`))) return 'word'
    if (type.includes('text') || type.includes('plain') || name.endsWith('.txt')) return 'text'
    if (['html', 'css', 'js', 'json', 'xml', 'php', 'py', 'java', 'cpp', 'c'].some(ext => name.endsWith(`.${ext}`))) return 'code'
    return 'other'
  }

  const detectedType = getFileTypeFromName()

  const getIcon = () => {
    switch (detectedType) {
      case 'pdf':
        return <FileText className={`${className} text-red-500`} />
      case 'image':
        return <Image className={`${className} text-green-500`} />
      case 'video':
        return <Video className={`${className} text-blue-500`} />
      case 'audio':
        return <Music className={`${className} text-purple-500`} />
      case 'excel':
        return <FileSpreadsheet className={`${className} text-emerald-500`} />
      case 'powerpoint':
        return <Presentation className={`${className} text-orange-500`} />
      case 'word':
        return <FileText className={`${className} text-blue-600`} />
      case 'text':
        return <FileText className={`${className} text-gray-500`} />
      case 'code':
        return <FileCode className={`${className} text-yellow-500`} />
      default:
        return <File className={`${className} text-gray-400`} />
    }
  }

  return getIcon()
}