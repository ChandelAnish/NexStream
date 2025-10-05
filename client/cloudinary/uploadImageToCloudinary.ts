import { v2 as cloudinary } from 'cloudinary';
import path from 'path';


// Cloudinary config (should ideally be moved to a separate config file and imported)
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads any file (image, pdf, video, etc.) to Cloudinary.
 *
 * @param filePath - Local path to file or remote URL (e.g., from multer or temp upload)
 * @param publicId - Optional custom public ID (e.g., "profileImage-username")
 * @param folder - Optional folder name in Cloudinary
 */

export async function uploadFileToCloudinary(
  filePath: string,
  publicId?: string,
  folder: string="medmin"
): Promise<string | undefined> {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: 'auto', // By default, Cloudinary assumes you're uploading images. resource_type: 'auto' does: Cloudinary will automatically detect the file type (image, video, raw) and place it in the right category.
      public_id: publicId,
      folder,
    });

    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return undefined;
  }
}
