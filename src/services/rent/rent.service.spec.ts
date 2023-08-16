import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RentService } from './rent.service';
import { Rent } from 'src/entity/rent.entity';
import { RentStatus } from 'src/constants/common.constants';
import {
  NotFoundException,
  BadRequestException
} from 'src/common/exceptions/custom.exception';
import { plainToClass } from 'class-transformer';
import { UpdateRentDTO, RentDTO } from 'src/services/rent/dto/rent.dto';

describe('RentService', () => {
  let rentService: RentService;
  let rentRepository: Repository<Rent>;

  const nowTime = new Date('2023/01/01');
  const startTime = new Date('2022/01/01');
  const wrongStartTime = new Date('2023/01/02');

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RentService,
        {
          provide: getRepositoryToken(Rent),
          useClass: Repository
        }
      ]
    }).compile();

    rentService = module.get<RentService>(RentService);
    rentRepository = module.get<Repository<Rent>>(getRepositoryToken(Rent));
  });

  it('should be defined', () => {
    expect(rentService).toBeDefined();
  });

  describe('create', () => {
    it('should create a rent', async () => {
      const userId = 1;
      const scooterId = 2;
      const rentData = { userId, scooterId };

      const createdRent = new Rent();
      createdRent.userId = userId;
      createdRent.scooterId = scooterId;
      createdRent.start_time = new Date();
      createdRent.status = RentStatus.RENT;

      rentRepository.save = jest.fn().mockResolvedValue(createdRent);

      const result: RentDTO = plainToClass(RentDTO, createdRent, {
        excludeExtraneousValues: true
      });

      expect(await rentService.create(rentData)).toEqual(result);
    });
  });

  describe('update', () => {
    it('should throw NotFoundException when rent is not found', async () => {
      const rentId = 1;
      const rentData: UpdateRentDTO = {
        id: rentId,
        status: RentStatus.FINISHED
      };

      rentRepository.findOne = jest.fn().mockResolvedValue(null);

      await expect(rentService.update(rentData)).rejects.toThrowError(
        NotFoundException
      );
    });

    it('should throw BadRequestException when rent status is already finished', async () => {
      const rentId = 1;
      const rentData: UpdateRentDTO = {
        id: rentId,
        status: RentStatus.FINISHED
      };
      const existingRent = new Rent();
      existingRent.id = rentId;
      existingRent.status = RentStatus.FINISHED;

      rentRepository.findOne = jest.fn().mockResolvedValue(existingRent);

      await expect(rentService.update(rentData)).rejects.toThrowError(
        BadRequestException
      );
    });

    it('should throw BadRequestException when rent start time is greater than end time', async () => {
      const rentId = 1;
      const rentData: UpdateRentDTO = {
        id: rentId,
        status: RentStatus.FINISHED
      };
      const existingRent = new Rent();
      existingRent.id = rentId;
      existingRent.start_time = wrongStartTime;
      existingRent.status = RentStatus.RENT;
      rentRepository.findOne = jest.fn().mockResolvedValue(existingRent);
      jest.spyOn(global, 'Date').mockImplementation(() => nowTime);

      await expect(rentService.update(rentData)).rejects.toThrowError(
        BadRequestException
      );
    });

    it('should update a rent status', async () => {
      const rentId = 1;
      const rentData: UpdateRentDTO = {
        id: rentId,
        status: RentStatus.FINISHED
      };
      const existingRent = new Rent();
      existingRent.id = rentId;
      existingRent.status = RentStatus.RENT;
      existingRent.start_time = startTime;
      rentRepository.findOne = jest.fn().mockResolvedValue(existingRent);
      jest.spyOn(global, 'Date').mockImplementation(() => nowTime);

      const finishedRent = {
        ...existingRent,
        status: RentStatus.FINISHED,
        end_time: nowTime
      };
      rentRepository.save = jest.fn().mockResolvedValue(finishedRent);

      const result: RentDTO = plainToClass(RentDTO, finishedRent, {
        excludeExtraneousValues: true
      });

      expect(await rentService.update(rentData)).toEqual(result);
    });
  });
});
