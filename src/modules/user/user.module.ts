import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from 'src/services/user/user.service';
import { User } from 'src/entity/users.entity';
import { Rent } from 'src/entity/rent.entity';
import { UserController } from 'src/controllers/user/user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Rent])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
