import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { Expose, Type } from 'class-transformer';

export class ScooterInfoDTO {
  @IsInt()
  @IsNotEmpty()
  readonly id: number;

  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  @Expose({ name: 'license_number' })
  readonly licenseNumber: string;

  @IsInt()
  @IsNotEmpty()
  readonly price: number;
}

export class RentInfoDTO {
  @IsInt()
  @Expose()
  @IsNotEmpty()
  readonly id: number;

  @IsInt()
  @Expose()
  @IsNotEmpty()
  readonly status: number;

  @IsNotEmpty()
  @Type(() => Date)
  @Expose({ name: 'start_time' })
  readonly startTime: Date;

  @IsNotEmpty()
  @Type(() => Date)
  @Expose({ name: 'end_time' })
  readonly endTime: Date;

  @Expose()
  @Type(() => ScooterInfoDTO)
  readonly scooter: ScooterInfoDTO;
}
