import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { PrismaService } from '../prisma.service';

@Controller('users')
@ApiTags('users')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly prisma: PrismaService) {}
  @Get('me') me(@Req() request: any) { return this.prisma.user.findUnique({ where: { id: request.user.id }, include: { profile: true, creator: true } }); }
}
