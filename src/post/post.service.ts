import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { AddPostDto, EditPostDto } from './dto';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  async addPost(dto: AddPostDto, userInfo: User) {
    const foundBloPost = await this.prisma.post.findFirst({
      where: {
        title: dto.title,
        userId: userInfo.id,
      },
    });

    if (foundBloPost) {
      throw new ConflictException(
        `Post with title '${dto.title}' already exists for this user!`,
      );
    }

    const Post = await this.prisma.post.create({
      data: {
        title: dto.title,
        content: dto.content,
        categories: dto.categories,
        slug: dto.slug,
        excerpt: dto.excerpt,
        status: dto.status,
        publishedDate: new Date(dto.publishedDate),
        userId: userInfo.id,
      },
    });

    delete Post.id;
    delete Post.createdAt;
    delete Post.updatedAt;
    delete Post.userId;

    return Post;
  }

  async getPosts(userInfo: User) {
    const allPosts = await this.prisma.post.findMany({
      where: {
        userId: userInfo.id,
      },
    });

    if (allPosts.length === 0) throw new NotFoundException('No blogs found!');

    const sanitizedPosts = allPosts.map((post) => {
      delete post.id;
      delete post.createdAt;
      delete post.updatedAt;
      delete post.userId;

      return post;
    });

    return sanitizedPosts;
  }

  async getPostById(id: string, userInfo: User) {
    const post = await this.prisma.post.findUnique({
      where: {
        uuid: id,
        userId: userInfo.id,
      },
    });

    if (!post) throw new NotFoundException('BloPost does not exist!');

    delete post.id;
    delete post.createdAt;
    delete post.updatedAt;
    delete post.userId;

    return post;
  }

  async editPost(id: string, dto: EditPostDto, userInfo: User) {
    const post = await this.prisma.post.findUnique({
      where: {
        uuid: id,
        userId: userInfo.id,
      },
    });

    if (!post) throw new NotFoundException('BloPost does not exist!');

    const updatedBloPost = await this.prisma.post.update({
      where: { uuid: id },
      data: {
        title: dto.title,
        content: dto.content,
        categories: dto.categories,
        slug: dto.slug,
        excerpt: dto.excerpt,
        status: dto.status,
        publishedDate: dto.publishedDate
          ? new Date(dto.publishedDate)
          : post.publishedDate,
      },
    });

    delete updatedBloPost.id;
    delete updatedBloPost.createdAt;
    delete updatedBloPost.updatedAt;
    delete updatedBloPost.userId;

    return updatedBloPost;
  }

  async deletePost(id: string, userInfo: User) {
    const post = await this.prisma.post.findUnique({
      where: {
        uuid: id,
        userId: userInfo.id,
      },
    });

    if (!post) throw new NotFoundException('Post does not exist!');

    await this.prisma.post.delete({
      where: { uuid: id },
    });

    return { id };
  }
}
