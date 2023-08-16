import * as bcrypt from 'bcrypt';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from 'src/services/user/user.service';
import { JwtService } from '@nestjs/jwt';
import {
  ConflictException,
  NotFoundException,
  UnauthorizedException
} from 'src/common/exceptions/custom.exception';
import { CreateUserDTO, UserDTO, LoginResponseDTO } from './dto/user.dto';
import { ConfigService } from '@nestjs/config';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;
  let configService: ConfigService;

  const mockUserService = {
    findOne: jest.fn(),
    create: jest.fn()
  };

  const mockJwtService = {
    signAsync: jest.fn()
  };

  const mockConfigService = {
    get: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService }
      ]
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const createUserDTO: CreateUserDTO = {
        username: 'newUser',
        password: 'password123',
        name: 'John Doe'
      };

      const mockHashedPassword = 'hashedPassword';
      jest
        .spyOn(bcrypt, 'hash')
        .mockImplementation(() => Promise.resolve(mockHashedPassword));

      mockUserService.findOne.mockResolvedValue(undefined);
      mockUserService.create.mockResolvedValue(createUserDTO);

      await authService.register(createUserDTO);
      expect(mockUserService.findOne).toHaveBeenCalledWith({
        username: createUserDTO.username
      });
      expect(mockUserService.create).toHaveBeenCalledWith({
        username: createUserDTO.username,
        password: mockHashedPassword,
        name: createUserDTO.name
      });
    });

    it('should throw a ConflictException if username already exists', async () => {
      const createUserDTO: CreateUserDTO = {
        username: 'existingUser',
        password: 'password123',
        name: 'Jane Smith'
      };

      mockUserService.findOne.mockResolvedValue({});

      await expect(authService.register(createUserDTO)).rejects.toThrowError(
        ConflictException
      );
    });
  });

  describe('login', () => {
    it('should login a user and return a token', async () => {
      const userDTO: UserDTO = {
        username: 'testUser',
        password: 'password123'
      };

      const mockUser = {
        id: 1,
        username: userDTO.username,
        password: 'hashedPassword',
        name: 'Test User'
      };

      mockUserService.findOne.mockResolvedValue(mockUser);
      const spiedBcryptCompateMethod = jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => true);

      const mockToken = 'mockToken';
      mockJwtService.signAsync.mockResolvedValue(mockToken);

      const expectedLoginResponse: LoginResponseDTO = { token: mockToken };

      const result = await authService.login(userDTO);
      expect(mockUserService.findOne).toHaveBeenCalledWith({
        username: userDTO.username
      });
      expect(spiedBcryptCompateMethod).toHaveBeenCalledWith(
        userDTO.password,
        mockUser.password
      );
      expect(mockJwtService.signAsync).toHaveBeenCalledWith({
        id: mockUser.id,
        username: mockUser.username,
        name: mockUser.name
      });
      expect(result).toEqual(expectedLoginResponse);
    });

    it('should throw a NotFoundException if user does not exist', async () => {
      const userDTO: UserDTO = {
        username: 'nonexistentuser',
        password: 'password123'
      };

      mockUserService.findOne.mockResolvedValue(undefined);

      await expect(authService.login(userDTO)).rejects.toThrowError(
        NotFoundException
      );
    });

    it('should throw an UnauthorizedException if password is incorrect', async () => {
      const userDTO: UserDTO = {
        username: 'testuser',
        password: 'incorrectpassword'
      };

      const mockUser = {
        id: 1,
        username: userDTO.username,
        password: 'hashedPassword',
        name: 'Test User'
      };

      mockUserService.findOne.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => false);

      await expect(authService.login(userDTO)).rejects.toThrowError(
        UnauthorizedException
      );
    });
  });
});
