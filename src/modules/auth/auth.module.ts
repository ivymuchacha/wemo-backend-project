import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { UserModule } from 'src/modules/user/user.module';
import { AuthService } from 'src/services/auth/auth.service';
import { AuthController } from 'src/controllers/auth/auth.controller';

@Module({
  imports: [
    UserModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        global: true,
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '12h' }
      })
    })
  ],
  providers: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}
