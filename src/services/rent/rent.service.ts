import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateRentDTO, RentDTO } from './dto/rent.dto';
import { Rent } from 'src/entity/rent.entity';
import { RentStatus } from 'src/constants/common.constants';
import {
  NotFoundException,
  BadRequestException
} from 'src/common/exceptions/custom.exception';
import { plainToClass } from 'class-transformer';
import { UserService } from '../user/user.service';
import { RentStatus as RentStatusEntity } from 'src/entity/rentStatus.entity';

@Injectable()
export class RentService {
  constructor(
    @InjectRepository(Rent)
    private rentRespository: Repository<Rent>,
    @InjectRepository(RentStatusEntity)
    private rentStatusRespository: Repository<RentStatusEntity>,

    private userService: UserService
  ) {}

  async create(data): Promise<RentDTO> {
    const { userId, scooter } = data;
    const user = await this.userService.findOne({ id: userId });
    const status = await this.rentStatusRespository.findOne({
      where: { id: RentStatus.RENT }
    });
    const result = await this.rentRespository.save({
      user,
      scooter,
      start_time: new Date(),
      status
    });
    return plainToClass(RentDTO, result, { excludeExtraneousValues: true });
  }

  async update(data: UpdateRentDTO): Promise<RentDTO> {
    const { id, status } = data;
    const rent = await this.rentRespository.findOne({
      where: { id },
      relations: ['status']
    });
    if (!rent) throw new NotFoundException('Rent is not exist.');
    if (rent.status.id === RentStatus.FINISHED) throw new BadRequestException();

    if (status === RentStatus.FINISHED) {
      const endTime = new Date();
      if (rent.start_time > endTime)
        throw new BadRequestException(
          `Start Time should not be greater than End Time.`
        );
      rent.end_time = endTime;
    }
    const newStatus = await this.rentStatusRespository.findOne({
      where: { id: status }
    });
    rent.status = newStatus;
    const result = await this.rentRespository.save(rent);
    return plainToClass(RentDTO, result, { excludeExtraneousValues: true });
  }

  async checkUserAbleToRent(userId: number): Promise<boolean> {
    const result = await this.rentRespository.find({
      where: { user: { id: userId }, status: { id: RentStatus.RENT } }
    });
    return !result.length;
  }
}
