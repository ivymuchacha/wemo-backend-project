import { Controller, Get } from '@nestjs/common';
import { ScooterService } from 'src/services/scooter/scooter.service';

@Controller('scooter')
export class ScooterController {
  constructor(private readonly scooterService: ScooterService) {}

  @Get('/available')
  async getAvailableScooter() {
    return await this.scooterService.getAvailable();
  }
}
