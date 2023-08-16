import { IsInt, IsNotEmpty } from 'class-validator';
import { Expose, Type, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { RentStatus } from 'src/constants/common.constants';

export class CreateRentDTO {
  @ApiProperty({ description: '車輛 ID' })
  @IsInt()
  @IsNotEmpty()
  readonly scooterId: number;
}

export class UpdateRentDTO {
  @ApiProperty({ description: '租借交易 ID' })
  @IsInt()
  @IsNotEmpty()
  readonly id: number;

  @ApiProperty({ description: '租借狀態', enum: RentStatus })
  @IsInt()
  @IsNotEmpty()
  readonly status: RentStatus;
}

export class RentDTO {
  @ApiProperty({ description: 'id' })
  @IsInt()
  @Expose()
  @IsNotEmpty()
  readonly id: number;

  @ApiProperty({ description: '使用者 ID' })
  @IsInt()
  @Expose()
  @IsNotEmpty()
  readonly userId: number;

  @ApiProperty({ description: '車輛 ID' })
  @IsInt()
  @Expose()
  @IsNotEmpty()
  readonly scooterId: number;

  @ApiProperty({ description: '租借狀態', enum: RentStatus })
  @IsInt()
  @Expose()
  @IsNotEmpty()
  @Transform(({ obj }) => obj.status.id)
  readonly status: RentStatus;

  @ApiProperty({ description: '租借開始時間' })
  @Expose({ name: 'start_time' })
  @IsNotEmpty()
  @Type(() => Date)
  readonly startTime: Date;

  @ApiProperty({ description: '租借結束時間' })
  @Expose({ name: 'end_time' })
  @IsNotEmpty()
  @Type(() => Date)
  readonly endTime: Date;
}
