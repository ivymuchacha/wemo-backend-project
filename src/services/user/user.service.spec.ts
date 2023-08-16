import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/entity/users.entity';
import { CreateUserDTO } from 'src/services/auth/dto/user.dto';
import { Rent } from 'src/entity/rent.entity';
import { RentInfoDTO, ScooterInfoDTO } from './dto/user.dto';
import { RentStatus } from 'src/constants/common.constants';
import { plainToClass } from 'class-transformer';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: Repository<User>;
  let rentRepository: Repository<Rent>;

  const startTime = new Date('2023/01/01');
  const endTime = new Date('2023/01/02');

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository
        },
        {
          provide: getRepositoryToken(Rent),
          useClass: Repository
        }
      ]
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    rentRepository = module.get<Repository<Rent>>(getRepositoryToken(Rent));
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a user when a username or id is provided', async () => {
      const mockUser = new User();
      mockUser.username = 'testUser';

      userRepository.findOne = jest.fn().mockResolvedValue(mockUser);

      const result = await userService.findOne({ username: 'testUser' });
      expect(result).toEqual(mockUser);
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDTO: CreateUserDTO = {
        username: 'newUser',
        password: 'password123',
        name: 'newUserName'
      };

      userRepository.save = jest.fn();

      await userService.create(createUserDTO);
      expect(userRepository.save).toHaveBeenCalledWith(createUserDTO);
    });
  });

  describe('getRents', () => {
    it('should return rents for a user', async () => {
      const userId = 1;
      const rentInfo: RentInfoDTO[] = [
        {
          id: 1,
          status: RentStatus.RENT,
          startTime,
          endTime,
          scooter: {
            id: 1,
            name: 'Test Scooter ',
            licenseNumber: 'TEST-123',
            price: 10
          } as ScooterInfoDTO
        }
      ];
      rentRepository.createQueryBuilder = jest.fn().mockReturnValue({
        leftJoin: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(rentInfo)
      });

      const result: RentInfoDTO[] = rentInfo.map((element) =>
        plainToClass(RentInfoDTO, element)
      );

      expect(await userService.getRents(userId)).toEqual(result);
    });
  });
});
