import { Module } from '@nestjs/common';
import { ConfigModuleForRoot } from '../config/module.config';
import { UserMutation } from '../graphql/mutation/user';
import { UserQuery } from '../graphql/query/user';
import { PrismaModule } from './prisma.module';

@Module({
  imports: [ConfigModuleForRoot(), PrismaModule],
  providers: [UserMutation, UserQuery],
})
export class UserModule {}
