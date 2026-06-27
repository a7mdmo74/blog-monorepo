import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service.js';
import { UploadResolver } from './upload.resolver.js';

/**
 * UploadModule — provides Cloudinary-based image upload via GraphQL.
 *
 * Register this module in AppModule to enable the uploadImage/deleteImage mutations.
 */
@Module({
  providers: [CloudinaryService, UploadResolver],
  exports: [CloudinaryService],
})
export class UploadModule {}
