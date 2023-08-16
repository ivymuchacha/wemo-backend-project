import { Test, TestingModule } from '@nestjs/testing';
import { ScooterController } from './scooter.controller';
import { ScooterService } from 'src/services/scooter/scooter.service';
import { GetScooterDTO } from 'src/services/scooter/dto/scooter.dto';
import { ScooterStatus, RentStatus } from 'src/constants/common.constants';

describe('ScooterController', () => {
  let controller: ScooterController;
  let scooterService: ScooterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScooterController],
      providers: [
        {
          provide: ScooterService,
          useValue: {
            getScooters: jest.fn(),
            getById: jest.fn()
          }
        }
      ]
    }).compile();

    controller = module.get<ScooterController>(ScooterController);
    scooterService = module.get<ScooterService>(ScooterService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getScooters', () => {
    it('should return scooters', async () => {
      const availableScooters: GetScooterDTO[] = [
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
          rentStatus: RentStatus.RENT
        }
      ];
      jest
        .spyOn(scooterService, 'getScooters')
        .mockImplementation(() => Promise.resolve(availableScooters));

      expect(await controller.getScooters()).toBe(availableScooters);
    });
  });

  describe('getById', () => {
    it('should return scooter info', async () => {
      const scooterId = 1;
      const scooterData = {
        id: scooterId,
        name: 'ScooterA',
        licenseNumber: 'AAA-001',
        price: 100,
        state: ScooterStatus.AVAILABLE
      };
      jest
        .spyOn(scooterService, 'getById')
        .mockImplementation(() => Promise.resolve(scooterData));

      expect(await controller.getById(scooterId)).toBe(scooterData);
    });
  });
});
