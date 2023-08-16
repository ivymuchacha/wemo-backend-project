import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { RentStatus } from 'src/constants/common.constants';

export class ScooterInfoDTO {
  @ApiProperty({ description: 'id' })
  @IsInt()
  @IsNotEmpty()
  readonly id: number;

  @ApiProperty({ description: '車輛名稱' })
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({ description: '車牌號碼' })
  @IsString()
  @IsNotEmpty()
  @Expose({ name: 'license_number' })
  readonly licenseNumber: string;

  @ApiProperty({ description: '租借費用' })
  @IsInt()
  @IsNotEmpty()
  readonly price: number;
}

export class RentInfoDTO {
  @ApiProperty({ description: 'id' })
  @IsInt()
  @Expose()
  @IsNotEmpty()
  readonly id: number;

  @ApiProperty({ description: '租借狀態', enum: RentStatus })
  @IsInt()
  @Expose()
  @IsNotEmpty()
  readonly status: RentStatus;

  @ApiProperty({ description: '租借開始時間' })
  @IsNotEmpty()
  @Type(() => Date)
  @Expose({ name: 'start_time' })
  readonly startTime: Date;

  @ApiProperty({ description: '租借結束時間' })
  @IsNotEmpty()
  @Type(() => Date)
  @Expose({ name: 'end_time' })
  readonly endTime: Date;

  @ApiProperty({ description: '車輛資料', type: ScooterInfoDTO })
  @Expose()
  @Type(() => ScooterInfoDTO)
  readonly scooter: ScooterInfoDTO;
}
