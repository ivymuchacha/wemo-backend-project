import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  CreateUserDTO,
  UserDTO,
  LoginResponseDTO
} from 'src/services/auth/dto/user.dto';
import {
  ConflictException,
  NotFoundException,
  UnauthorizedException
} from 'src/common/exceptions/custom.exception';
import { UserService } from 'src/services/user/user.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  async register(data: CreateUserDTO): Promise<void> {
    const { username, password, name } = data;
    const user = await this.userService.findOne(username);
    if (user) throw new ConflictException('Username already exists.');

    const hashPassword = await bcrypt.hash(
      password,
      parseInt(this.configService.get('HASH_SALT'))
    );
    await this.userService.create({
      username,
      password: hashPassword,
      name
    });
    return;
  }

  async login(data: UserDTO): Promise<LoginResponseDTO> {
    const { username, password } = data;
    const user = await this.userService.findOne(username);
    if (!user) throw new NotFoundException();

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new UnauthorizedException();

    const payload = { id: user.id, username: user.username, name: user.name };
    const token = await this.jwtService.signAsync(payload);
    return { token };
  }
}
