import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RentService } from 'src/services/rent/rent.service';
import { RentController } from 'src/controllers/rent/rent.controller';
import { Rent } from 'src/entity/rent.entity';
import { ScooterModule } from 'src/modules/scooter/scooter.module';
import { UserModule } from 'src/modules/user/user.module';
import { RentStatus } from 'src/entity/rentStatus.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Rent, RentStatus]),
    ScooterModule,
    UserModule
  ],
  providers: [RentService],
  controllers: [RentController]
})
export class RentModule {}
