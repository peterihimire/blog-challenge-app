import { Body, Controller, Post, Res, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, RegDto } from './dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async register(@Body() dto: RegDto, @Res() res: Response) {
    try {
      const user = await this.authService.register(dto);
      res.status(HttpStatus.CREATED).json({
        status: 'success',
        msg: 'Account registered!',
        data: user,
      });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        status: 'error',
        msg: error.message,
      });
    }
  }

  @Post('signin')
  async login(@Body() dto: AuthDto, @Res() res: Response) {
    try {
      const { user, accessToken, refreshToken } =
        await this.authService.login(dto);

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
      });
      res.status(HttpStatus.OK).json({
        status: 'success',
        msg: 'Login successful!',
        data: {
          user,
          accessToken,
        },
      });
    } catch (error) {
      res.status(HttpStatus.UNAUTHORIZED).json({
        status: 'error',
        msg: error.message,
      });
    }
  }

  @Post('refresh-token')
  async refreshToken(
    @Body('refreshToken') refreshToken: string,
    @Res() res: Response,
  ) {
    try {
      const { accessToken, newRefreshToken } =
        await this.authService.refreshToken(refreshToken);
      res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
      });
      res.status(HttpStatus.OK).json({
        status: 'success',
        data: { accessToken, refreshToken: newRefreshToken },
      });
    } catch (error) {
      res.status(HttpStatus.UNAUTHORIZED).json({
        status: 'error',
        msg: 'Invalid refresh token',
      });
    }
  }

  @Post('signout')
  signout(@Res() res: Response) {
    res.clearCookie('refreshToken');
    res.status(HttpStatus.OK).json({
      status: 'success',
      msg: 'Logout successful!',
    });
  }
}
