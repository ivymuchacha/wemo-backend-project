import { Controller, Post, Body, Request, Put } from '@nestjs/common';
import { RentService } from 'src/services/rent/rent.service';
import {
  CreateRentDTO,
  UpdateRentDTO,
  RentDTO
} from 'src/services/rent/dto/rent.dto';
import { ConflictException } from 'src/common/exceptions/custom.exception';
import { ScooterService } from 'src/services/scooter/scooter.service';
import { ScooterStatus } from 'src/constants/common.constants';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Rent')
@Controller('rent')
export class RentController {
  constructor(
    private readonly rentService: RentService,
    private readonly scooterService: ScooterService
  ) {}

  @ApiOperation({
    summary: '租用車輛',
    description: '使用者開始租用車輛'
  })
  @ApiResponse({ type: RentDTO })
  @Post()
  async create(
    @Request() request,
    @Body() body: CreateRentDTO
  ): Promise<RentDTO> {
    const { id: userId } = request.user;
    const { scooterId } = body;

    const isValidUser = await this.rentService.checkUserAbleToRent(userId);
    if (!isValidUser) throw new ConflictException('User is already rent.');

    const scooter = await this.scooterService.getById(scooterId);
    const isValidScooter = await this.rentService.checkScooterAbleToRent(
      scooterId
    );
    if (scooter?.state !== ScooterStatus.AVAILABLE || !isValidScooter)
      throw new ConflictException('Scooter is not available.');

    return await this.rentService.create({ userId, scooter });
  }

  @ApiOperation({
    summary: '變更車輛租用狀態',
    description: '使用者變更車輛租用狀態'
  })
  @ApiResponse({ type: RentDTO })
  @Put()
  async update(
    @Request() request,
    @Body() body: UpdateRentDTO
  ): Promise<RentDTO> {
    const { id: userId } = request.user;
    return await this.rentService.update(userId, body);
  }
}
