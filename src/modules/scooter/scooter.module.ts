import { Module } from '@nestjs/common';
import { ScooterService } from './scooter.service';
import { ScooterController } from './scooter.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Scooter } from 'src/entity/scooters.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Scooter])],
  providers: [ScooterService],
  controllers: [ScooterController],
  exports: [ScooterService]
})
export class ScooterModule {}
