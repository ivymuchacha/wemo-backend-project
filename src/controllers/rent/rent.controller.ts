import { Controller, Post, Body, Request, Put } from '@nestjs/common';
import { RentService } from 'src/services/rent/rent.service';
import {
  CreateRentDTO,
  UpdateRentDTO,
  RentDTO
} from 'src/services/rent/dto/rent.dto';
import { ForbiddenException } from 'src/common/exceptions/custom.exception';
import { ScooterService } from 'src/services/scooter/scooter.service';
import { ScooterStatus } from 'src/constants/common.constants';

@Controller('rent')
export class RentController {
  constructor(
    private readonly rentService: RentService,
    private readonly scooterService: ScooterService
  ) {}

  @Post()
  async create(
    @Request() request,
    @Body() body: CreateRentDTO
  ): Promise<RentDTO> {
    const { id: userId } = request.user;
    const { scooterId } = body;

    const isValidUser = await this.rentService.checkUserAbleToRent(userId);
    if (!isValidUser) throw new ForbiddenException('User is already rent.');

    const scooter = await this.scooterService.getById(scooterId);
    if (scooter?.state !== ScooterStatus.AVAILABLE)
      throw new ForbiddenException('Scooter is not available.');

    return await this.rentService.create({ userId, scooterId });
  }

  @Put()
  async update(@Body() body: UpdateRentDTO): Promise<RentDTO> {
    return await this.rentService.update(body);
  }
}
