import * as bcrypt from 'bcrypt';

export class PasswordUtils {
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  static async comparePassword(
    password: string,
    hash: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  static validatePassword(password: string): boolean {
    const regex = /^(?=.*\d)(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
    return regex.test(password);
  }
}
