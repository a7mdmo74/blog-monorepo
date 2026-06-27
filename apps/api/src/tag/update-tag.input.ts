import { InputType, Field, PartialType } from '@nestjs/graphql';
import { CreateTagInput } from './create-tag.input.js';

@InputType()
export class UpdateTagInput extends PartialType(CreateTagInput) {}
