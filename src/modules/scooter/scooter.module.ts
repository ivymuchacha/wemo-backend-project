import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScooterService } from 'src/services/scooter/scooter.service';
import { ScooterController } from 'src/controllers/scooter/scooter.controller';
import { Scooter } from 'src/entity/scooters.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Scooter])],
  providers: [ScooterService],
  controllers: [ScooterController],
  exports: [ScooterService]
})
export class ScooterModule {}
