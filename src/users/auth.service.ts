import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomBytes, scryptSync } from 'crypto';
import { UsersService } from './users.service';
@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}
  async signup(email: string, password: string) {
    const hasUserEmail = await this.usersService.find(email);
    if (hasUserEmail.length > 0)
      throw new BadRequestException('email has exist');
    const salt = randomBytes(6).toString('hex');
    const hash = scryptSync(password, salt, 32).toString('hex');
    const result = salt + '.' + hash;
    const newUser = await this.usersService.create({ email, password: result });
    return newUser;
  }
  async signin(email: string, password: string) {
    const [userEmail] = await this.usersService.find(email);
    if (!userEmail) throw new NotFoundException('email not found');
    const [salt, hash] = userEmail.password.split('.');
    const passwordHash = scryptSync(password, salt, 32).toString('hex');
    if (passwordHash !== hash)
      throw new BadRequestException('Incorrect account or password');
    return userEmail;
  }
}
