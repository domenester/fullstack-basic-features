import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class RegisterInput {
  @Field({ nullable: false })
  password: string;
}
