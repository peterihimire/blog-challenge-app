import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

interface userData {
  status: string;
  msg: string;
  data: {
    id: number;
    username: string;
    email: string;
    acctId: string;
  };
}
@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async userInfo(user: userData) {
    try {
      const acct = await this.prisma.user.findUnique({
        where: {
          email: user.data.email,
        },
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

      if (!acct) throw new ForbiddenException('No user!');

      delete acct.password;
      delete acct.id;
      delete acct.createdAt;
      delete acct.updatedAt;

      return acct;
    } catch (error) {
      throw error;
    } finally {
      await this.prisma.$disconnect();
    }
  }
}
