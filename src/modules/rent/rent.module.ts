import { Module } from '@nestjs/common';
import { RentService } from './rent.service';
import { RentController } from './rent.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rent } from 'src/entity/rent.entity';
import { ScooterModule } from '../scooter/scooter.module';

@Module({
  imports: [TypeOrmModule.forFeature([Rent]), ScooterModule],
  providers: [RentService],
  controllers: [RentController]
})
export class RentModule {}
