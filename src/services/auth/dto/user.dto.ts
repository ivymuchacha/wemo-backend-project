import { IsString, IsNotEmpty, IsInt } from 'class-validator';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UserDTO {
  @ApiProperty({ description: '使用者帳號' })
  @IsString()
  @IsNotEmpty()
  readonly username: string;

  @ApiProperty({ description: '使用者密碼' })
  @IsString()
  @IsNotEmpty()
  readonly password: string;
}

export class CreateUserDTO extends UserDTO {
  @ApiProperty({ description: '使用者名稱' })
  @IsString()
  @IsNotEmpty()
  readonly name: string;
}

export class LoginResponseDTO {
  @ApiProperty({ description: 'token' })
  @IsString()
  readonly token: string;
}

export class UserInfoDTO {
  @ApiProperty({ description: 'id' })
  @IsInt()
  @IsNotEmpty()
  @Expose()
  readonly id: number;

  @ApiProperty({ description: '使用者帳號' })
  @IsString()
  @IsNotEmpty()
  @Expose()
  readonly username: string;

  @ApiProperty({ description: '使用者名稱' })
  @IsString()
  @IsNotEmpty()
  @Expose()
  readonly name: string;
}
