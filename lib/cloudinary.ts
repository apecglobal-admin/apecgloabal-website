import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'your-cloud-name',
  api_key: process.env.CLOUDINARY_API_KEY || 'your-api-key',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'your-api-secret',
  secure: true,
});

// Helper function to determine resource type from file
function getResourceTypeFromFile(fileStr: string, mimeType?: string): string {
  // Extract MIME type from data URL
  if (fileStr.startsWith('data:')) {
    const mimeMatch = fileStr.match(/data:([^;]+)/);
    if (mimeMatch) {
      const mime = mimeMatch[1];
      console.log('Detected MIME type from data URL:', mime);
      
      if (mime.startsWith('image/')) return 'image';
      if (mime.startsWith('video/')) return 'video';
      if (mime.startsWith('audio/')) return 'video'; // Cloudinary uses 'video' for audio
      
      // For documents like PDF, Word, etc.
      if (mime.includes('pdf') || mime.includes('document') || mime.includes('text') || 
          mime.includes('application/') || mime.includes('octet-stream')) {
        return 'raw';
      }
    }
  }
  
  // Fallback to mimeType parameter
  if (mimeType) {
    console.log('Using provided MIME type:', mimeType);
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'video';
    if (mimeType.includes('pdf') || mimeType.includes('document') || 
        mimeType.includes('text') || mimeType.includes('application/')) return 'raw';
  }
  
  console.log('Defaulting to raw resource type');
  return 'raw'; // Default to raw for documents
}

// Upload file to Cloudinary
export async function uploadToCloudinary(file: any, folder?: string | null, mimeType?: string) {
  try {
    // Convert file to base64 string if it's a buffer
    let fileStr = file;
    if (Buffer.isBuffer(file)) {
      // Use a generic data URI that works for all file types
      fileStr = `data:application/octet-stream;base64,${file.toString('base64')}`;
    }

    // Determine the correct resource type
    const resourceType = getResourceTypeFromFile(fileStr, mimeType);
    console.log('Determined resource type:', resourceType);
    console.log('Uploading to Cloudinary folder:', folder || 'root');

    // Upload options
    const uploadOptions: any = {
      resource_type: resourceType, // Use determined resource type instead of 'auto'
      use_filename: true,
      unique_filename: true,
      overwrite: true,
      timeout: 120000, // Increase timeout for larger files
      type: 'upload', // Ensure public upload
      access_mode: 'public', // Make files publicly accessible
    };

    // Only add folder if it's provided and not empty
    if (folder && folder.trim()) {
      uploadOptions.folder = folder;
    }

    // Upload to Cloudinary with improved options
    const result = await cloudinary.uploader.upload(fileStr, uploadOptions);

    console.log('Cloudinary upload success:', result.public_id);

    return {
      public_id: result.public_id,
      url: result.secure_url,
      format: result.format,
      width: result.width,
      height: result.height,
      resource_type: resourceType, // Include the resource type used
    };
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw new Error(`Failed to upload file to Cloudinary: ${error.message}`);
  }
}

// Delete file from Cloudinary
export async function deleteFromCloudinary(publicId: string) {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw new Error('Failed to delete file from Cloudinary');
  }
}

// Get Cloudinary URL from public ID
export function getCloudinaryUrl(publicId: string, options: any = {}) {
  return cloudinary.url(publicId, options);
}

// Generate signed URL for secure access
export function getSignedCloudinaryUrl(publicId: string, options: any = {}) {
  const signedOptions = {
    sign_url: true,
    type: 'upload', // Ensure public upload resource
    secure: true,
    resource_type: 'auto', // Default to auto-detect unless overridden
    ...options
  };

  return cloudinary.url(publicId, signedOptions);
}

// Generate multiple signed URL variations
export function getSignedCloudinaryUrls(publicId: string) {
  const resourceTypes = ['raw', 'image', 'video', 'auto'];
  const urls = [];
  
  for (const resourceType of resourceTypes) {
    try {
      const url = cloudinary.url(publicId, {
        sign_url: true,
        type: 'upload',
        secure: true,
        resource_type: resourceType,
      });
      urls.push({ resourceType, url });
    } catch (error) {
      console.log(`Failed to generate signed URL for ${resourceType}:`, error.message);
    }
  }
  
  return urls;
}