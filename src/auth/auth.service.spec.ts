import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import {
  ForbiddenException,
  // ConflictException
} from '@nestjs/common';
import * as argon from 'argon2';
// import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

jest.mock('argon2');

describe('AuthService', () => {
  let authService: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;
  let configService: ConfigService;

  const mockPrismaService = {
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
    $disconnect: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
    verify: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn().mockReturnValue('test-secret'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a user successfully', async () => {
      const dto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password',
      };
      const hash = 'hashedPassword';
      const mockUser = {
        username: 'testuser',
        email: 'test@example.com',
        password: hash,
      };

      (argon.hash as jest.Mock).mockResolvedValue(hash);
      mockPrismaService.user.create.mockResolvedValue(mockUser);

      const result = await authService.register(dto);

      expect(result).toEqual({
        username: 'testuser',
        email: 'test@example.com',
      });
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: {
          username: dto.username,
          email: dto.email,
          password: hash,
        },
      });
    });

    // it('should throw ConflictException if the user already exists', async () => {
    //   const dto = {
    //     username: 'testuser',
    //     email: 'test@example.com',
    //     password: 'password',
    //   };
    //   const error = new PrismaClientKnownRequestError(
    //     'Unique constraint failed on the fields: (`email`)',
    //     'P2002',
    //     '4.0.0',
    //   );

    //   (argon.hash as jest.Mock).mockResolvedValue('hashedPassword');
    //   mockPrismaService.user.create.mockRejectedValue(error);

    //   await expect(authService.register(dto)).rejects.toThrow(
    //     ConflictException,
    //   );
    // });
  });

  describe('login', () => {
    let originalConsoleError: any;

    beforeAll(() => {
      originalConsoleError = console.error;
      console.error = jest.fn(); // Mock console.error
    });

    afterAll(() => {
      console.error = originalConsoleError; // Restore console.error
    });

    it('should log in a user successfully', async () => {
      const dto = { username: 'testuser', password: 'password' };
      const mockUser = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedPassword',
        acctId: 'acctId',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      (argon.verify as jest.Mock).mockResolvedValue(true);
      mockJwtService.signAsync.mockResolvedValue('token');

      const result = await authService.login(dto);

      expect(result).toEqual({
        user: {
          username: 'testuser',
          email: 'test@example.com',
          acctId: 'acctId',
        },
        accessToken: 'token',
        refreshToken: 'token',
      });
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { username: dto.username },
      });
      expect(argon.verify).toHaveBeenCalledWith('hashedPassword', dto.password);
    });

    it('should throw ForbiddenException if credentials are incorrect', async () => {
      const dto = { username: 'testuser', password: 'password' };

      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(authService.login(dto)).rejects.toThrow(ForbiddenException);
    });

    it('should throw ForbiddenException if password is incorrect', async () => {
      const dto = { username: 'testuser', password: 'password' };
      const mockUser = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedPassword',
        acctId: 'acctId',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      (argon.verify as jest.Mock).mockResolvedValue(false);

      await expect(authService.login(dto)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('refreshToken', () => {
    it('should refresh tokens successfully', async () => {
      const refreshToken = 'refreshToken';
      const payload = { sub: 'acctId', email: 'test@example.com' };

      mockJwtService.verify.mockReturnValue(payload);
      mockJwtService.signAsync.mockResolvedValueOnce('newAccessToken');
      mockJwtService.signAsync.mockResolvedValueOnce('newRefreshToken');

      const result = await authService.refreshToken(refreshToken);

      expect(result).toEqual({
        accessToken: 'newAccessToken',
        newRefreshToken: 'newRefreshToken',
      });
      expect(jwtService.verify).toHaveBeenCalledWith(refreshToken, {
        secret: 'test-secret',
      });
      expect(configService.get).toHaveBeenCalledWith('JWT_SECRET');
    });

    it('should throw ForbiddenException if the refresh token is invalid', async () => {
      const refreshToken = 'invalidRefreshToken';

      mockJwtService.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(authService.refreshToken(refreshToken)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });
});
