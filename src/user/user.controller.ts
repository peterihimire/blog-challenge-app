import { Controller, Get, UseGuards, UseFilters } from '@nestjs/common';
import { UserService } from './user.service';
import { GetUser } from 'src/auth/decorator';
import { User } from '@prisma/client';
import { HttpExceptionFilter } from 'src/exception';
import { JwtGuard } from 'src/auth/guard';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @UseFilters(HttpExceptionFilter)
  @UseGuards(JwtGuard) //individual route
  @Get('user_info')
  userInfo(@GetUser() user: User) {
    console.log('User object from user controller...', user);
    return this.userService.userInfo(user);
    // return user;
  }
}
