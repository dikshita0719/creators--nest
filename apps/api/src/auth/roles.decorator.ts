import { SetMetadata } from '@nestjs/common';
export const Roles = (...roles: Array<'client' | 'creator' | 'admin'>) => SetMetadata('roles', roles);
