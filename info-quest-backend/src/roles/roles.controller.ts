// import {
//   Body,
//   Controller,
//   Delete,
//   Get,
//   Param,
//   Patch,
//   Post,
// } from '@nestjs/common';
//
// import { CreateRoleDto } from './dto/role.dto';
//
// import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
// import { RolesService } from './roles.service';
// import { UpdateRoleDto } from './dto/update-role.dto';
//
// @Controller('roles')
// export class RolesController {
//   constructor(private readonly rolesService: RolesService) {}
//
//   @Post()
//   create(@Body() createRoleDto: CreateRoleDto) {
//     return this.rolesService.create(createRoleDto);
//   }
//
//   @Get()
//   findAll(@Paginate() query: PaginateQuery) {
//     return this.rolesService.findAll(query);
//   }
//
//   @Get(':id')
//   findOne(@Param('id') id: number) {
//     return this.rolesService.findOne(id);
//   }
//
//   @Patch(':id')
//   update(@Param('id') id: number, @Body() updateRoleDto: UpdateRoleDto) {
//     return this.rolesService.update(id, updateRoleDto);
//   }
//
//   @Delete(':id')
//   async deleteRole(@Param('id') id: number): Promise<void> {
//     return this.rolesService.deleteRole(id);
//   }
// }
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CreateRoleDto } from './dto/role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RolesService } from './roles.service';
import { Paginate, PaginateQuery } from 'nestjs-paginate';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  async create(@Body() createRoleDto: CreateRoleDto) {
    try {
      return await this.rolesService.create(createRoleDto);
    } catch (error) {
      throw new HttpException('Failed to create role', HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async findAll(@Paginate() query: PaginateQuery) {
    try {
      return await this.rolesService.findAll(query);
    } catch (error) {
      throw new HttpException(
        'Failed to retrieve roles',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    try {
      const role = await this.rolesService.findOne(id);
      if (!role) {
        throw new HttpException('Role not found', HttpStatus.NOT_FOUND);
      }
      return role;
    } catch (error) {
      if (error.status === HttpStatus.NOT_FOUND) {
        throw error;
      }
      throw new HttpException(
        'Failed to retrieve role',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateRoleDto: UpdateRoleDto) {
    try {
      return await this.rolesService.update(id, updateRoleDto);
    } catch (error) {
      throw new HttpException('Failed to update role', HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  async deleteRole(@Param('id') id: number): Promise<void> {
    try {
      await this.rolesService.deleteRole(id);
    } catch (error) {
      throw new HttpException(
        'Failed to delete role',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
