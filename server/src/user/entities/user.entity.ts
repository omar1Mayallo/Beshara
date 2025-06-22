import { Exclude } from 'class-transformer';

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export class User {
  id: number;
  firstName: string;
  lastName?: string;
  username: string;
  email: string;
  address?: string;

  @Exclude()
  password: string;

  role: UserRole;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
