import {
  Injectable,
  UnauthorizedException,
  // ForbiddenException,
} from '@nestjs/common';
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private prisma: PrismaService,
  ) {
    super({
      usernameField: 'email',
    }); // Replace 'email' with the actual field used for the username
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await this.authService.verifyUser(email, password);
    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
