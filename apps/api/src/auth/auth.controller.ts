import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { loginInputSchema, registerInputSchema } from '@creators/types';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { ZodValidationPipe } from '../common/zod-validation.pipe';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register') register(@Body(new ZodValidationPipe(registerInputSchema)) body: any) { return this.auth.register(body); }
  @Post('login') login(@Body(new ZodValidationPipe(loginInputSchema)) body: any) { return this.auth.login(body.email); }
  @Get('me') @UseGuards(AuthGuard) me(@Req() request: any) { return request.user; }
}
