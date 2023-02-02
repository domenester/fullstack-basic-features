import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {
  @Field({ nullable: false })
  name: string;

  @Field({ nullable: false })
  email: string;
}

@InputType()
export class ListUserInput {
  @Field()
  name?: string;

  @Field()
  email?: string;
}
