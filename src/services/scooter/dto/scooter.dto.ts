import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { Expose, Type } from 'class-transformer';

export class GetScooterDTO {
  @IsInt()
  @Expose({ name: 'scooter_id' })
  @IsNotEmpty()
  readonly id: number;

  @IsString()
  @Expose({ name: 'scooter_name' })
  @IsNotEmpty()
  readonly name: string;

  @IsInt()
  @Expose({ name: 'scooter_state' })
  @IsNotEmpty()
  readonly state: number;

  @IsInt()
  @Expose()
  @IsNotEmpty()
  @Type(() => Number)
  readonly rentStatus: number;
}

export class ScooterDTO {
  @IsInt()
  @Expose()
  @IsNotEmpty()
  readonly id: number;

  @IsString()
  @Expose()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  @Expose({ name: 'license_number' })
  readonly licenseNumber: string;

  @IsInt()
  @Expose()
  @IsNotEmpty()
  readonly price: number;

  @IsInt()
  @Expose()
  @IsNotEmpty()
  readonly state: number;
}
