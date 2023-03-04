import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}
  create(user: { email: string; password: string }) {
    const newUser = this.usersRepository.create(user);
    return this.usersRepository.save(newUser);
  }
}
