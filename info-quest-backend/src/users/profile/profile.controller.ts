import { Controller, Get } from '@nestjs/common';
import { RequestUser } from '../../auth/decorator/request-user.decorator';
import { User } from '../entities/user.entity';

@Controller('profile')
export class ProfileController {
  @Get()
  userProfile(@RequestUser() user: User): User {
    return user;
  }
}
