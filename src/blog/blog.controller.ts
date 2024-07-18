import {
  Controller,
  Get,
  UseGuards,
  UseFilters,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import {
  // AuthenticatedGuard,
  JwtGuard,
} from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { AddBlogDto, EditBlogDto } from './dto';
import { HttpExceptionFilter } from 'src/exception';

@Controller('blogs')
export class BlogController {
  constructor(private blogService: BlogService) {}

  @Post('add_blog')
  @UseFilters(HttpExceptionFilter)
  @UseGuards(JwtGuard) //individual route
  addtask(@Body() dto: AddBlogDto, @GetUser() user) {
    const userInfo = user.data;
    return this.blogService.addBlog(dto, userInfo);
  }

  @Get('get_blogs')
  @UseFilters(HttpExceptionFilter)
  @UseGuards(JwtGuard)
  gettasks(@GetUser() user) {
    const userInfo = user.data;
    return this.blogService.getBlogs(userInfo);
  }

  @Get('get_blog/:id')
  @UseFilters(HttpExceptionFilter)
  @UseGuards(JwtGuard)
  gettask(@Param('id') id: string, @GetUser() user) {
    const userInfo = user.data;
    return this.blogService.getBlogById(id, userInfo);
  }

  @Patch('update_blog/:id')
  @UseFilters(HttpExceptionFilter)
  @UseGuards(JwtGuard)
  updatetask(
    @Param('id') id: string,
    @Body() dto: EditBlogDto,
    @GetUser() user,
  ) {
    const userInfo = user.data;
    return this.blogService.editBlog(id, dto, userInfo);
  }

  @Delete('delete_blog/:id')
  @UseFilters(HttpExceptionFilter)
  @UseGuards(JwtGuard)
  deletetask(@Param('id') id: string, @GetUser() user) {
    const userInfo = user.data;
    return this.blogService.deleteBlog(id, userInfo);
  }
}
