import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class RegisterInput {
  @Field()
  email: string;

  @Field()
  name: string;

  @Field()
  password: string;
}
