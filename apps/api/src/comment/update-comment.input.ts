import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdateCommentInput {
  @Field()
  content: string;
}
