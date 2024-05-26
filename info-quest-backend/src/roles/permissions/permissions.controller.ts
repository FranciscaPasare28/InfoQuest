// // // import { PermissionsService } from './permissions.service';
// // // import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
// // // import { CreatePermissionRequestDto } from '../dto/permission-request.dto';
// // // import { Paginate, PaginateQuery } from 'nestjs-paginate';
// // // import { UpdatePermissionRequestDto } from '../dto/update-permission-request.dto';
// // //
// // // @Controller('permissions')
// // // export class PermissionsController {
// // //   constructor(private readonly permissionsService: PermissionsService) {}
// // //   @Post()
// // //   create(@Body() createPermissionDto: CreatePermissionRequestDto) {
// // //     return this.permissionsService.create({
// // //       ...createPermissionDto,
// // //       roles: null,
// // //     });
// // //   }
// // //
// // //   @Get()
// // //   findAll(@Paginate() query: PaginateQuery) {
// // //     return this.permissionsService.findAll(query);
// // //   }
// // //
// // //   @Get(':id')
// // //   findOne(@Param(':id') id: number) {
// // //     return this.permissionsService.findOne(id);
// // //   }
// // //
// // //   @Patch(':id')
// // //   update(
// // //     @Param(':id') id: number,
// // //     @Body() updatePermissionDto: UpdatePermissionRequestDto,
// // //   ) {
// // //     return this.permissionsService.update(id, updatePermissionDto);
// // //   }
// // // }
// import { Body, Controller, Get, Param, Patch, Post, HttpException, HttpStatus } from '@nestjs/common';
// import { CreatePermissionRequestDto } from '../dto/permission-request.dto';
// import { UpdatePermissionRequestDto } from '../dto/update-permission-request.dto';
// import { PermissionsService } from './permissions.service';
// import { Paginate, PaginateQuery } from 'nestjs-paginate';
//
// @Controller('permissions')
// export class PermissionsController {
//   constructor(private readonly permissionsService: PermissionsService) {}
//
//   @Post()
//   async create(@Body() createPermissionDto: CreatePermissionRequestDto) {
//     try {
//       return await this.permissionsService.create({
//         ...createPermissionDto,
//         roles: null,
//       });
//     } catch (error) {
//       throw new HttpException('Failed to create permission', HttpStatus.BAD_REQUEST);
//     }
//   }
//
//   @Get()
//   async findAll(@Paginate() query: PaginateQuery) {
//     try {
//       return await this.permissionsService.findAll(query);
//     } catch (error) {
//       throw new HttpException('Failed to retrieve permissions', HttpStatus.INTERNAL_SERVER_ERROR);
//     }
//   }
//
//   @Get(':id')
//   async findOne(@Param('id') id: number) {
//     try {
//       const permission = await this.permissionsService.findOne(id);
//       if (!permission) {
//         throw new HttpException('Permission not found', HttpStatus.NOT_FOUND);
//       }
//       return permission;
//     } catch (error) {
//       if (error instanceof HttpException) {
//         throw error;
//       }
//       throw new HttpException('Failed to retrieve permission', HttpStatus.INTERNAL_SERVER_ERROR);
//     }
//   }
//
//   @Patch(':id')
//   async update(
//     @Param('id') id: number,
//     @Body() updatePermissionDto: UpdatePermissionRequestDto,
//   ) {
//     try {
//       return await this.permissionsService.update(id, updatePermissionDto);
//     } catch (error) {
//       throw new HttpException('Failed to update permission', HttpStatus.BAD_REQUEST);
//     }
//   }
// }
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CreatePermissionRequestDto } from '../dto/permission-request.dto';
import { UpdatePermissionRequestDto } from '../dto/update-permission-request.dto';
import { PermissionsService } from './permissions.service';
import { Paginate, PaginateQuery } from 'nestjs-paginate';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  async create(@Body() createPermissionDto: CreatePermissionRequestDto) {
    try {
      return await this.permissionsService.create({
        ...createPermissionDto,
        roles: null, // Ensure roles are explicitly set to null
      });
    } catch (error) {
      throw new HttpException(
        'Failed to create permission',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  async findAll(@Paginate() query: PaginateQuery) {
    try {
      return await this.permissionsService.findAll(query);
    } catch (error) {
      throw new HttpException(
        'Failed to retrieve permissions',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    try {
      const permission = await this.permissionsService.findOne(id);
      if (!permission) {
        throw new HttpException('Permission not found', HttpStatus.NOT_FOUND);
      }
      return permission;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to retrieve permission',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updatePermissionDto: UpdatePermissionRequestDto,
  ) {
    try {
      return await this.permissionsService.update(id, updatePermissionDto);
    } catch (error) {
      throw new HttpException(
        'Failed to update permission',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
