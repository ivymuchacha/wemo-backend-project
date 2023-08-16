import { Controller, Get, Param } from '@nestjs/common';
import { ScooterService } from 'src/services/scooter/scooter.service';

@Controller('scooter')
export class ScooterController {
  constructor(private readonly scooterService: ScooterService) {}

  @Get()
  async getScooters() {
    return await this.scooterService.getScooters();
  }

  @Get('/:id')
  async getById(@Param() id: number) {
    return await this.scooterService.getById(id);
  }
}
