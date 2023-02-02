import { Args, Resolver, Mutation, Context } from '@nestjs/graphql';
import { BadRequestException, UseGuards, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/strategies/jwt-auth.guard';
import { PrismaService } from '../../../service/prisma.service';
import { CreateUserInput } from '../../../schema/user';
import { User } from '../../../model';
import { Prisma } from '.prisma/client';
import { SignupService } from '../../../service/signup.service';
import { UserResponse } from '../user/interface';
import * as bcrypt from 'bcrypt';
import { RegisterInput } from '../../../schema/signup';

@Resolver(() => User)
export class SignupMutation {
  constructor(
    private readonly prisma: PrismaService,
    private readonly service: SignupService,
  ) {}

  @Mutation(() => UserResponse)
  async signup(
    @Args(
      {
        name: 'body',
        nullable: true,
        type: () => CreateUserInput,
      },
      new ValidationPipe(),
    )
    body: CreateUserInput,
  ): Promise<UserResponse> {
    let user = await this.prisma.user.findFirst({
      where: {
        email: body.email,
      },
    });

    if (user) throw new BadRequestException('Email já cadastrado.');

    user = await this.prisma.user.create({
      data: body as Prisma.UserCreateInput,
    });

    await this.service.sendConfirmEmail(body.email);

    return {
      data: user,
      message: 'Email enviado.',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => UserResponse)
  async register(
    @Args(
      {
        name: 'body',
        nullable: true,
        type: () => RegisterInput,
      },
      new ValidationPipe(),
    )
    body: RegisterInput,
    @Context() { req: { user: _user } },
  ): Promise<UserResponse> {
    const { password } = body;
    const { email } = _user;
    let user = await this.prisma.user.findFirst({
      where: { email },
    });

    if (!user) throw new BadRequestException('Usuário não encontrado.');

    const passwordHashfied = await bcrypt.hash(password, 10);
    user = await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        email,
        password: passwordHashfied,
      },
    });

    return {
      data: user,
      message: 'Usuário registrado com sucesso.',
    };
  }
}
