import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class ForgotPasswordInput {
  @Field({ nullable: false })
  email: string;
}

@InputType()
export class ResetPasswordInput {
  @Field({ nullable: false })
  password: string;
}
