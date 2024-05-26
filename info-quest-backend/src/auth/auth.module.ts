import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { GoogleStrategy } from './strategies/GoogleStrategy';
import { AtStrategy } from './strategies/at.stategy';
import { APP_GUARD } from '@nestjs/core';
import { AtAuthGuard } from './guard/at-auth.guard';

// @Module({
//   imports: [UsersModule],
//   controllers: [AuthController],
//   providers: [
//     AuthService,
//     GoogleStrategy,
//     AtStrategy,
//     {
//       provide: APP_GUARD,
//       useClass: AtAuthGuard,
//     },
//   ],
// })
// export class AuthModule {}
const strategies = [GoogleStrategy, AtStrategy];
const guards = [
  {
    provide: APP_GUARD,
    useClass: AtAuthGuard,
  },
];

@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [AuthService, ...strategies, ...guards],
})
export class AuthModule {}
