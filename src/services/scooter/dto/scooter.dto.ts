import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

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
