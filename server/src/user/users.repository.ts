import { Inject, Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { Knex } from 'knex';
import { KNEX_CONNECTION } from 'src/database/database.provider';

@Injectable()
export class UsersRepository {
  constructor(
    @Inject(KNEX_CONNECTION)
    private readonly knex: Knex,
  ) {}

  async create(
    user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<User> {
    const [createdUser] = await this.knex('users')
      .insert({
        ...user,
        createdAt: this.knex.fn.now(),
        updatedAt: this.knex.fn.now(),
      })
      .returning('*');

    return new User(createdUser);
  }

  async findByUsername(username: string): Promise<User | undefined> {
    const user = await this.knex('users').where({ username }).first();
    return user ? new User(user) : undefined;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.knex('users').where({ email }).first();
    return user ? new User(user) : undefined;
  }

  async findById(id: number): Promise<User | undefined> {
    const user = await this.knex('users').where({ id }).first();
    return user ? new User(user) : undefined;
  }
}
