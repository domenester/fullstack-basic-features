import { Args, Resolver, Mutation } from '@nestjs/graphql';
import { UseGuards, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/strategies/jwt-auth.guard';
import { PrismaService } from '../../../service/prisma.service';
import { UserResponse } from './interface';
import { CreateUserInput } from '../../../schema/user';
import { User } from '../../../model';
import { Prisma } from '.prisma/client';

@Resolver(() => User)
export class UserMutation {
  constructor(private readonly prisma: PrismaService) {}

  // @UseGuards(JwtAuthGuard)
  @Mutation(() => UserResponse)
  async createUser(
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
    const user = await this.prisma.user.create({
      data: body as Prisma.UserCreateInput,
    });

    return {
      data: user,
      message: 'Usuário criado.',
    };
  }
}
