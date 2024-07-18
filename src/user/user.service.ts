import { Injectable, ForbiddenException, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  // @route GET api/admin/get_user_by_acct_id
  // @desc To update user by account ID
  // @access Private
  async userInfo(user: any) {
    try {
      Logger.verbose('This is user payload', user);

      const acct = await this.prisma.user.findUnique({
        where: {
          email: user.data.email,
        },
        include: {
          // tasks: true,
          blogs: {
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
              createdAt: true,
              updatedAt: true,
            },
          },
        },
      });

      const userWithTasks = {
        ...acct,
      };

      if (!acct) throw new ForbiddenException('No user!');

      delete userWithTasks.password;
      delete userWithTasks.id;
      delete userWithTasks.createdAt;
      delete userWithTasks.updatedAt;

      return {
        status: 'success',
        msg: 'User details',
        data: userWithTasks,
      };
    } catch (error) {
      throw error;
    } finally {
      await this.prisma.$disconnect(); // Disconnect the Prisma client
    }
  }
}
