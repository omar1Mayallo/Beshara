import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UsersRepository } from 'src/user/users.repository';
import { User, UserRole } from 'src/user/entities/user.entity';
import { PasswordUtils } from 'src/shared/utils/password.utils';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) return null;

    const isValid = await PasswordUtils.comparePassword(
      password,
      user.password,
    );
    return isValid ? user : null;
  }

  async login(loginDto: LoginDto): Promise<{ access_token: string }> {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(registerDto: RegisterDto): Promise<{ access_token: string }> {
    const existingUser = await this.usersRepository.findByUsername(
      registerDto.username,
    );
    if (existingUser) {
      throw new UnauthorizedException('Username already exists');
    }

    const hashedPassword = await PasswordUtils.hashPassword(
      registerDto.password,
    );
    const user = await this.usersRepository.create({
      ...registerDto,
      password: hashedPassword,
      role: UserRole.USER, // Default role
    });

    const payload = { sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
