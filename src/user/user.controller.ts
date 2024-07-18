import {
  Controller,
  Get,
  UseGuards,
  Res,
  HttpStatus,
  UseFilters,
} from '@nestjs/common';
import { UserService } from './user.service';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { HttpExceptionFilter } from 'src/exception';
import { Response } from 'express';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('user_info')
  @UseGuards(JwtGuard)
  @UseFilters(HttpExceptionFilter)
  async userInfo(@GetUser() user, @Res() res: Response) {
    try {
      const userInfo = await this.userService.userInfo(user);
      res.status(HttpStatus.OK).json({
        status: 'success',
        msg: 'User details fetched successfully',
        data: userInfo,
      });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        status: 'error',
        msg: error.message,
      });
    }
  }
}
