import { Module } from '@nestjs/common';
import { ConfigModuleForRoot } from '../config/module.config';
import { PasswordMutation } from '../graphql/mutation/password';
import { MailerService } from '../service/mailer.service';
import { PasswordService } from '../service/password.service';
import { PrismaModule } from './prisma.module';

@Module({
  imports: [ConfigModuleForRoot(), PrismaModule],
  providers: [PasswordService, PasswordMutation, MailerService],
  exports: [PasswordService],
})
export class PasswordModule {}
