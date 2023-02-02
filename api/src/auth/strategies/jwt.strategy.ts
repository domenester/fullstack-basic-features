import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

const {JWT_SECRET} = process.env

console.log({JWT_SECRET})

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: JWT_SECRET || 'c7c4520fbd3d418f9807d1ecd2393cbc',
    });
  }

  async validate(payload: any): Promise<any> {
    const { userId } = payload;
    if (!userId) {
      throw new UnauthorizedException();
    }
    return {id: userId};
  }
}
