import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { NotFoundException } from '@nestjs/common';
describe('UsersController', () => {
  let controller: UsersController;
  let fakeAuthService: Partial<AuthService>;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    fakeAuthService = {
      signin: (email: string, password: string) => {
        return Promise.resolve({ id: 1, email, password } as User);
      },
      // signup: () => {},
    };
    fakeUsersService = {
      findOne: (id: number) => {
        return Promise.resolve({
          id,
          email: 'teatat@gmail.com',
          password: '123456',
        } as User);
      },
      find: (email: string) => {
        return Promise.resolve([
          {
            id: 12,
            email,
            password: '123456',
          } as User,
        ]);
      },
      // update: () => {},
      // remove: () => {},
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: AuthService, useValue: fakeAuthService },
        { provide: UsersService, useValue: fakeUsersService },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    fakeAuthService = module.get<AuthService>(AuthService);
    fakeUsersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('findAllUser return an list of users with the given email', async () => {
    const users = await controller.getAll('helloworld@example.com');
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('helloworld@example.com');
    await expect(controller.getUserById('1')).rejects.toThrow(
      NotFoundException,
    );
  });
  it('findUser returns single user with the given id', async () => {
    const user = await controller.getUserById('1');
    await expect(user).toBeDefined();
  });
  it('findUser throws an error if user with given id is not found', async () => {
    fakeUsersService.findOne = () => null;
    await expect(controller.getUserById('1')).rejects.toThrow(
      NotFoundException,
    );
  });
  it('findUser throws an error if user with', async () => {
    const session = { userId: -10 };
    const user = await controller.login(
      { email: 'wiburach@gmail.com', password: '123456' },
      session,
    );
    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(user.id);
  });
});
