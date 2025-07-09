import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'your-cloud-name',
  api_key: process.env.CLOUDINARY_API_KEY || 'your-api-key',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'your-api-secret',
  secure: true,
});

// Upload file to Cloudinary
export async function uploadToCloudinary(file: any, folder?: string | null) {
  try {
    // Convert file to base64 string if it's a buffer
    let fileStr = file;
    if (Buffer.isBuffer(file)) {
      // Use a generic data URI that works for all file types
      fileStr = `data:application/octet-stream;base64,${file.toString('base64')}`;
    }

    console.log('Uploading to Cloudinary folder:', folder || 'root');

    // Upload options
    const uploadOptions: any = {
      resource_type: 'auto',
      use_filename: true,
      unique_filename: true,
      overwrite: true,
      timeout: 120000, // Increase timeout for larger files
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