import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { CloudinaryService } from './cloudinary.service.js';
import { UploadResult } from './upload.model.js';

@Resolver()
export class UploadResolver {
  constructor(private readonly cloudinary: CloudinaryService) {}

  @Mutation(() => UploadResult)
  async uploadImage(
    @Args('file') file: string,
    @Args('filename', { nullable: true }) filename?: string,
    @Args('folder', { nullable: true }) folder?: string,
  ): Promise<UploadResult> {
    let mimetype: string;
    let base64Data: string;

    if (file.startsWith('data:')) {
      const matches = file.match(/^data:([^;]+);base64,(.+)$/);
      if (!matches) {
        throw new Error('Invalid data URI format');
      }
      mimetype = matches[1];
      base64Data = matches[2];
    } else {
      base64Data = file;
      mimetype = 'image/png';
    }

    const name = filename || `upload-${Date.now()}`;
    const dataUri = `data:${mimetype};base64,${base64Data}`;

    const result = await this.cloudinary.uploadImage(dataUri, folder);

    return {
      id: result.public_id,
      url: result.secure_url,
      publicId: result.public_id,
      filename: name,
      mimetype,
      bytes: result.bytes,
    };
  }

  @Mutation(() => Boolean)
  async deleteImage(
    @Args('publicId', { type: () => String }) publicId: string,
  ): Promise<boolean> {
    await this.cloudinary.deleteImage(publicId);
    return true;
  }
}
