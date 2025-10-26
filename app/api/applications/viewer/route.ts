import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { getSignedCloudinaryUrl } from '@/lib/cloudinary'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const resumeUrl = searchParams.get('resume_url')
    const resumePublicId = searchParams.get('resume_public_id')
    const attachment = searchParams.get('download') === '1'

    if (!resumeUrl && !resumePublicId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing resume identifier'
        },
        { status: 400 }
      )
    }

    let finalUrl = resumeUrl

    if (!finalUrl && resumePublicId) {
      finalUrl = getSignedCloudinaryUrl(resumePublicId, {
        resource_type: 'raw',
        flags: attachment ? 'attachment' : undefined,
        secure: true
      })
    }

    if (!finalUrl) {
      return NextResponse.json(
        {
          success: false,
          error: 'Resume not available'
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        url: finalUrl,
        download: attachment
      }
    })
  } catch (error) {
    console.error('Error generating viewer URL:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate viewer URL'
      },
      { status: 500 }
    )
  }
}