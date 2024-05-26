import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { RequestUser } from '../auth/decorator/request-user.decorator';
import { User } from './entities/user.entity';
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { UsersService } from './users.service';
import { UpdateUserRequestDto } from './dto/update-user-request.dto';
import { AbilityFactory } from "../ability/ability.factory";

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService,
             // private readonly castleAbility: AbilityFactory,
              ) {}

  @Get('vacations')
  async getVacations(): Promise<any> {
    try {
      return await this.usersService.findAllVacations();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

// src/users/users.controller.ts
  @Get(':id/permissions')
  async getUserPermissions(@Param('id') id: number) {
    const permissions = await this.usersService.findOneUserPermissions(id);
    if (!permissions.length) {
      throw new NotFoundException('No permissions found for this user.');
    }
    return permissions;
  }


  @Get('profile')
  userProfile(@RequestUser() user: User): User {
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }

  // @Get(':id/ability')
  // async getUserAbility(@Param('id') id: string) {
  //   const user = await this.usersService.findOneWithOptions(
  //     { id: parseInt(id) },
  //     { relations: ['role', 'role.permissions'] }
  //   );
  //   const ability = this.castleAbility.createForUser(user);
  //   console.log(ability);
  //   return ability;
  // }

  @Get()
  findAll(@Paginate() query: PaginateQuery): Promise<Paginated<User>> {
    try {
      return this.usersService.findAll(query);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateUserRequestDto: UpdateUserRequestDto,
    @RequestUser() currentUser: User,
  ): Promise<User> {
    if (currentUser.id === id) {
      updateUserRequestDto = {
        name: updateUserRequestDto.name,
        email: updateUserRequestDto.email,
      };
    }

    return this.usersService.update(id, updateUserRequestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number, @RequestUser() user: User) {
    if (user.id === id) {
      throw new ForbiddenException('Cannot delete yourself');
    }

    return this.usersService.remove(id).catch(error => {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Failed to delete user:', error); // Logare pentru debugging
      throw new InternalServerErrorException(error.message);
    });
  }
}
