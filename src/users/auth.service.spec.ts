import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;
  beforeEach(async () => {
    const users: User[] = [];
    fakeUsersService = {
      find: (email: string) => {
        const filterUser = users.filter((user) => user.email === email);
        return Promise.resolve(filterUser);
      },
      create: (user: { email: string; password: string }) => {
        const newUser = {
          id: Math.floor(Math.random() * 99999),
          email: user.email,
          password: user.password,
        } as User;
        users.push(newUser);
        return Promise.resolve(newUser);
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: fakeUsersService },
      ],
    }).compile();
    service = module.get<AuthService>(AuthService);
  });
  it('should create an instance of AuthService', async () => {
    expect(service).toBeDefined();
  });
  it('create a new user with a salted and hashed password', async () => {
    const user = await service.signup('awfawgwg@gmail.com', 'toilawibu');
    expect(user.password).not.toEqual('toilawibu');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });
  it('throw error if user signs up with email that is in use', async () => {
    await service.signup('asdf@asdf.com', 'asdf');
    await expect(service.signup('asdf@asdf.com', 'asdf')).rejects.toThrow(
      BadRequestException,
    );
  });
  it('throws if signin is called with an unused email', async () => {
    await expect(
      service.signin('asdflkj@asdlfkj.com', 'passdflkj'),
    ).rejects.toThrow(NotFoundException);
  });
  it('throws if an invalid password is provided', async () => {
    await service.signup('laskdjf@alskdfj.com', 'password');
    await expect(
      service.signin('laskdjf@alskdfj.com', 'laksdlfkj'),
    ).rejects.toThrow(BadRequestException);
  });
  it('returns a user if correct password provided', async () => {
    await service.signup('theworstworld@gmail.com', '123456');
    console.log('hi');
    const user = await service.signin('theworstworld@gmail.com', '123456');
    expect(user).toBeDefined();
  });
});
