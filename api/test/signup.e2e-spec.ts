import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { defaultUser } from './mock/user.mock';
import { PrismaService } from '../src/service/prisma.service';
import { register, signup } from './mock/signup.mock';
import * as jwt from 'jsonwebtoken';

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
  });

  afterAll(async () => {
    await prisma.user.delete({ where: { email: defaultUser.email } });
    await app.close();
  });

  it('should send a link and create an user', () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        operationName: null,
        query: signup(),
      })
      .expect(
        ({
          body: {
            data: {
              signup: { data },
            },
          },
        }) => {
          expect(data.id).toBeDefined();
          expect(data.name).toBe(defaultUser.name);
          expect(data.email).toBe(defaultUser.email);
        },
      );
  });

  it('should verify an user and create password', () => {
    const { JWT_SECRET } = process.env;
    const ACCESS_TOKEN = jwt.sign({ email: defaultUser.email }, JWT_SECRET);
    return request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${ACCESS_TOKEN}`)
      .send({
        operationName: null,
        query: register(),
      })
      .expect(
        async ({
          body: {
            data: {
              register: { data },
            },
          },
        }) => {
          expect(data.id).toBeDefined();
          expect(data.name).toBe(defaultUser.name);
          expect(data.email).toBe(defaultUser.email);
          const user = await prisma.user.findFirst({
            where: { email: defaultUser.email },
          });
          expect(user.password).toBeDefined();
        },
      );
  });
});
