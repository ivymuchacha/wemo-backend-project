import { IsInt, IsNotEmpty, IsOptional } from 'class-validator';
import { Expose, Type } from 'class-transformer';

export class CreateRentDTO {
  @IsInt()
  @IsNotEmpty()
  readonly scooterId: number;
}

export class UpdateRentDTO {
  @IsInt()
  @IsNotEmpty()
  readonly id: number;

  @IsInt()
  @IsNotEmpty()
  readonly status: number;
}

export class RentDTO {
  @IsInt()
  @Expose()
  @IsNotEmpty()
  readonly id: number;

  @IsInt()
  @Expose()
  @IsNotEmpty()
  readonly userId: number;

  @IsInt()
  @Expose()
  @IsNotEmpty()
  readonly scooterId: number;

  @IsInt()
  @Expose()
  @IsNotEmpty()
  readonly status: number;

  @Expose({ name: 'start_time' })
  @IsNotEmpty()
  @Type(() => Date)
  readonly startTime: Date;

  @Expose({ name: 'end_time' })
  @IsNotEmpty()
  @Type(() => Date)
  readonly endTime: Date;
}
