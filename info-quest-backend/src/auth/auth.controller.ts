import { Controller, Get, HttpException, HttpStatus, UseGuards } from "@nestjs/common";
import { PublicRoute } from './decorator/public-route.decorator';
import { RequestUser } from './decorator/request-user.decorator';
import { User } from '../users/entities/user.entity';
import { AuthService } from './auth.service';
import { GoogleGuard } from './guard/google-guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @PublicRoute()
  @Get('google-login')
  @UseGuards(GoogleGuard)
  async handleGoogleLoginSuccess(@RequestUser() requestUser: User) {
    try {
      return this.authService.login(requestUser.id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.FORBIDDEN);
    }
  }

}
