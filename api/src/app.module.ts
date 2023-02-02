import { Module } from '@nestjs/common';
import { ConfigModuleForRoot } from './config/module.config';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './auth/strategies/jwt.strategy';
import { join } from 'path';
import { UserModule } from './module/user.module';
// import { AuthModule } from './module/auth.module';

const { JWT_SECRET, NODE_ENV } = process.env;

@Module({
  imports: [
    ConfigModuleForRoot(),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      // autoSchemaFile: true,
      ...(NODE_ENV === 'production' && {
        debug: true,
        playground: true,
      }),
      cors: {
        origin: true,
      },
      driver: ApolloDriver,
    }),
    JwtModule.register({
      secret: JWT_SECRET,
    }),
    // AuthModule,
    UserModule,
  ],
  providers: [JwtStrategy],
})
export class AppModule {}
