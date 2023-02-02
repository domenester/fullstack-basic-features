import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerService } from './mailer.service';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from './prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordService {
  constructor(
    private configService: ConfigService,
    private readonly mailer: MailerService,
    private readonly prisma: PrismaService,
  ) {}

  async sendResetPassword(email: string) {
    const jwtSecret = this.configService.get<string>('JWT_SECRET');
    const token = jwt.sign({ email }, jwtSecret);
    const appUrl = this.configService.get<string>('APP_URL');
    await this.mailer.send({
      to: email,
      template: 'reset-password',
      subject: 'Atualizar senha',
      context: {
        url: `${appUrl}/reset-password?token=${token}`,
      },
    });
  }

  async resetPassword(userId: string, password: string) {
    const passwordHashfied = await bcrypt.hash(password, 10);
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        password: passwordHashfied,
      },
    });
  }
}
