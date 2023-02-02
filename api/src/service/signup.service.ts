import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerService } from './mailer.service';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class SignupService {
  constructor(
    private configService: ConfigService,
    private readonly mailer: MailerService,
  ) {}

  async sendConfirmEmail(email: string) {
    const jwtSecret = this.configService.get<string>('JWT_SECRET');
    const token = jwt.sign({ email }, jwtSecret);
    const appUrl = this.configService.get<string>('APP_URL');
    await this.mailer.send({
      to: email,
      template: 'confirm-email',
      subject: 'Confirmação de cadastro',
      context: {
        url: `${appUrl}/confirm-email?token=${token}`,
      },
    });
  }
}
