import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/user/entities/user.entity';

export const ALLOWED_ROLES_KEY = 'allowedRoles';
export const AllowedTo = (...roles: UserRole[]) =>
  SetMetadata(ALLOWED_ROLES_KEY, roles);
