import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { createWriteStream, mkdirSync, unlinkSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { finished } from 'node:stream/promises';
import { CloudinaryService } from './cloudinary.service.js';
import { UploadResult } from './upload.model.js';

/**
 * UploadResolver — handles image uploads via GraphQL.
 *
 * Accepts a base64-encoded image string and uploads it to Cloudinary.
 * This approach works with Apollo Server v5 (which dropped file upload support).
 *
 * Usage in GraphQL:
 *   mutation {
 *     uploadImage(
 *       file: "data:image/png;base64,iVBORw0KGgo..."
 *       filename: "image.png"
 *       folder: "blog/covers"
 *     ) {
 *       url
 *       publicId
 *     }
 *   }
 */
@Resolver()
export class UploadResolver {
  constructor(private readonly cloudinary: CloudinaryService) {}

  @Mutation(() => UploadResult)
  async uploadImage(
    @Args('file') file: string,
    @Args('filename', { nullable: true }) filename?: string,
    @Args('folder', { nullable: true }) folder?: string,
  ): Promise<UploadResult> {
    // Parse the data URI or raw base64
    let base64Data: string;
    let mimetype: string;
    let ext: string;

    if (file.startsWith('data:')) {
      // data:image/png;base64,iVBOR...
      const matches = file.match(/^data:([^;]+);base64,(.+)$/);
      if (!matches) {
        throw new Error('Invalid data URI format');
      }
      mimetype = matches[1];
      base64Data = matches[2];
      ext = mimetype.split('/')[1] || 'png';
    } else {
      // Raw base64 string
      base64Data = file;
      mimetype = 'image/png';
      ext = 'png';
    }

    const name = filename || `upload-${Date.now()}.${ext}`;

    // Save to temp file
    const uploadDir = join(process.cwd(), 'tmp', 'uploads');
    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true });
    }
    const filePath = join(uploadDir, `${Date.now()}-${name}`);

    const buffer = Buffer.from(base64Data, 'base64');
    const stream = createWriteStream(filePath);
    stream.write(buffer);
    stream.end();
    await finished(stream);

    // Upload to Cloudinary
    const result = await this.cloudinary.uploadImage(filePath, folder);

    // Clean up
    unlinkSync(filePath);

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
