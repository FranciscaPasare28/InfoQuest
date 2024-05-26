import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserSecurityService } from './user-security.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Role } from '../roles/entities/role.entity';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ProfileController } from './profile/profile.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role]),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_ACCESS_SECRET'),
        signOptions: {
          expiresIn: '24h',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [UsersController, ProfileController],
  providers: [UsersService, UserSecurityService, ConfigService],
  exports: [UsersService, UserSecurityService, ConfigService],
})
export class UsersModule {}
