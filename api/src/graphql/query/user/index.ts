import { Args, Resolver, Query } from '@nestjs/graphql';
import { UseGuards, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/strategies/jwt-auth.guard';
import { PrismaService } from '../../../service/prisma.service';
import { User } from '../../../model';
import { UserListResponse } from './interface';
import { ListUserInput } from '../../../schema/user';

@Resolver(() => User)
export class UserQuery {
  constructor(private readonly prisma: PrismaService) {}

  // @UseGuards(JwtAuthGuard)
  @Query(() => UserListResponse)
  async listUser(
    @Args(
      {
        name: 'body',
        nullable: true,
        type: () => ListUserInput,
      },
      new ValidationPipe(),
    )
    body: ListUserInput,
  ): Promise<UserListResponse> {
    const { name, email } = body;
    const where = {
      ...(name && { name: { contains: name } }),
      ...(email && { email: { contains: email } }),
    };
    const users = await this.prisma.user.findMany({ where });
    return {
      data: users,
      message: '',
    };
  }

  // @UseGuards(JwtAuthGuard)
  // @Query(() => InvoiceListWithCountResponse)
  // async listInvoicesWithCount(
  //   @Args({
  //     name: 'body',
  //     nullable: true,
  //     type: () => ListInvoiceInput
  //   }, new ValidationPipe()) body: ListInvoiceInput
  // ): Promise<InvoiceListWithCountResponse> {
  //   const {
  //     take = 100,
  //     skip = 0
  //   } = body;

  //   const where = this.getListInvoiceWhere(body)

  //   const [
  //     count,
  //     invoices,
  //     aggregate = {_sum: {total: 0, paidValue: 0}}
  //   ] = await this.prisma.$transaction([
  //     this.prisma.invoice.count({where}),
  //     this.prisma.invoice.findMany({
  //       take,
  //       skip,
  //       where
  //     }),
  //     this.prisma.invoice.aggregate({
  //       where,
  //       _sum: {
  //         total: true
  //       }
  //     })

  //   ])

  //   return {
  //     data: {
  //       data: invoices,
  //       count,
  //       totalSum: aggregate._sum.total ? aggregate._sum.total : 0
  //     },
  //     message: ''
  //   }
  // }
}
