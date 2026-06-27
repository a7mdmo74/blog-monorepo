import { InputType, Field, PartialType } from '@nestjs/graphql';
import { CreatePostInput } from './create-post.input.js';

@InputType()
export class UpdatePostInput extends PartialType(CreatePostInput) {}
