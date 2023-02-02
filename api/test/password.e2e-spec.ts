import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { defaultUser } from './mock/user.mock';
import { PrismaService } from '../src/service/prisma.service';
import * as jwt from 'jsonwebtoken';
import { forgotPassword, resetPassword } from './mock/password.mock';
import { Prisma } from '@prisma/client';

describe('Signup (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get(PrismaService);

    await app.init();

    const { password, ...data } = defaultUser;
    await prisma.user.create({
      data: data as Prisma.UserCreateInput,
    });
  });

  afterAll(async () => {
    await prisma.user.delete({ where: { email: defaultUser.email } });
    await app.close();
  });

  it('should send a link when user forgot password', () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        operationName: null,
        query: forgotPassword(),
      })
      .expect(
        ({
          body: {
            data: {
              forgotPassword: { data, message },
            },
          },
        }) => {
          expect(message).toBe('Email enviado.');
        },
      );
  });

  it('should reset user password', () => {
    const { JWT_SECRET } = process.env;
    const ACCESS_TOKEN = jwt.sign({ email: defaultUser.email }, JWT_SECRET);
    return request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${ACCESS_TOKEN}`)
      .send({
        operationName: null,
        query: resetPassword(),
      })
      .expect(
        async ({
          body: {
            data: {
              resetPassword: { data, message },
            },
          },
        }) => {
          expect(message).toBe('Senha atualizada.');
        },
      );
  });
});
