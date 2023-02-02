import { Args, Resolver, Mutation, Context } from '@nestjs/graphql';
import { BadRequestException, UseGuards, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/strategies/jwt-auth.guard';
import { PrismaService } from '../../../service/prisma.service';
import { User } from '../../../model';
import { UserResponse } from '../user/interface';
import {
  ForgotPasswordInput,
  ResetPasswordInput,
} from '../../../schema/password';
import { PasswordService } from '../../../service/password.service';

@Resolver(() => User)
export class PasswordMutation {
  constructor(
    private readonly prisma: PrismaService,
    private readonly service: PasswordService,
  ) {}

  @Mutation(() => UserResponse)
  async forgotPassword(
    @Args(
      {
        name: 'body',
        nullable: true,
        type: () => ForgotPasswordInput,
      },
      new ValidationPipe(),
    )
    body: ForgotPasswordInput,
  ): Promise<UserResponse> {
    const user = await this.prisma.user.findFirst({
      where: {
        email: body.email,
      },
    });

    if (!user) throw new BadRequestException('Email não cadastrado.');

    await this.service.sendResetPassword(body.email);

    return {
      data: user,
      message: 'Email enviado.',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => UserResponse)
  async resetPassword(
    @Args(
      {
        name: 'body',
        nullable: true,
        type: () => ResetPasswordInput,
      },
      new ValidationPipe(),
    )
    body: ResetPasswordInput,
    @Context() { req: { user: _user } },
  ): Promise<UserResponse> {
    const user = await this.prisma.user.findFirst({
      where: {
        email: _user.email,
      },
    });

    if (!user) throw new BadRequestException('Email não cadastrado.');

    await this.service.resetPassword(user.id, body.password);

    return {
      data: user,
      message: 'Senha atualizada.',
    };
  }
}
