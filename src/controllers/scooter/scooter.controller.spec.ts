import { Test, TestingModule } from '@nestjs/testing';
import { ScooterController } from './scooter.controller';
import { ScooterService } from 'src/services/scooter/scooter.service';
import { ScooterDTO } from 'src/services/scooter/dto/scooter.dto';
import { ScooterStatus } from 'src/constants/common.constants';

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
            getAvailable: jest.fn()
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

  describe('getAvailableScooter', () => {
    it('should return available scooters', async () => {
      const availableScooters: ScooterDTO[] = [
        {
          id: 1,
          name: 'Scooter A',
          licenseNumber: 'A',
          price: 100,
          state: ScooterStatus.AVAILABLE
        },
        {
          id: 2,
          name: 'Scooter B',
          licenseNumber: 'B',
          price: 100,
          state: ScooterStatus.AVAILABLE
        }
      ];
      jest
        .spyOn(scooterService, 'getAvailable')
        .mockImplementation(() => Promise.resolve(availableScooters));

      expect(await controller.getAvailableScooter()).toBe(availableScooters);
    });
  });
});
