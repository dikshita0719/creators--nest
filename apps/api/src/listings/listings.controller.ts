import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { createListingInputSchema } from '@creators/types';
import { AuthGuard } from '../auth/auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { ZodValidationPipe } from '../common/zod-validation.pipe';
import { PrismaService } from '../prisma.service';

@Controller('listings')
@ApiTags('listings')
export class ListingsController {
  constructor(private readonly prisma: PrismaService) {}
  @Get() list() { return this.prisma.listing.findMany({ where: { active: true }, include: { creator: { include: { user: { include: { profile: true } } } } } }); }
  @Get(':id') get(@Param('id') id: string) { return this.prisma.listing.findUniqueOrThrow({ where: { id }, include: { creator: { include: { user: { include: { profile: true } } } } } }); }
  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('creator')
  create(@Req() request: any, @Body(new ZodValidationPipe(createListingInputSchema)) body: any) { return this.prisma.listing.create({ data: { ...body, creatorId: request.user.id } }); }
}
