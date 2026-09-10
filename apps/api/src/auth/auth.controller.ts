import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { loginInputSchema, registerInputSchema } from '@creators/types';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { ZodValidationPipe } from '../common/zod-validation.pipe';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register') async register(@Body(new ZodValidationPipe(registerInputSchema)) body: any, @Res({ passthrough: true }) response: Response) { return this.authenticate(response, this.auth.register(body)); }
  @Post('login') async login(@Body(new ZodValidationPipe(loginInputSchema)) body: any, @Res({ passthrough: true }) response: Response) { return this.authenticate(response, this.auth.login(body.email, body.password)); }
  @Post('logout') logout(@Res({ passthrough: true }) response: Response) { response.clearCookie('access_token', this.cookieOptions()); return { ok: true }; }
  @Get('me') @ApiBearerAuth() @UseGuards(AuthGuard) me(@Req() request: any) { return request.user; }

  private async authenticate(response: Response, result: Promise<{ token: string; user: unknown }>) {
    const { token, user } = await result;
    response.cookie('access_token', token, this.cookieOptions());
    return { user };
  }

  private cookieOptions() {
    return { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' as const, maxAge: 60 * 60 * 1000, path: '/' };
  }
}
