import { Test, TestingModule } from '@nestjs/testing';
import { RentController } from './rent.controller';
import { RentService } from 'src/services/rent/rent.service';
import { ScooterService } from 'src/services/scooter/scooter.service';
import {
  CreateRentDTO,
  UpdateRentDTO,
  RentDTO
} from 'src/services/rent/dto/rent.dto';
import { ConflictException } from 'src/common/exceptions/custom.exception';
import { RentStatus, ScooterStatus } from 'src/constants/common.constants';
import { ScooterDTO } from 'src/services/scooter/dto/scooter.dto';

describe('RentController', () => {
  let controller: RentController;
  let rentService: RentService;
  let scooterService: ScooterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RentController],
      providers: [
        {
          provide: RentService,
          useValue: {
            checkUserAbleToRent: jest.fn(),
            checkScooterAbleToRent: jest.fn(),
            create: jest.fn(),
            update: jest.fn()
          }
        },
        {
          provide: ScooterService,
          useValue: {
            getById: jest.fn()
          }
        }
      ]
    }).compile();

    controller = module.get<RentController>(RentController);
    rentService = module.get<RentService>(RentService);
    scooterService = module.get<ScooterService>(ScooterService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createRent', () => {
    it('should create a rent', async () => {
      const userId = 1;
      const scooterId = 2;
      const mockAvailableScooter: ScooterDTO = {
        id: scooterId,
        name: 'mockScooter',
        licenseNumber: 'mock number',
        price: 100,
        state: ScooterStatus.AVAILABLE
      };

      jest
        .spyOn(rentService, 'checkUserAbleToRent')
        .mockImplementation(() => Promise.resolve(true));
      jest
        .spyOn(rentService, 'checkScooterAbleToRent')
        .mockImplementation(() => Promise.resolve(true));
      jest
        .spyOn(scooterService, 'getById')
        .mockImplementation(() => Promise.resolve(mockAvailableScooter));

      const result = {
        userId,
        scooterId,
        status: RentStatus.RENT,
        startTime: new Date()
      } as RentDTO;
      jest
        .spyOn(rentService, 'create')
        .mockImplementation(() => Promise.resolve(result));

      const request = { user: { id: userId } };
      const createRentDTO: CreateRentDTO = { scooterId };

      expect(await controller.create(request, createRentDTO)).toBe(result);
    });

    it('should throw ConflictException if user is not able to rent', async () => {
      jest
        .spyOn(rentService, 'checkUserAbleToRent')
        .mockImplementation(() => Promise.resolve(false));

      const request = { user: { id: 1 } };
      const createRentDTO: CreateRentDTO = { scooterId: 2 };

      await expect(
        controller.create(request, createRentDTO)
      ).rejects.toThrowError(ConflictException);
    });

    it('should throw ConflictException if scooter is not available', async () => {
      const scooterId = 2;
      const mockRepairScooter: ScooterDTO = {
        id: scooterId,
        name: 'mockScooter',
        licenseNumber: 'mock number',
        price: 100,
        state: ScooterStatus.REPAIR
      };

      jest
        .spyOn(rentService, 'checkUserAbleToRent')
        .mockImplementation(() => Promise.resolve(true));
      jest
        .spyOn(rentService, 'checkScooterAbleToRent')
        .mockImplementation(() => Promise.resolve(false));
      jest
        .spyOn(scooterService, 'getById')
        .mockImplementation(() => Promise.resolve(mockRepairScooter));

      const request = { user: { id: 1 } };
      const createRentDTO: CreateRentDTO = { scooterId: 2 };

      await expect(
        controller.create(request, createRentDTO)
      ).rejects.toThrowError(ConflictException);
    });
  });

  describe('updateRent', () => {
    it('should update a rent', async () => {
      const userId = 1;
      const mockUser = {
        id: userId,
        username: 'testuser',
        name: 'Test User'
      };

      const mockRequest = { user: mockUser };
      const updateRentDTO: UpdateRentDTO = {
        id: 1,
        status: RentStatus.FINISHED
      };
      const result: RentDTO = updateRentDTO as RentDTO;

      jest
        .spyOn(rentService, 'update')
        .mockImplementation(() => Promise.resolve(result));

      expect(await controller.update(mockRequest, updateRentDTO)).toBe(result);
    });
  });
});
