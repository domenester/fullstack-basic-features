import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { createUser, defaultUser } from './mock/user.mock';
import { PrismaService } from '../src/service/prisma.service';

describe('User (e2e)', () => {
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

  it('should create an user', () => {
    const { ACCESS_TOKEN } = process.env;
    return request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${ACCESS_TOKEN}`)
      .send({
        operationName: null,
        query: createUser(),
      })
      .expect(
        ({
          body: {
            data: {
              createUser: { data },
            },
          },
        }) => {
          expect(data.id).toBeDefined();
          expect(data.name).toBe(defaultUser.name);
          expect(data.email).toBe(defaultUser.email);
        },
      );
  });
});
