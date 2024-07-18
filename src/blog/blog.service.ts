import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddBlogDto, EditBlogDto } from './dto';

@Injectable()
export class BlogService {
  constructor(private prisma: PrismaService) {}

  async addBlog(dto: AddBlogDto, userInfo: any) {
    const foundBlog = await this.prisma.blog.findFirst({
      where: {
        title: dto.title,
        userId: userInfo.id,
      },
    });

    if (foundBlog) {
      throw new ConflictException(
        `Blog with title '${dto.title}' already exists for this user!`,
      );
    }

    const newBlog = await this.prisma.blog.create({
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

    delete newBlog.id;
    delete newBlog.createdAt;
    delete newBlog.updatedAt;
    delete newBlog.userId;

    return newBlog;
  }

  async getBlogs(userInfo: any) {
    const allBlogs = await this.prisma.blog.findMany({
      where: {
        userId: userInfo.id,
      },
    });

    if (allBlogs.length === 0) throw new NotFoundException('No blogs found!');

    const sanitizedBlogs = allBlogs.map((blog) => {
      delete blog.id;
      delete blog.createdAt;
      delete blog.updatedAt;
      delete blog.userId;

      return blog;
      // return sanitizedBlog;
    });

    return sanitizedBlogs;
  }

  async getBlogById(id: string, userInfo: any) {
    const blog = await this.prisma.blog.findUnique({
      where: {
        uuid: id,
        userId: userInfo.id,
      },
    });

    if (!blog) throw new NotFoundException('Blog does not exist!');

    // const { id: blogId, createdAt, updatedAt, userId, ...sanitizedBlog } = blog;
    delete blog.id;
    delete blog.createdAt;
    delete blog.updatedAt;
    delete blog.userId;

    return blog;
    // return sanitizedBlog;
  }

  async editBlog(id: string, dto: EditBlogDto, userInfo: any) {
    const blog = await this.prisma.blog.findUnique({
      where: {
        uuid: id,
        userId: userInfo.id,
      },
    });

    if (!blog) throw new NotFoundException('Blog does not exist!');

    const updatedBlog = await this.prisma.blog.update({
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
          : blog.publishedDate,
      },
    });

    delete updatedBlog.id;
    delete updatedBlog.createdAt;
    delete updatedBlog.updatedAt;
    delete updatedBlog.userId;

    return updatedBlog;
  }

  async deleteBlog(id: string, userInfo: any) {
    const blog = await this.prisma.blog.findUnique({
      where: {
        uuid: id,
        userId: userInfo.id,
      },
    });

    if (!blog) throw new NotFoundException('Blog does not exist!');

    await this.prisma.blog.delete({
      where: { uuid: id },
    });

    return { id };
  }
}
