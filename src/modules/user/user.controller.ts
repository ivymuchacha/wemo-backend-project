import { Controller, Get, Request } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/rent')
  async getRents(@Request() request) {
    const { id: userId } = request.user;
    return await this.userService.getRents(userId);
  }
}
