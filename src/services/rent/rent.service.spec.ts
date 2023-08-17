import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RentService } from './rent.service';
import { Rent } from 'src/entity/rent.entity';
import { RentStatus, ScooterStatus } from 'src/constants/common.constants';
import {
  NotFoundException,
  BadRequestException
} from 'src/common/exceptions/custom.exception';
import { plainToClass } from 'class-transformer';
import { UpdateRentDTO, RentDTO } from 'src/services/rent/dto/rent.dto';
import { UserService } from 'src/services/user/user.service';
import { User } from 'src/entity/users.entity';
import { Scooter } from 'src/entity/scooters.entity';
import { RentStatus as RentStatusEntity } from 'src/entity/rentStatus.entity';
import { ScooterState } from 'src/entity/scooterState.entity';

describe('RentService', () => {
  let rentService: RentService;
  let userService: UserService;
  let rentRepository: Repository<Rent>;
  let rentStatusRepository: Repository<RentStatusEntity>;

  const nowTime = new Date('2023/01/01');
  const startTime = new Date('2022/01/01');
  const wrongStartTime = new Date('2023/01/02');

  const mockUserService = {
    findOne: jest.fn(),
    create: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RentService,
        { provide: UserService, useValue: mockUserService },
        {
          provide: getRepositoryToken(Rent),
          useClass: Repository
        },
        {
          provide: getRepositoryToken(RentStatusEntity),
          useClass: Repository
        }
      ]
    }).compile();

    rentService = module.get<RentService>(RentService);
    userService = module.get<UserService>(UserService);
    rentRepository = module.get<Repository<Rent>>(getRepositoryToken(Rent));
    rentStatusRepository = module.get<Repository<RentStatusEntity>>(
      getRepositoryToken(RentStatusEntity)
    );
  });

  it('should be defined', () => {
    expect(rentService).toBeDefined();
  });

  describe('create', () => {
    it('should create a rent', async () => {
      const userId = 1;
      const scooterState: ScooterState = {
        id: ScooterStatus.AVAILABLE,
        name: '正常'
      } as ScooterState;
      const scooter: Scooter = {
        id: 2,
        name: 'Scooter Test',
        license_number: 'TEST-123',
        price: 60,
        state: scooterState
      } as Scooter;
      const rentData = { userId, scooter };

      const mockUser: User = {
        id: userId,
        username: 'testUser',
        password: 'hashedPassword',
        name: 'Test User'
      } as User;
      userService.findOne = jest.fn().mockResolvedValue(mockUser);

      const mockRentStatus = {
        id: 1,
        name: '租借中'
      } as RentStatusEntity;
      rentStatusRepository.findOne = jest
        .fn()
        .mockResolvedValue(mockRentStatus);

      const createdRent = new Rent();
      createdRent.user = mockUser;
      createdRent.scooter = scooter;
      createdRent.start_time = new Date();
      createdRent.status = mockRentStatus;

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
      const userId = 1;
      const rentData: UpdateRentDTO = {
        id: rentId,
        status: RentStatus.FINISHED
      };

      rentRepository.findOne = jest.fn().mockResolvedValue(null);

      await expect(rentService.update(userId, rentData)).rejects.toThrowError(
        NotFoundException
      );
    });

    it('should throw BadRequestException when rent status is already finished', async () => {
      const rentId = 1;
      const userId = 1;
      const rentData: UpdateRentDTO = {
        id: rentId,
        status: RentStatus.FINISHED
      };
      const existingRent = new Rent();
      existingRent.id = rentId;
      existingRent.status = { id: RentStatus.FINISHED } as RentStatusEntity;
      existingRent.user = { id: userId } as User;
      rentRepository.findOne = jest.fn().mockResolvedValue(existingRent);

      await expect(rentService.update(userId, rentData)).rejects.toThrowError(
        BadRequestException
      );
    });

    it('should throw BadRequestException when rent start time is greater than end time', async () => {
      const userId = 1;
      const rentId = 1;
      const rentData: UpdateRentDTO = {
        id: rentId,
        status: RentStatus.FINISHED
      };
      const existingRent = new Rent();
      existingRent.id = rentId;
      existingRent.start_time = wrongStartTime;
      existingRent.status = { id: RentStatus.RENT } as RentStatusEntity;
      existingRent.user = { id: userId } as User;
      rentRepository.findOne = jest.fn().mockResolvedValue(existingRent);
      jest.spyOn(global, 'Date').mockImplementation(() => nowTime);

      await expect(rentService.update(userId, rentData)).rejects.toThrowError(
        BadRequestException
      );
    });

    it('should update a rent status', async () => {
      const userId = 1;
      const rentId = 1;
      const rentData: UpdateRentDTO = {
        id: rentId,
        status: RentStatus.FINISHED
      };
      const existingRent = new Rent();
      existingRent.id = rentId;
      existingRent.status = { id: RentStatus.RENT } as RentStatusEntity;
      existingRent.user = { id: userId } as User;
      existingRent.start_time = startTime;
      rentRepository.findOne = jest.fn().mockResolvedValue(existingRent);

      const mockNewRentStatus = { id: RentStatus.FINISHED } as RentStatusEntity;
      rentStatusRepository.findOne = jest
        .fn()
        .mockResolvedValue(mockNewRentStatus);

      jest.spyOn(global, 'Date').mockImplementation(() => nowTime);

      const finishedRent = {
        ...existingRent,
        status: mockNewRentStatus,
        end_time: nowTime
      };
      rentRepository.save = jest.fn().mockResolvedValue(finishedRent);

      const result: RentDTO = plainToClass(RentDTO, finishedRent, {
        excludeExtraneousValues: true
      });

      expect(await rentService.update(userId, rentData)).toEqual(result);
    });
  });
});
