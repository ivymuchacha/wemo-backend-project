import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entity/users.entity';
import { Repository } from 'typeorm';
import { CreateUserDTO } from 'src/services/auth/dto/user.dto';
import { RentInfoDTO } from 'src/services/user/dto/user.dto';
import { Rent } from 'src/entity/rent.entity';
import { plainToClass } from 'class-transformer';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRespository: Repository<User>,
    @InjectRepository(Rent)
    private rentRespository: Repository<Rent>
  ) {}

  async findOne(data: { id?: number; username?: string }): Promise<User> {
    const { id, username } = data;
    const user = await this.userRespository.findOne({
      where: { id, username }
    });
    return user;
  }

  async create(data: CreateUserDTO): Promise<void> {
    await this.userRespository.save(data);
  }

  async getRents(userId: number): Promise<RentInfoDTO[]> {
    const result = await this.rentRespository
      .createQueryBuilder('rent')
      .leftJoin('rent.user', 'user')
      .leftJoinAndSelect('rent.scooter', 'scooter')
      .select([
        'rent.id',
        'rent.status',
        'rent.start_time',
        'rent.end_time',
        'scooter.id',
        'scooter.name',
        'scooter.license_number',
        'scooter.price'
      ])
      .where('user.id = :id', { id: userId })
      .orderBy('start_time', 'DESC')
      .getMany();

    return result.map((element) => plainToClass(RentInfoDTO, element));
  }
}
