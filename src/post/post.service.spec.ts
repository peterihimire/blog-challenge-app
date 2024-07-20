import { Test, TestingModule } from '@nestjs/testing';
import { PostService } from './post.service';
import { PrismaService } from '../prisma/prisma.service';
import {
  ConflictException,
  // NotFoundException
} from '@nestjs/common';

describe('PostService', () => {
  let service: PostService;
  // let prisma: PrismaService;

  const mockPrismaService = {
    post: {
      findFirst: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<PostService>(PostService);
    // prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addPost', () => {
    it('should add a post', async () => {
      const dto = {
        title: 'Test Post',
        content: 'Test Content',
        categories: [],
        slug: 'test-post',
        excerpt: 'Test Excerpt',
        status: 'DRAFT',
        publishedDate: new Date(),
      };
      const userInfo = { id: 1 } as any;

      mockPrismaService.post.findFirst.mockResolvedValue(null);
      mockPrismaService.post.create.mockResolvedValue({
        ...dto,
        userId: userInfo.id,
      });

      const result = await service.addPost(dto, userInfo);

      expect(result).toEqual(dto);
      expect(mockPrismaService.post.findFirst).toHaveBeenCalledWith({
        where: { title: dto.title, userId: userInfo.id },
      });
      expect(mockPrismaService.post.create).toHaveBeenCalledWith({
        data: { ...dto, userId: userInfo.id },
      });
    });

    it('should throw ConflictException if post already exists', async () => {
      const dto = {
        title: 'Test Post',
        content: 'Test Content',
        categories: [],
        slug: 'test-post',
        excerpt: 'Test Excerpt',
        status: 'DRAFT',
        publishedDate: new Date(),
      };
      const userInfo = { id: 1 } as any;

      mockPrismaService.post.findFirst.mockResolvedValue({});

      await expect(service.addPost(dto, userInfo)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  // Additional tests for getPosts, getPostById, editPost, deletePost can be written similarly.
});
