import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateRentDTO, RentDTO } from './dto/rent.dto';
import { Rent } from 'src/entity/rent.entity';
import { RentStatus } from 'src/constants/common.constants';
import {
  NotFoundException,
  BadRequestException,
  ForbiddenException
} from 'src/common/exceptions/custom.exception';
import { plainToClass } from 'class-transformer';

@Injectable()
export class RentService {
  constructor(
    @InjectRepository(Rent)
    private rentRespository: Repository<Rent>
  ) {}

  async create(data): Promise<RentDTO> {
    const { userId, scooterId } = data;
    const result = await this.rentRespository.save({
      userId,
      scooterId,
      start_time: new Date(),
      status: RentStatus.RENT
    });

    return plainToClass(RentDTO, result, { excludeExtraneousValues: true });
  }

  async update(data: UpdateRentDTO): Promise<RentDTO> {
    const { id, status } = data;
    const rent = await this.rentRespository.findOne({ where: { id } });
    if (!rent) throw new NotFoundException('Rent is not exist.');
    if (rent.status === RentStatus.FINISHED) throw new ForbiddenException();

    if (status === RentStatus.FINISHED) {
      const endTime = new Date();
      if (rent.start_time > endTime)
        throw new BadRequestException(
          `Start Time should not be greater than End Time.`
        );
      rent.end_time = endTime;
    }

    rent.status = status;
    const result = await this.rentRespository.save(rent);
    return plainToClass(RentDTO, result, { excludeExtraneousValues: true });
  }

  async checkUserAbleToRent(userId: number): Promise<boolean> {
    const result = await this.rentRespository.find({
      where: { userId, status: RentStatus.RENT }
    });
    return !result.length;
  }
}
