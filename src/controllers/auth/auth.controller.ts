import { Controller, Post, Body, Get, Request } from '@nestjs/common';
import { AuthService } from 'src/services/auth/auth.service';
import {
  UserDTO,
  UserInfoDTO,
  CreateUserDTO,
  LoginResponseDTO
} from 'src/services/auth/dto/user.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';

@ApiTags('Auth')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: '使用者註冊', description: '使用者註冊' })
  @Public()
  @Post('/register')
  async register(@Body() body: CreateUserDTO) {
    return await this.authService.register(body);
  }

  @ApiOperation({ summary: '使用者登入', description: '使用者登入' })
  @ApiResponse({ type: LoginResponseDTO })
  @Public()
  @Post('/login')
  async login(@Body() body: UserDTO): Promise<LoginResponseDTO> {
    return await this.authService.login(body);
  }

  @ApiOperation({ summary: '取得使用者資料', description: '取得使用者資料' })
  @ApiResponse({ type: UserInfoDTO })
  @Get('/me')
  async me(@Request() request): Promise<UserInfoDTO> {
    return plainToClass(UserInfoDTO, request.user, {
      excludeExtraneousValues: true
    });
  }
}
