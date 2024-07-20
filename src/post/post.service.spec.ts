import { Test, TestingModule } from '@nestjs/testing';
import { PostService } from './post.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('PostService', () => {
  let service: PostService;

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
        categories: ['tech'],
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
        categories: ['tech'],
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

    it('should handle database errors for already exiting title', async () => {
      const dto = {
        title: 'Test Post',
        content: 'Test Content',
        categories: ['tech'],
        slug: 'test-post',
        excerpt: 'Test Excerpt',
        status: 'DRAFT',
        publishedDate: new Date(),
      };
      const userInfo = { id: 1 } as any;

      mockPrismaService.post.create.mockRejectedValue(
        new Error("Post with title 'Test Post' already exists for this user!"),
      );

      await expect(service.addPost(dto, userInfo)).rejects.toThrow(
        "Post with title 'Test Post' already exists for this user!",
      );
    });
  });

  // Additional tests for getPosts, getPostById, editPost, deletePost can be written similarly.
  describe('getPosts', () => {
    it('should return all posts for a user', async () => {
      const userInfo = { id: 1 } as any;
      const posts = [
        {
          title: 'Post 1',
          content: 'Content 1',
          categories: ['tech'],
          slug: 'post-1',
          excerpt: 'Excerpt 1',
          status: 'DRAFT',
          publishedDate: new Date(),
          userId: userInfo.id,
        },
      ];

      mockPrismaService.post.findMany.mockResolvedValue(posts);

      const result = await service.getPosts(userInfo);

      expect(result).toEqual(
        posts.map((post) => {
          delete post.userId;

          return post;
        }),
      );
      expect(mockPrismaService.post.findMany).toHaveBeenCalledWith({
        where: { userId: userInfo.id },
      });
    });

    it('should throw NotFoundException if no posts found', async () => {
      const userInfo = { id: 1 } as any;

      mockPrismaService.post.findMany.mockResolvedValue([]);

      await expect(service.getPosts(userInfo)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getPostById', () => {
    it('should return a post by id', async () => {
      const userInfo = { id: 1 } as any;
      const postId = 'some-uuid';
      const post = {
        title: 'Post 1',
        content: 'Content 1',
        categories: ['tech'],
        slug: 'post-1',
        excerpt: 'Excerpt 1',
        status: 'DRAFT',
        publishedDate: new Date(),
        userId: userInfo.id,
      };

      mockPrismaService.post.findUnique.mockResolvedValue(post);

      const result = await service.getPostById(postId, userInfo);

      expect(result).toEqual({
        title: 'Post 1',
        content: 'Content 1',
        categories: ['tech'],
        slug: 'post-1',
        excerpt: 'Excerpt 1',
        status: 'DRAFT',
        publishedDate: post.publishedDate,
      });
      expect(mockPrismaService.post.findUnique).toHaveBeenCalledWith({
        where: { uuid: postId, userId: userInfo.id },
      });
    });

    it('should throw NotFoundException if post not found', async () => {
      const userInfo = { id: 1 } as any;
      const postId = 'some-uuid';

      mockPrismaService.post.findUnique.mockResolvedValue(null);

      await expect(service.getPostById(postId, userInfo)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('editPost', () => {
    it('should update a post', async () => {
      const userInfo = { id: 1 } as any;
      const postId = 'some-uuid';
      const dto = {
        title: 'Updated Post',
        content: 'Updated Content',
        categories: ['tech'],
        slug: 'updated-post',
        excerpt: 'Updated Excerpt',
        status: 'PUBLISHED',
        publishedDate: new Date(),
      };
      const post = {
        title: 'Post 1',
        content: 'Content 1',
        categories: [],
        slug: 'post-1',
        excerpt: 'Excerpt 1',
        status: 'DRAFT',
        publishedDate: new Date(),
        userId: userInfo.id,
      };

      mockPrismaService.post.findUnique.mockResolvedValue(post);
      mockPrismaService.post.update.mockResolvedValue({ ...post, ...dto });

      const result = await service.editPost(postId, dto, userInfo);

      expect(result).toEqual(dto);
      expect(mockPrismaService.post.findUnique).toHaveBeenCalledWith({
        where: { uuid: postId, userId: userInfo.id },
      });
      expect(mockPrismaService.post.update).toHaveBeenCalledWith({
        where: { uuid: postId },
        data: dto,
      });
    });

    it('should throw NotFoundException if post not found', async () => {
      const userInfo = { id: 1 } as any;
      const postId = 'some-uuid';
      const dto = {
        title: 'Updated Post',
        content: 'Updated Content',
        categories: ['tech'],
        slug: 'updated-post',
        excerpt: 'Updated Excerpt',
        status: 'PUBLISHED',
        publishedDate: new Date(),
      };

      mockPrismaService.post.findUnique.mockResolvedValue(null);

      await expect(service.editPost(postId, dto, userInfo)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('deletePost', () => {
    it('should delete a post', async () => {
      const userInfo = { id: 1 } as any;
      const postId = 'some-uuid';
      const post = {
        title: 'Post 1',
        content: 'Content 1',
        categories: ['tech'],
        slug: 'post-1',
        excerpt: 'Excerpt 1',
        status: 'DRAFT',
        publishedDate: new Date(),
        userId: userInfo.id,
      };

      mockPrismaService.post.findUnique.mockResolvedValue(post);
      mockPrismaService.post.delete.mockResolvedValue(post);

      const result = await service.deletePost(postId, userInfo);

      expect(result).toEqual({ id: postId });
      expect(mockPrismaService.post.findUnique).toHaveBeenCalledWith({
        where: { uuid: postId, userId: userInfo.id },
      });
      expect(mockPrismaService.post.delete).toHaveBeenCalledWith({
        where: { uuid: postId },
      });
    });

    it('should throw NotFoundException if post not found', async () => {
      const userInfo = { id: 1 } as any;
      const postId = 'some-uuid';

      mockPrismaService.post.findUnique.mockResolvedValue(null);

      await expect(service.deletePost(postId, userInfo)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
