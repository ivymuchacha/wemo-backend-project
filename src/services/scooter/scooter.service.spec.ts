import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ScooterService } from './scooter.service';
import { Scooter } from 'src/entity/scooters.entity';
import { plainToClass } from 'class-transformer';
import { ScooterDTO } from './dto/scooter.dto';
import { ScooterStatus } from 'src/constants/common.constants';

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

  describe('getAvailable', () => {
    it('should return available scooters', async () => {
      const availableScooters = [
        { id: 1, state: ScooterStatus.AVAILABLE, rents: [] },
        { id: 2, state: ScooterStatus.AVAILABLE, rents: [] }
      ];
      scooterRepository.createQueryBuilder = jest.fn().mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(availableScooters)
      });

      const result: ScooterDTO[] = availableScooters.map((element) =>
        plainToClass(ScooterDTO, element, { excludeExtraneousValues: true })
      );

      expect(await scooterService.getAvailable()).toEqual(result);
    });
  });

  describe('getById', () => {
    it('should return a scooter by id', async () => {
      const scooterId = 1;
      const scooterData = {
        id: scooterId,
        state: ScooterStatus.AVAILABLE,
        rents: []
      };
      scooterRepository.findOne = jest.fn().mockResolvedValue(scooterData);

      const result: ScooterDTO = plainToClass(ScooterDTO, scooterData, {
        excludeExtraneousValues: true
      });

      expect(await scooterService.getById(scooterId)).toEqual(result);
    });
  });
});
