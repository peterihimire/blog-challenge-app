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
import { PostService } from './post.service';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { AddPostDto, EditPostDto } from './dto';
import { Response } from 'express';

@Controller('posts')
export class PostController {
  constructor(private postService: PostService) {}

  @Post('add')
  @UseGuards(JwtGuard)
  async addPost(
    @Body() dto: AddPostDto,
    @GetUser() user,
    @Res() res: Response,
  ) {
    try {
      const userInfo = user.data;
      const newPost = await this.postService.addPost(dto, userInfo);
      res.status(HttpStatus.CREATED).json({
        status: 'success',
        msg: 'Post created successfully',
        data: newPost,
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
  async getPosts(@GetUser() user, @Res() res: Response) {
    try {
      const userInfo = user.data;
      const posts = await this.postService.getPosts(userInfo);
      res.status(HttpStatus.OK).json({
        status: 'success',
        msg: 'Fetched all posts',
        data: posts,
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
  async getPostById(
    @Param('id') id: string,
    @GetUser() user,
    @Res() res: Response,
  ) {
    try {
      const userInfo = user.data;
      const post = await this.postService.getPostById(id, userInfo);
      res.status(HttpStatus.OK).json({
        status: 'success',
        msg: 'Fetched post details',
        data: post,
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
  async updatePost(
    @Param('id') id: string,
    @Body() dto: EditPostDto,
    @GetUser() user,
    @Res() res: Response,
  ) {
    try {
      const userInfo = user.data;
      const updatedPost = await this.postService.editPost(id, dto, userInfo);
      res.status(HttpStatus.OK).json({
        status: 'success',
        msg: 'Post updated successfully',
        data: updatedPost,
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
  async deletePost(
    @Param('id') id: string,
    @GetUser() user,
    @Res() res: Response,
  ) {
    try {
      const userInfo = user.data;
      const deletedPost = await this.postService.deletePost(id, userInfo);
      res.status(HttpStatus.OK).json({
        status: 'success',
        msg: `Post with ID ${deletedPost.id} deleted successfully`,
      });
    } catch (error) {
      res.status(HttpStatus.NOT_FOUND).json({
        status: 'error',
        msg: error.message,
      });
    }
  }
}
