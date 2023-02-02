import { Module } from '@nestjs/common';
import { ConfigModuleForRoot } from '../config/module.config';
import { SignupMutation } from '../graphql/mutation/signup';
import { MailerService } from '../service/mailer.service';
import { SignupService } from '../service/signup.service';
import { PrismaModule } from './prisma.module';

@Module({
  imports: [ConfigModuleForRoot(), PrismaModule],
  providers: [SignupService, SignupMutation, MailerService],
  exports: [SignupService],
})
export class SignupModule {}
