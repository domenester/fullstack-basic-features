import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transporter, createTransport, SendMailOptions } from 'nodemailer';
import * as hbs from 'nodemailer-express-handlebars';
import * as path from 'path';

@Injectable()
export class MailerService {
  private smtpTransport: Transporter;

  constructor(private configService: ConfigService) {}

  async send(options: SendMailOptions): Promise<void> {
    const { NODE_ENV } = process.env;
    if (NODE_ENV === 'test' || NODE_ENV === 'development') return;
    const email = this.configService.get<string>('EMAIL_ACCOUNT');
    // this.setGodaddySmtpTransport();
    this.setGmailSmtpTransport();
    this.setUpTemplates();
    return new Promise((resolve, reject) => {
      this.smtpTransport.sendMail(
        {
          from: email,
          ...options,
        },
        (error, response) => {
          this.smtpTransport.close();
          if (error) {
            console.log('Error sending email: ', error);
            reject(error);
          }
          resolve(response);
        },
      );
    });
  }

  setUpTemplates() {
    const { NODE_ENV } = process.env;
    let hbsBody = {
      viewEngine: {
        extName: '.handlebars',
        layoutsDir: path.resolve(__dirname, '../templates/email'),
        partialsDir: path.resolve(__dirname, '../templates/email/partials'),
        defaultLayout: false,
      },
      viewPath: path.resolve(__dirname, '../templates/email'),
    };

    if (NODE_ENV === 'test' || NODE_ENV === 'development') {
      hbsBody = {
        ...hbsBody,
        viewEngine: {
          ...hbsBody.viewEngine,
          layoutsDir: path.resolve(__dirname, '../../templates/email'),
          partialsDir: path.resolve(
            __dirname,
            '../../templates/email/partials',
          ),
        },
        viewPath: path.resolve(__dirname, '../../templates/email'),
      };
    }
    this.smtpTransport.use('compile', hbs(hbsBody));
  }

  setGmailSmtpTransport() {
    const email = this.configService.get<string>('EMAIL_ACCOUNT');
    const password = this.configService.get<string>('EMAIL_PASSWORD');
    this.smtpTransport = createTransport({
      service: 'gmail',
      auth: {
        user: email,
        pass: password,
      },
    });
  }

  setGodaddySmtpTransport() {
    const email = this.configService.get<string>('EMAIL_ACCOUNT');
    const password = this.configService.get<string>('EMAIL_PASSWORD');
    this.smtpTransport = createTransport({
      // service: 'Godaddy',
      host: 'smtpout.secureserver.net',
      port: 465,
      auth: {
        user: email,
        pass: password,
      },
    });
  }
}
