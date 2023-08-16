import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RentService } from 'src/services/rent/rent.service';
import { RentController } from 'src/controllers/rent/rent.controller';
import { Rent } from 'src/entity/rent.entity';
import { ScooterModule } from 'src/modules/scooter/scooter.module';

@Module({
  imports: [TypeOrmModule.forFeature([Rent]), ScooterModule],
  providers: [RentService],
  controllers: [RentController]
})
export class RentModule {}
