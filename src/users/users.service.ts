import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
  findOne(id: number) {
    if (!id) throw new BadRequestException();
    return this.usersRepository.findOneBy({ id });
  }
  async find(email: string) {
    const user = await this.usersRepository.find({ where: { email } });
    return user;
  }
  async update(id: number, data: Partial<User>) {
    const user = await this.findOne(id);
    if (!user) throw new NotFoundException();
    Object.assign(user, data);
    return this.usersRepository.save(user);
  }
  async remove(id: number) {
    const user = await this.findOne(id);
    if (!user) throw new NotFoundException();
    return this.usersRepository.remove(user);
  }
}
