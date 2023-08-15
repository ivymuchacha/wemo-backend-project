import { Controller, Post, Body, Get, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDTO, LoginResponseDTO, UserDTO } from './dto/user.dto';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('/register')
  async register(@Body() body: CreateUserDTO) {
    return await this.authService.register(body);
  }

  @Public()
  @Post('/login')
  async login(@Body() body: UserDTO): Promise<LoginResponseDTO> {
    return await this.authService.login(body);
  }

  @Get('/me')
  async me(@Request() request) {
    return request.user;
  }
}
