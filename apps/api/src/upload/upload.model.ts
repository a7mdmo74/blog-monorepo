import { ObjectType, Field, ID } from '@nestjs/graphql';

/**
 * UploadResult — returned after a successful image upload.
 * Contains the Cloudinary URL and metadata the client needs.
 */
@ObjectType()
export class UploadResult {
  @Field(() => ID)
  id: string;

  /** The publicly accessible image URL */
  @Field()
  url: string;

  /** Cloudinary public_id — needed for deletion or transformations */
  @Field()
  publicId: string;

  /** Original filename */
  @Field()
  filename: string;

  /** MIME type (e.g. "image/png") */
  @Field()
  mimetype: string;

  /** File size in bytes */
  @Field()
  bytes: number;
}
