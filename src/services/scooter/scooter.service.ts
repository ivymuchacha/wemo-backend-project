import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Scooter } from 'src/entity/scooters.entity';
import {
  ScooterDTO,
  GetScooterDTO
} from 'src/services/scooter/dto/scooter.dto';
import { plainToClass } from 'class-transformer';
import { RentStatus } from 'src/constants/common.constants';

@Injectable()
export class ScooterService {
  constructor(
    @InjectRepository(Scooter)
    private scooterRespository: Repository<Scooter>
  ) {}

  async getScooters(): Promise<GetScooterDTO[]> {
    const result = await this.scooterRespository
      .createQueryBuilder('scooter')
      .leftJoinAndSelect('scooter.rents', 'rent')
      .select(['scooter.id', 'scooter.name', 'scooter.state'])
      .addSelect(
        `CASE WHEN SUM(rent.status = ${RentStatus.RENT}) > 0 THEN 1 ELSE 2 END`,
        'rentStatus'
      )
      .groupBy('scooter.id')
      .getRawMany();

    return result.map((element) => plainToClass(GetScooterDTO, element));
  }

  async getById(id: number): Promise<ScooterDTO> {
    const result = await this.scooterRespository.findOne({ where: { id } });
    return plainToClass(ScooterDTO, result, { excludeExtraneousValues: true });
  }
}
