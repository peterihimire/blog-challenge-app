import {
  Injectable,
  UnauthorizedException,
  // ForbiddenException,
} from '@nestjs/common';
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
// import { User } from '@prisma/client';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private prisma: PrismaService,
  ) {
    super({
      // usernameField: 'username',
    });
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.verifyUser(username, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    console.log('this is user from localstrategy...', user);
    return user;
  }
}
