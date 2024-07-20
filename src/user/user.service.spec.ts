import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';

describe('UserService', () => {
  let userService: UserService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
    },
    $disconnect: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('userInfo', () => {
    const userData = {
      status: 'success',
      msg: 'User found',
      data: {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        acctId: '12345',
      },
    };

    it('should return user info without sensitive fields when the user exists', async () => {
      const mockUser = {
        email: 'test@example.com',
        username: 'testuser',
        posts: [],
        password: 'password',
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await userService.userInfo(userData);

      expect(result).toEqual({
        email: 'test@example.com',
        username: 'testuser',
        posts: [],
      });
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: userData.data.email },
        include: {
          posts: {
            select: {
              userId: false,
              id: false,
              title: true,
              excerpt: true,
              content: true,
              status: true,
              publishedDate: true,
              categories: true,
              slug: true,
              uuid: true,
            },
          },
        },
      });
      expect(prismaService.$disconnect).toHaveBeenCalled();
    });

    it('should throw ForbiddenException when the user does not exist', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(userService.userInfo(userData)).rejects.toThrow(
        ForbiddenException,
      );
      expect(prismaService.$disconnect).toHaveBeenCalled();
    });

    it('should handle database errors gracefully', async () => {
      mockPrismaService.user.findUnique.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(userService.userInfo(userData)).rejects.toThrow(
        'Database error',
      );
      expect(prismaService.$disconnect).toHaveBeenCalled();
    });
  });
});
