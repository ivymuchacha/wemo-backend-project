import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE, APP_GUARD } from '@nestjs/core';
import { UserModule } from 'src/modules/user/user.module';
import { TransformInterceptor } from 'src/common/interceptors/transform.interceptor';
import { HttpExceptionFilter } from 'src/common/filters/http-exception.filter';
import { DataModule } from 'src/modules/database/data.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { ScooterModule } from 'src/modules/scooter/scooter.module';
import { RentModule } from 'src/modules/rent/rent.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DataModule,
    UserModule,
    AuthModule,
    ScooterModule,
    RentModule
  ],
  providers: [
    JwtService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter
    },
    {
      provide: APP_PIPE,
      useClass: ValidationPipe
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    }
  ]
})
export class AppModule {}
