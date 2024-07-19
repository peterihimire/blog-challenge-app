import {
  ForbiddenException,
  Injectable,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto, RegDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async register(dto: RegDto): Promise<User> {
    const hash = await argon.hash(dto.password);

    try {
      const user = await this.prisma.user.create({
        data: {
          username: dto.username,
          email: dto.email,
          password: hash,
        },
      });

      delete user.password;
      delete user.id;

      return user;
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Account already exists, please login!');
      }
      throw error;
    }
  }

  async login(dto: AuthDto): Promise<any> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          username: dto.username,
        },
      });

      if (!user) throw new ForbiddenException('Incorrect credentials!');

      const verifyPass = await argon.verify(user.password, dto.password);
      if (!verifyPass) throw new ForbiddenException('Credentials incorrect!');

      delete user.password;
      delete user.id;
      delete user.createdAt;
      delete user.updatedAt;

      const accessToken = await this.signAccessToken(user.acctId, user.email);
      const refreshToken = await this.signRefreshToken(user.acctId, user.email);

      return { user, accessToken, refreshToken };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async signAccessToken(acctId: string, email: string): Promise<string> {
    const payload = { sub: acctId, email };
    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: secret,
    });

    return token;
  }

  async signRefreshToken(acctId: string, email: string): Promise<string> {
    const payload = { sub: acctId, email };
    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '7d',
      secret: secret,
    });

    return token;
  }

  async refreshToken(
    refreshToken: string,
  ): Promise<{ accessToken: string; newRefreshToken: string }> {
    try {
      const payload = this.jwt.verify(refreshToken, {
        secret: this.config.get('JWT_SECRET'),
      });

      const newAccessToken = await this.signAccessToken(
        payload.sub,
        payload.email,
      );
      const newRefreshToken = await this.signRefreshToken(
        payload.sub,
        payload.email,
      );

      return { accessToken: newAccessToken, newRefreshToken: newRefreshToken };
    } catch (error) {
      throw new ForbiddenException('Invalid refresh token');
    }
  }

  async verifyUser(username: string, password: string): Promise<{ data: any }> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { username },
      });

      if (!user) throw new ForbiddenException('Incorrect login credentials!');

      const verifyPass = await argon.verify(user.password, password);
      if (!verifyPass)
        throw new ForbiddenException('Credential to login incorrect!');

      delete user.password;
      delete user.id;
      delete user.createdAt;
      delete user.updatedAt;
      console.log('this is user from service...', user);

      return { data: user };
    } catch (error) {
      console.error('Verify user error:', error);
      throw error;
    } finally {
      await this.prisma.$disconnect(); // Disconnect the Prisma client
    }
  }
}
