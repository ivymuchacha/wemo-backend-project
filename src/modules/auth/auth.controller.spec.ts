import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CreateUserDTO, LoginResponseDTO, UserDTO } from './dto/user.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }]
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('should call authService.register with provided data', async () => {
      const createUserDTO: CreateUserDTO = {
        username: 'newuser',
        password: 'password123',
        name: 'John Doe'
      };

      await authController.register(createUserDTO);

      expect(authService.register).toHaveBeenCalledWith(createUserDTO);
    });
  });

  describe('login', () => {
    it('should call authService.login with provided data', async () => {
      const userDTO: UserDTO = {
        username: 'testuser',
        password: 'password123'
      };

      const mockLoginResponse: LoginResponseDTO = {
        token: 'mockToken'
      };

      jest
        .spyOn(authService, 'login')
        .mockImplementation(() => Promise.resolve(mockLoginResponse));

      const result = await authController.login(userDTO);

      expect(authService.login).toHaveBeenCalledWith(userDTO);
      expect(result).toEqual(mockLoginResponse);
    });
  });

  describe('me', () => {
    it('should return the user from the request', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        name: 'Test User'
      };

      const mockRequest = { user: mockUser };

      const result = await authController.me(mockRequest);

      expect(result).toEqual(mockUser);
    });
  });
});
