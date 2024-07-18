import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddBlogDto, EditBlogDto } from './dto';
// import { TaskGateway } from './blog.gateway';

@Injectable()
export class BlogService {
  constructor(private prisma: PrismaService) {}

  // @route GET api/admin/get_user_by_acct_id
  // @desc To update user by account ID
  // @access Private
  async addBlog(dto: AddBlogDto, userInfo: any) {
    try {
      const foundTask = await this.prisma.blog.findFirst({
        where: {
          title: dto.title,
          userId: userInfo.id,
        },
      });

      if (foundTask) {
        throw new ConflictException(
          `Blog with title '${dto.title}' already exists for this user!`,
        );
      }

      // Logger.verbose('This is user payload', user);

      const date = new Date(dto?.publishedDate);
      const newBlog = await this.prisma.blog.create({
        data: {
          title: dto.title,
          content: dto.content,
          categories: dto.categories,
          slug: dto.slug,
          excerpt: dto.excerpt,
          status: dto.status,
          publishedDate: date,
          userId: userInfo.id,
        },
      });

      const {
        title,
        excerpt,
        content,
        status,
        publishedDate,
        categories,
        slug,
      } = newBlog;

      return {
        status: 'success',
        msg: 'Blog created',
        data: {
          title,
          excerpt,
          content,
          status,
          categories,
          publishedDate,
          slug,
        },
      };
    } catch (error) {
      throw error;
    } finally {
      await this.prisma.$disconnect(); // Disconnect the Prisma client
    }
  }

  // @route GET api/admin/get_user_by_acct_id
  // @desc To update user by account ID
  // @access Private
  async getBlogs(userInfo) {
    try {
      const allBlogs = await this.prisma.blog.findMany({
        where: {
          userId: userInfo.id,
        },
      });
      if (!allBlogs) throw new NotFoundException('No blog found!');

      // const totalBlog = allBlogs.map((blog) => {
      //   return {
      //     title: blog.title,
      //     desc: blog.desc,
      //     status: blog.status,
      //     dueDate: blog.dueDate,
      //     category: blog.category,
      //     createdAt: blog.createdAt,
      //     updatedAt: blog.updatedAt,
      //     priority: blog.priority,
      //     uuid: blog.uuid,
      //   };
      // });

      return {
        status: 'success',
        msg: 'All blogs',
        data: allBlogs,
      };
    } catch (error) {
      throw error;
    } finally {
      await this.prisma.$disconnect(); // Disconnect the Prisma client
    }
  }

  // @route GET api/admin/get_user_by_acct_id
  // @desc To update user by account ID
  // @access Private
  async getBlogById(id: string, userInfo) {
    try {
      const blog = await this.prisma.blog.findUnique({
        where: {
          uuid: id,
          userId: userInfo.id,
        },
      });

      if (!blog) throw new NotFoundException('Blog does not exist!');

      // const {
      //   title,
      //   desc,
      //   status,
      //   dueDate,
      //   category,
      //   createdAt,
      //   updatedAt,
      //   priority,
      //   uuid,
      // } = blog;

      return {
        status: 'success',
        msg: 'Blog details',
        data: blog,
      };
    } catch (error) {
      throw error;
    } finally {
      await this.prisma.$disconnect(); // Disconnect the Prisma client
    }
  }

  // @route GET api/admin/get_user_by_acct_id
  // @desc To update user by account ID
  // @access Private
  async editBlog(id: string, dto: EditBlogDto, userInfo) {
    try {
      const blog = await this.prisma.blog.findUnique({
        where: {
          uuid: id,
          userId: userInfo.id,
        },
      });
      if (!blog) throw new NotFoundException('Blog does not exist!');

      const date = new Date(dto?.publishedDate);
      const updatedtask = await this.prisma.blog.update({
        where: { uuid: id },
        data: {
          title: dto.title,
          content: dto.content,
          categories: dto.categories,
          slug: dto.slug,
          excerpt: dto.excerpt,
          status: dto.status,
          publishedDate: date,
          userId: userInfo.id,
        },
      });

      const {
        title,
        excerpt,
        content,
        status,
        publishedDate,
        categories,
        slug,
      } = updatedtask;
      return {
        status: 'success',
        msg: 'Blog updated',
        data: {
          title,
          excerpt,
          content,
          status,
          categories,
          publishedDate,
          slug,
        },
      };
    } catch (error) {
      throw error;
    } finally {
      await this.prisma.$disconnect(); // Disconnect the Prisma client
    }
  }

  // @route GET api/admin/get_user_by_acct_id
  // @desc To update user by account ID
  // @access Private
  async deleteBlog(id: string, userInfo) {
    try {
      const blog = await this.prisma.blog.findUnique({
        where: {
          uuid: id,
          userId: userInfo.id,
        },
      });
      if (!blog) throw new NotFoundException('Task does not exist!');

      await this.prisma.blog.delete({
        where: { uuid: id },
      });

      return {
        status: 'success',
        msg: `Blog with id [ ${id} ] was deleted.`,
      };
    } catch (error) {
      throw error;
    } finally {
      await this.prisma.$disconnect(); // Disconnect the Prisma client
    }
  }
}
