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

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async register(dto: RegDto): Promise<any> {
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

      const token = await this.signToken(user.acctId, user.email);

      return {
        user,
        token,
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async signToken(
    acctId: string,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: acctId,
      email,
    };
    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '20h',
      secret: secret,
    });

    return {
      access_token: token,
    };
  }

  async verifyUser(email: string, password: string): Promise<{ data: any }> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
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

// import {
//   ForbiddenException,
//   Injectable,
//   ConflictException,
// } from '@nestjs/common';
// import { PrismaService } from 'src/prisma/prisma.service';
// import { AuthDto, RegDto } from './dto';
// import * as argon from 'argon2';
// import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
// import { JwtService } from '@nestjs/jwt';
// import { ConfigService } from '@nestjs/config';
// import { Response } from 'express';

// @Injectable()
// export class AuthService {
//   constructor(
//     private prisma: PrismaService,
//     private jwt: JwtService,
//     private config: ConfigService,
//   ) {}

//   async register(
//     dto: RegDto,
//   ): Promise<{ status: string; msg: string; data: any }> {
//     const hash = await argon.hash(dto.password);

//     try {
//       const user = await this.prisma.user.create({
//         data: {
//           username: dto.username,
//           email: dto.email,
//           password: hash,
//         },
//       });

//       delete user.password;
//       delete user.id;

//       return {
//         status: 'success',
//         msg: 'Account registered!',
//         data: user,
//       };
//     } catch (error) {
//       if (error instanceof PrismaClientKnownRequestError) {
//         if (error.code === 'P2002') {
//           throw new ConflictException('Account already exists, please login!');
//         }
//       }
//       throw error;
//     } finally {
//       await this.prisma.$disconnect(); // Disconnect the Prisma client
//     }
//   }

//   async login(dto: AuthDto, res: Response): Promise<void> {
//     try {
//       const user = await this.prisma.user.findUnique({
//         where: {
//           username: dto.username,
//         },
//       });

//       if (!user) throw new ForbiddenException('Incorrect credentials!');

//       const verifyPass = await argon.verify(user.password, dto.password);
//       if (!verifyPass) throw new ForbiddenException('Credential incorrect!');

//       delete user.password;
//       delete user.id;
//       delete user.createdAt;
//       delete user.updatedAt;

//       const token = await this.signToken(user.acctId, user.email);
//       res.cookie('token', token.access_token, {
//         httpOnly: true,
//         secure: true,
//         sameSite: 'lax',
//       });

//       res.json({
//         status: 'success',
//         msg: 'Login successful!',
//         data: {
//           ...user,
//           ...token,
//         },
//       });
//     } catch (error) {
//       console.error('Login error:', error);
//       throw error;
//     } finally {
//       await this.prisma.$disconnect(); // Disconnect the Prisma client
//     }
//   }

//   async signToken(
//     acctId: string,
//     email: string,
//   ): Promise<{ access_token: string }> {
//     const payload = {
//       sub: acctId,
//       email,
//     };
//     const secret = this.config.get('JWT_SECRET');

//     const token = await this.jwt.signAsync(payload, {
//       expiresIn: '20h',
//       secret: secret,
//     });

//     return {
//       access_token: token,
//     };
//   }

//   async validateUser(email: string, password: string): Promise<any> {
//     const user = await this.prisma.user.findUnique({
//       where: {
//         email: email,
//       },
//     });

//     if (!user) throw new ForbiddenException('Incorrect credentials!');

//     const verifyPass = await argon.verify(user.password, password);
//     if (!verifyPass) throw new ForbiddenException('Credential incorrect!');

//     delete user.password;
//     delete user.id;
//     delete user.createdAt;
//     delete user.updatedAt;

//     return user;
//   }

// async verifyUser(
//   email: string,
//   password: string,
// ): Promise<{ status: string; msg: string; data: any }> {
//   try {
//     const user = await this.prisma.user.findUnique({
//       where: { email },
//     });

//     if (!user) throw new ForbiddenException('Incorrect login credentials!');

//     const verifyPass = await argon.verify(user.password, password);
//     if (!verifyPass)
//       throw new ForbiddenException('Credential to login incorrect!');

//     delete user.password;
//     delete user.id;
//     delete user.createdAt;
//     delete user.updatedAt;

//     return {
//       status: 'success',
//       msg: 'Login success!',
//       data: user,
//     };
//   } catch (error) {
//     console.error('Verify user error:', error);
//     throw error;
//   } finally {
//     await this.prisma.$disconnect(); // Disconnect the Prisma client
//   }
// }
// }
