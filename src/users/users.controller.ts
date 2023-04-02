import { AuthService } from './auth.service';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
  NotFoundException,
  ClassSerializerInterceptor,
  UseInterceptors,
  UseGuards,
  Session,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto, UserDto } from './dto';
import { TransformInterceptor, Serialize } from '../interceptors';
import { CurrentUser } from './decorators/user.decorator';
import { User } from './user.entity';
import { AuthGuard } from '../guards';
@Controller('auth')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  // @Get('/whoami')
  // whoAmI(@Session() session) {
  //   return this.usersService.findOne(session.id);
  // }
  @Get('/whoami')
  @UseGuards(AuthGuard)
  whoAmI(@CurrentUser() user: User) {
    // if (!user) throw new ForbiddenException();
    return user;
  }

  @Post('signup')
  async createUser(@Body() body: CreateUserDto, @Session() session) {
    const user = await this.authService.signup(body.email, body.password);
    session.userId = user.id;
    return user;
  }
  @Post('signin')
  async login(@Body() body: CreateUserDto, @Session() session) {
    const user = await this.authService.signin(body.email, body.password);
    session.userId = user.id;
    return user;
  }
  @Post('logout')
  async logout(@Session() session) {
    session.userId = null;
    return 'logout successful';
  }
  @Get()
  @UseInterceptors(TransformInterceptor)
  getAll(@Query('email') email: string) {
    return this.usersService.find(email);
  }
  @Get(':id')
  async getUserById(@Param('id') id: string) {
    const user = await this.usersService.findOne(Number(id));
    if (!user) throw new NotFoundException();
    return user;
  }
  @Patch(':id')
  updateUserById(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(Number(id), body);
  }
  @Delete(':id')
  deleteUserById(@Param('id') id: number) {
    return this.usersService.remove(id);
  }
}
