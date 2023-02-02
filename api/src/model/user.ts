import { Field, ObjectType } from '@nestjs/graphql';
import { Base } from './_base';

@ObjectType()
export class User extends Base {
  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  password: string;
}
