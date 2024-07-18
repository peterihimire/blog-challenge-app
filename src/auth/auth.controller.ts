import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, RegDto } from './dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  register(@Body() dto: RegDto) {
    console.log('This is dto...', dto);
    return this.authService.register(dto);
  }

  @Post('signin')
  async login(@Body() dto: AuthDto, @Res() res: Response) {
    await this.authService.login(dto, res);
  }

  @Post('signout')
  signout(@Res() res) {
    res.clearCookie('token');
    res.json({
      status: 'success',
      msg: 'Logout successful!',
    });
  }
}
