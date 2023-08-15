import { IsString, IsNotEmpty } from 'class-validator';

export class UserDTO {
  @IsString()
  @IsNotEmpty()
  readonly username: string;

  @IsString()
  @IsNotEmpty()
  readonly password: string;
}

export class CreateUserDTO extends UserDTO {
  @IsString()
  @IsNotEmpty()
  readonly name: string;
}

export class LoginResponseDTO {
  @IsString()
  readonly token: string;
}
