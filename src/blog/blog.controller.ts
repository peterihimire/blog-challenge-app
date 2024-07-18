import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { AddBlogDto, EditBlogDto } from './dto';
import { Response } from 'express';

@Controller('blogs')
export class BlogController {
  constructor(private blogService: BlogService) {}

  @Post('add')
  @UseGuards(JwtGuard)
  async addBlog(
    @Body() dto: AddBlogDto,
    @GetUser() user,
    @Res() res: Response,
  ) {
    try {
      const userInfo = user.data;
      const newBlog = await this.blogService.addBlog(dto, userInfo);
      res.status(HttpStatus.CREATED).json({
        status: 'success',
        msg: 'Blog created successfully',
        data: newBlog,
      });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        status: 'error',
        msg: error.message,
      });
    }
  }

  @Get()
  @UseGuards(JwtGuard)
  async getBlogs(@GetUser() user, @Res() res: Response) {
    try {
      const userInfo = user.data;
      const blogs = await this.blogService.getBlogs(userInfo);
      res.status(HttpStatus.OK).json({
        status: 'success',
        msg: 'Fetched all blogs',
        data: blogs,
      });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        status: 'error',
        msg: error.message,
      });
    }
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  async getBlogById(
    @Param('id') id: string,
    @GetUser() user,
    @Res() res: Response,
  ) {
    try {
      const userInfo = user.data;
      const blog = await this.blogService.getBlogById(id, userInfo);
      res.status(HttpStatus.OK).json({
        status: 'success',
        msg: 'Fetched blog details',
        data: blog,
      });
    } catch (error) {
      res.status(HttpStatus.NOT_FOUND).json({
        status: 'error',
        msg: error.message,
      });
    }
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
  async updateBlog(
    @Param('id') id: string,
    @Body() dto: EditBlogDto,
    @GetUser() user,
    @Res() res: Response,
  ) {
    try {
      const userInfo = user.data;
      const updatedBlog = await this.blogService.editBlog(id, dto, userInfo);
      res.status(HttpStatus.OK).json({
        status: 'success',
        msg: 'Blog updated successfully',
        data: updatedBlog,
      });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        status: 'error',
        msg: error.message,
      });
    }
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  async deleteBlog(
    @Param('id') id: string,
    @GetUser() user,
    @Res() res: Response,
  ) {
    try {
      const userInfo = user.data;
      const deletedBlog = await this.blogService.deleteBlog(id, userInfo);
      res.status(HttpStatus.OK).json({
        status: 'success',
        msg: `Blog with ID ${deletedBlog.id} deleted successfully`,
      });
    } catch (error) {
      res.status(HttpStatus.NOT_FOUND).json({
        status: 'error',
        msg: error.message,
      });
    }
  }
}

// import {
//   Controller,
//   Get,
//   UseGuards,
//   UseFilters,
//   Post,
//   Body,
//   Param,
//   Patch,
//   Delete,
// } from '@nestjs/common';
// import { BlogService } from './blog.service';
// import { JwtGuard } from 'src/auth/guard';
// import { GetUser } from 'src/auth/decorator';
// import { AddBlogDto, EditBlogDto } from './dto';
// import { HttpExceptionFilter } from 'src/exception';

// @Controller('blogs')
// export class BlogController {
//   constructor(private blogService: BlogService) {}

//   @Post('add_blog')
//   @UseFilters(HttpExceptionFilter)
//   @UseGuards(JwtGuard) // individual route
//   async addBlog(@Body() dto: AddBlogDto, @GetUser() user) {
//     const userInfo = user.data;
//     const newBlog = await this.blogService.addBlog(dto, userInfo);
//     return {
//       status: 'success',
//       msg: 'Blog created',
//       data: newBlog,
//     };
//   }

//   @Get('get_blogs')
//   @UseFilters(HttpExceptionFilter)
//   @UseGuards(JwtGuard)
//   async getBlogs(@GetUser() user) {
//     const userInfo = user.data;
//     const blogs = await this.blogService.getBlogs(userInfo);
//     return {
//       status: 'success',
//       msg: 'All blogs',
//       data: blogs,
//     };
//   }

//   @Get('get_blog/:id')
//   @UseFilters(HttpExceptionFilter)
//   @UseGuards(JwtGuard)
//   async getBlogById(@Param('id') id: string, @GetUser() user) {
//     const userInfo = user.data;
//     const blog = await this.blogService.getBlogById(id, userInfo);
//     return {
//       status: 'success',
//       msg: 'Blog details',
//       data: blog,
//     };
//   }

//   @Patch('update_blog/:id')
//   @UseFilters(HttpExceptionFilter)
//   @UseGuards(JwtGuard)
//   async updateBlog(
//     @Param('id') id: string,
//     @Body() dto: EditBlogDto,
//     @GetUser() user,
//   ) {
//     const userInfo = user.data;
//     const updatedBlog = await this.blogService.editBlog(id, dto, userInfo);
//     return {
//       status: 'success',
//       msg: 'Blog updated',
//       data: updatedBlog,
//     };
//   }

//   @Delete('delete_blog/:id')
//   @UseFilters(HttpExceptionFilter)
//   @UseGuards(JwtGuard)
//   async deleteBlog(@Param('id') id: string, @GetUser() user) {
//     const userInfo = user.data;
//     const deletedBlog = await this.blogService.deleteBlog(id, userInfo);
//     return {
//       status: 'success',
//       msg: `Blog with id: ${deletedBlog.id} was deleted.`,
//     };
//   }
// }
