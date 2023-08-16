import { Controller, Get, Request } from '@nestjs/common';
import { UserService } from 'src/services/user/user.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RentInfoDTO } from 'src/services/user/dto/user.dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: '取得使用者租用紀錄',
    description: '取得使用者租用紀錄'
  })
  @ApiResponse({ type: [RentInfoDTO] })
  @Get('/rent')
  async getRents(@Request() request) {
    const { id: userId } = request.user;
    return await this.userService.getRents(userId);
  }
}
