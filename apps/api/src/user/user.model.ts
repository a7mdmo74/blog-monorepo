import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { Role } from '../generated/prisma/client.js';

registerEnumType(Role, { name: 'Role' });

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field()
  email: string;

  @Field()
  name: string;

  @Field(() => String, { nullable: true })
  avatar: string | null;

  @Field(() => String, { nullable: true })
  bio: string | null;

  @Field(() => Role)
  role: Role;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
