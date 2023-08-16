import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Scooter } from 'src/entity/scooters.entity';
import { ScooterDTO } from 'src/services/scooter/dto/scooter.dto';
import { plainToClass } from 'class-transformer';
import { RentStatus, ScooterStatus } from 'src/constants/common.constants';

@Injectable()
export class ScooterService {
  constructor(
    @InjectRepository(Scooter)
    private scooterRespository: Repository<Scooter>
  ) {}

  async getAvailable(): Promise<ScooterDTO[]> {
    const result = await this.scooterRespository
      .createQueryBuilder('scooter')
      .leftJoinAndSelect('scooter.rents', 'rent')
      .where('scooter.state = :state', { state: ScooterStatus.AVAILABLE })
      .andWhere('(rent.status IS NULL OR rent.status != :status)', {
        status: RentStatus.RENT
      })
      .getMany();

    return result.map((element) =>
      plainToClass(ScooterDTO, element, { excludeExtraneousValues: true })
    );
  }

  async getById(id: number): Promise<ScooterDTO> {
    const result = await this.scooterRespository.findOne({ where: { id } });
    return plainToClass(ScooterDTO, result, { excludeExtraneousValues: true });
  }
}
