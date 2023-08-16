import { Controller, Get, Param } from '@nestjs/common';
import { ScooterService } from 'src/services/scooter/scooter.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  ScooterDTO,
  GetScooterDTO
} from 'src/services/scooter/dto/scooter.dto';
@ApiTags('Scooter')
@Controller('scooter')
export class ScooterController {
  constructor(private readonly scooterService: ScooterService) {}

  @ApiOperation({
    summary: '取得所有車輛狀態',
    description: '取得所有車輛狀態'
  })
  @ApiResponse({ type: [GetScooterDTO] })
  @Get()
  async getScooters() {
    return await this.scooterService.getScooters();
  }

  @ApiOperation({
    summary: '取得指定車輛資訊',
    description: '取得指定車輛資訊'
  })
  @ApiResponse({ type: ScooterDTO })
  @Get('/:id')
  async getById(@Param('id') id: number) {
    return await this.scooterService.getById(id);
  }
}
