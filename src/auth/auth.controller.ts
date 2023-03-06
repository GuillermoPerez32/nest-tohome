import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { VALID_ROLES } from './interfaces';
import { Auth, GetHeader, RoleProtected } from './decorators';
import { UserRoleGuard } from './guards';
import { ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Post('privada')
  @UseGuards(AuthGuard())
  privada(@GetUser() user: User, @GetHeader() header: string[]) {
    return {
      message: 'hola',
      user,
      header,
    };
  }

  @Post('privada2')
  // @SetMetadata('roles', ['admin', 'user'])
  @RoleProtected()
  @UseGuards(AuthGuard(), UserRoleGuard)
  privada2(@GetUser() user: User, @GetHeader() header: string[]) {
    return {
      message: 'hola',
      user,
      header,
    };
  }

  @Post('me')
  @Auth()
  revalidate(@GetUser() user: User) {
    return this.authService.revalidate(user);
  }

  @Post('privada3')
  @Auth(VALID_ROLES.USER)
  privada3(@GetUser() user: User, @GetHeader() header: string[]) {
    return {
      message: 'hola',
      user,
      header,
    };
  }
}
