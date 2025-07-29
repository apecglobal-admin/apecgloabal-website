import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSignedCloudinaryUrls } from '@/lib/cloudinary';
import { v2 as cloudinary } from 'cloudinary';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const documentId = searchParams.get('id');
    
    if (!documentId) {
      return NextResponse.json(
        { error: 'Document ID is required' },
        { status: 400 }
      );
    }

    // Get document from database
    const result = await query(
      'SELECT * FROM documents WHERE id = $1',
      [documentId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    const document = result.rows[0];
    console.log('Document details:', {
      id: document.id,
      name: document.name,
      file_type: document.file_type,
      file_url: document.file_url,
      file_public_id: document.file_public_id,
      resource_type: document.resource_type
    });
    
    // Try to generate signed URLs if we have public_id
    let signedUrls = [];
    if (document.file_public_id) {
      try {
        signedUrls = getSignedCloudinaryUrls(document.file_public_id);
        console.log('Proxy: Generated signed URLs:', signedUrls.map(u => `${u.resourceType}: ${u.url}`));
      } catch (error) {
        console.log('Proxy: Failed to generate signed URLs:', error.message);
      }
    }
    
    // Try multiple approaches to fetch the file
    let response;
    let lastError;
    
    // Approach 1: Try signed URLs (if available) - prioritize the correct resource type
    if (signedUrls.length > 0) {
      // First try the resource type from database if available
      const dbResourceType = document.resource_type || 'raw';
      console.log('Database resource type:', dbResourceType);
      
      // Sort signed URLs to prioritize the database resource type
      const sortedUrls = signedUrls.sort((a, b) => {
        if (a.resourceType === dbResourceType) return -1;
        if (b.resourceType === dbResourceType) return 1;
        return 0;
      });
      
      for (const signedUrlInfo of sortedUrls) {
        try {
          console.log(`Proxy: Trying approach 1 - signed URL (${signedUrlInfo.resourceType}):`, signedUrlInfo.url);
          response = await fetch(signedUrlInfo.url, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
          });
          
          if (response.ok) {
            console.log(`Proxy: Approach 1 successful with ${signedUrlInfo.resourceType}`);
            break;
          } else {
            console.log(`Proxy: Signed URL ${signedUrlInfo.resourceType} failed: ${response.status}`);
          }
        } catch (error) {
          console.log(`Proxy: Signed URL ${signedUrlInfo.resourceType} error:`, error.message);
          lastError = error;
        }
      }
    }
    
    // Approach 2: Try original URL from database
    if (!response || !response.ok) {
      try {
        console.log('Proxy: Trying approach 2 - original URL:', document.file_url);
        response = await fetch(document.file_url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });
        
        if (response.ok) {
          console.log('Proxy: Approach 2 successful');
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      } catch (error2) {
        console.log('Proxy: Approach 2 failed:', error2.message);
        lastError = error2;
      }
    }
    
    // Approach 3: Try multiple public URL formats
    if (!response || !response.ok) {
      try {
        console.log('Proxy: Trying approach 3 - public URL variations');
        
        // Try different resource types and formats - prioritize database resource type
        const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
        const publicId = document.file_public_id;
        const dbResourceType = document.resource_type || 'raw';
        
        // Create URL variations with database resource type first
        const urlVariations = [
          // First try with database resource type
          `https://res.cloudinary.com/${cloudName}/${dbResourceType}/upload/${publicId}`,
          // Then try other resource types
          `https://res.cloudinary.com/${cloudName}/raw/upload/${publicId}`,
          `https://res.cloudinary.com/${cloudName}/image/upload/${publicId}`,
          `https://res.cloudinary.com/${cloudName}/video/upload/${publicId}`,
          `https://res.cloudinary.com/${cloudName}/auto/upload/${publicId}`,
          // Try without folder prefix if public_id includes folder
          publicId && publicId.includes('/') ? `https://res.cloudinary.com/${cloudName}/${dbResourceType}/upload/${publicId.split('/').pop()}` : null,
          publicId && publicId.includes('/') ? `https://res.cloudinary.com/${cloudName}/raw/upload/${publicId.split('/').pop()}` : null,
        ].filter(Boolean)
        // Remove duplicates
        .filter((url, index, arr) => arr.indexOf(url) === index);
        
        let urlWorked = false;
        
        for (const testUrl of urlVariations) {
          console.log('Proxy: Testing URL:', testUrl);
          
          try {
            const testResponse = await fetch(testUrl, {
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
              }
            });
            
            if (testResponse.ok) {
              console.log('Proxy: URL worked:', testUrl);
              response = testResponse;
              urlWorked = true;
              break;
            } else {
              console.log('Proxy: URL failed with status:', testResponse.status);
            }
          } catch (urlError) {
            console.log('Proxy: URL failed with error:', urlError.message);
          }
        }
        
        if (!urlWorked) {
          throw new Error('All URL variations failed');
        }
      } catch (error3) {
        console.log('Proxy: Approach 3 failed:', error3.message);
        lastError = error3;
      }
    }
    
    // Approach 4: Try Cloudinary API direct access
    if (!response || !response.ok) {
      if (document.file_public_id) {
        try {
          console.log('Proxy: Trying approach 4 - Cloudinary API');
          
          // Configure cloudinary if not already done
          cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
            secure: true,
          });
          
          // Try different resource types - prioritize database resource type
          const dbResourceType = document.resource_type || 'raw';
          const resourceTypes = [dbResourceType, 'raw', 'image', 'video', 'auto']
            .filter((type, index, arr) => arr.indexOf(type) === index); // Remove duplicates
          let resourceFound = false;
          
          for (const resourceType of resourceTypes) {
            try {
              console.log(`Proxy: Trying Cloudinary API with resource_type: ${resourceType}`);
              
              const resource = await cloudinary.api.resource(document.file_public_id, {
                resource_type: resourceType
              });
              
              console.log('Proxy: Got resource info:', {
                public_id: resource.public_id,
                resource_type: resource.resource_type,
                secure_url: resource.secure_url
              });
              
              response = await fetch(resource.secure_url, {
                headers: {
                  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
              });
              
              if (response.ok) {
                console.log('Proxy: Approach 4 successful with resource_type:', resourceType);
                resourceFound = true;
                break;
              } else {
                console.log(`Proxy: Resource URL failed with status: ${response.status}`);
              }
            } catch (resourceError) {
              console.log(`Proxy: Resource type ${resourceType} failed:`, resourceError.message);
            }
          }
          
          if (!resourceFound) {
            throw new Error('No valid resource found in Cloudinary API');
          }
        } catch (error4) {
          console.log('Proxy: Approach 4 failed:', error4.message || error4);
          lastError = error4;
        }
      }
    }
    
    // Approach 5: Last resort - try to construct URL manually
    if (!response || !response.ok) {
      if (document.file_public_id) {
        try {
          console.log('Proxy: Trying approach 5 - manual URL construction');
          
          // Extract just the filename from public_id
          const publicId = document.file_public_id;
          const filename = publicId.includes('/') ? publicId.split('/').pop() : publicId;
          
          // Try different manual constructions - prioritize database resource type
          const dbResourceType = document.resource_type || 'raw';
          const manualUrls = [
            // First try with database resource type
            `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/${dbResourceType}/upload/v1/${publicId}`,
            `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/${dbResourceType}/upload/${filename}`,
            // Then try other resource types
            `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/raw/upload/v1/${publicId}`,
            `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/v1/${publicId}`,
            `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/raw/upload/${filename}`,
            `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/${filename}`,
          ].filter((url, index, arr) => arr.indexOf(url) === index); // Remove duplicates
          
          for (const manualUrl of manualUrls) {
            try {
              console.log('Proxy: Testing manual URL:', manualUrl);
              const manualResponse = await fetch(manualUrl, {
                headers: {
                  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
              });
              
              if (manualResponse.ok) {
                console.log('Proxy: Manual URL worked:', manualUrl);
                response = manualResponse;
                break;
              }
            } catch (manualError) {
              console.log('Proxy: Manual URL failed:', manualError.message);
            }
          }
          
          if (!response || !response.ok) {
            throw new Error('All manual URL constructions failed');
          }
        } catch (error5) {
          console.log('Proxy: Approach 5 failed:', error5.message);
          lastError = error5;
        }
      }
    }
    
    if (!response || !response.ok) {
      console.error('Proxy: All approaches failed. Last error:', lastError?.message);
      throw new Error(`Failed to fetch file: ${lastError?.message || 'Unknown error'}`);
    }

    // Get the file data
    const fileData = await response.arrayBuffer();
    
    console.log('Proxy: File fetched successfully, size:', fileData.byteLength);
    
    // Update download count
    await query(
      'UPDATE documents SET download_count = download_count + 1 WHERE id = $1',
      [documentId]
    );

    // Convert ArrayBuffer to Uint8Array for proper binary handling
    const uint8Array = new Uint8Array(fileData);

    // Return the file with proper headers
    return new NextResponse(uint8Array, {
      status: 200,
      headers: {
        'Content-Type': document.file_type || 'application/octet-stream',
        'Content-Length': fileData.byteLength.toString(),
        'Cache-Control': 'public, max-age=31536000',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Disposition': `inline; filename="${document.name}"`,
      },
    });
  } catch (error) {
    console.error('Error in document proxy:', error);
    return NextResponse.json(
      { error: `Failed to load document: ${error.message}` },
      { status: 500 }
    );
  }
}