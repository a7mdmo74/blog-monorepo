import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

/**
 * CloudinaryService — wraps the Cloudinary SDK.
 *
 * Configuration via env vars:
 *   CLOUDINARY_CLOUD_NAME
 *   CLOUDINARY_API_KEY
 *   CLOUDINARY_API_SECRET
 *
 * Call `uploadImage()` with a file path or buffer to get back the
 * Cloudinary URL and metadata.
 */
@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  /**
   * Upload an image file to Cloudinary.
   * @param filePath — local path to the file, or a data URI
   * @param folder   — optional Cloudinary folder (e.g. "blog/covers")
   * @returns the Cloudinary upload result with URL, public_id, etc.
   */
  async uploadImage(filePath: string, folder = 'blog') {
    return cloudinary.uploader.upload(filePath, { folder });
  }

  /** Delete an image by its public_id */
  async deleteImage(publicId: string) {
    return cloudinary.uploader.destroy(publicId);
  }
}
