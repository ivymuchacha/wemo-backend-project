import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from 'src/services/user/user.service';
import { RentInfoDTO, ScooterInfoDTO } from '../../services/user/dto/user.dto';
import { RentStatus } from 'src/constants/common.constants';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  const startTime = new Date('2023/01/01');
  const endTime = new Date('2023/01/02');

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            getRents: jest.fn()
          }
        }
      ]
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  describe('getRents', () => {
    it('should get rents for the authenticated user', async () => {
      const userId = 1;
      const rentInfo: RentInfoDTO[] = [
        {
          id: 1,
          status: RentStatus.RENT,
          startTime,
          endTime,
          scooter: {
            id: 1,
            name: 'Test Scooter',
            licenseNumber: 'TEST-123',
            price: 10
          } as ScooterInfoDTO
        }
      ];

      const request = { user: { id: userId } };
      jest
        .spyOn(userService, 'getRents')
        .mockImplementation(() => Promise.resolve(rentInfo));

      expect(await userController.getRents(request)).toEqual(rentInfo);
    });
  });
});
