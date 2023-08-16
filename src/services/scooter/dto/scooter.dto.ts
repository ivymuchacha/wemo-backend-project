import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ScooterStatus, RentStatus } from 'src/constants/common.constants';

export class GetScooterDTO {
  @ApiProperty({ description: 'id' })
  @IsInt()
  @Expose({ name: 'scooter_id' })
  @IsNotEmpty()
  readonly id: number;

  @ApiProperty({ description: '車輛名稱' })
  @IsString()
  @Expose({ name: 'scooter_name' })
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({ description: '車輛狀態', enum: ScooterStatus })
  @IsInt()
  @Expose({ name: 'scooter_state' })
  @IsNotEmpty()
  readonly state: ScooterStatus;

  @ApiProperty({ description: '租借狀態', enum: RentStatus })
  @IsInt()
  @Expose()
  @IsNotEmpty()
  @Type(() => Number)
  readonly rentStatus: RentStatus;
}

export class ScooterDTO {
  @ApiProperty({ description: 'id' })
  @IsInt()
  @Expose()
  @IsNotEmpty()
  readonly id: number;

  @ApiProperty({ description: '車輛名稱' })
  @IsString()
  @Expose()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({ description: '車牌號碼' })
  @IsString()
  @IsNotEmpty()
  @Expose({ name: 'license_number' })
  readonly licenseNumber: string;

  @ApiProperty({ description: '租借費用' })
  @IsInt()
  @Expose()
  @IsNotEmpty()
  readonly price: number;

  @ApiProperty({ description: '車輛狀態', enum: ScooterStatus })
  @IsInt()
  @Expose()
  @IsNotEmpty()
  readonly state: ScooterStatus;
}
