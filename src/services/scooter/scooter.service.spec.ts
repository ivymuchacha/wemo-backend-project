import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ScooterService } from './scooter.service';
import { Scooter } from 'src/entity/scooters.entity';
import { plainToClass } from 'class-transformer';
import { ScooterDTO, GetScooterDTO } from './dto/scooter.dto';
import { RentStatus, ScooterStatus } from 'src/constants/common.constants';

describe('ScooterService', () => {
  let scooterService: ScooterService;
  let scooterRepository: Repository<Scooter>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScooterService,
        {
          provide: getRepositoryToken(Scooter),
          useClass: Repository
        }
      ]
    }).compile();

    scooterService = module.get<ScooterService>(ScooterService);
    scooterRepository = module.get<Repository<Scooter>>(
      getRepositoryToken(Scooter)
    );
  });

  it('should be defined', () => {
    expect(scooterService).toBeDefined();
  });

  describe('getScooters', () => {
    it('should return scooters', async () => {
      const availableScooters = [
        {
          id: 1,
          name: 'ScooterA',
          state: ScooterStatus.AVAILABLE,
          rentStatus: RentStatus.RENT
        },
        {
          id: 2,
          name: 'ScooterB',
          state: ScooterStatus.AVAILABLE,
          rentStatus: RentStatus.FINISHED
        }
      ];
      scooterRepository.createQueryBuilder = jest.fn().mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue(availableScooters)
      });

      const result: GetScooterDTO[] = availableScooters.map((element) =>
        plainToClass(GetScooterDTO, element, { excludeExtraneousValues: true })
      );

      expect(await scooterService.getScooters()).toEqual(result);
    });
  });

  describe('getById', () => {
    it('should return a scooter by id', async () => {
      const scooterId = 1;
      const scooterData = {
        id: scooterId,
        name: 'ScooterA',
        licenseNumber: 'AAA-001',
        price: 100,
        state: ScooterStatus.AVAILABLE
      };
      scooterRepository.findOne = jest.fn().mockResolvedValue(scooterData);

      const result: ScooterDTO = plainToClass(ScooterDTO, scooterData, {
        excludeExtraneousValues: true
      });

      expect(await scooterService.getById(scooterId)).toEqual(result);
    });
  });
});
